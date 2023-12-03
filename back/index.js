const express = require('express');
const app = express();
const knex = require('./knex');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//各種設定==================================================================
//body容量--------------------
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json());

// cors設定-------------------
let corsOptions;
if(process.env.NODE_ENV === "development"){
	corsOptions = {
		origin: 'http://localhost:5173', // またはReactアプリケーションの実際のオリジン
		credentials: true, // クロスオリジンリクエストでのクッキー送信を許可
	};
}else{
	corsOptions = {
		origin: 'https://yaoya-test2.onrender.com', // 
		credentials: true, // クロスオリジンリクエストでのクッキー送信を許可
	};
}
app.use(cors(corsOptions));

//セッションの保存設定-----------
let store;
if(process.env.NODE_ENV === "development"){
	store = new pgSession({
		conString: 'postgresql://user:@127.0.0.1/yaoya',
		tableName: 'session',
	})
}else{
	store = new pgSession({
		conString: process.env.DATABASE_URL,
		tableName: 'session',
	})
}
app.use(
	session({
		store: store,
		secret: 'himitsudayo',
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 30 * 60 * 1000, // ブラウザ側でのセッション情報の保持期間を30分間に設定
		},
	})
);

//ローカル認証-----------------
passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await knex('users').where({ username: username }).first();
			if (user) {
				const hash = crypto.createHash('sha256');
				const hashedInputPass = hash.update(user.salt + password).digest('hex');
				if (hashedInputPass === user.hashedPass) {
					return done(null, user);
				} else {
					return done(null, false, { message: '認証情報が正しくありません' });
				}
			} else {
				return done(null, false, { message: '認証情報が正しくありません' });
			}
		} catch (error) {
			console.log('error_inLocalStrategy', error);
			return done(null, false, { message: '認証中にエラーが発生しました。' });
		}
	})
);

passport.serializeUser((user, done) => {
	try {
		console.log('serializeUser');
		done(null, user.id);
	} catch (error) {
		console.log('error_inSerializeUser', error);
	}
});

passport.deserializeUser(async (id, done) => {
	//このidは、ブラウザからのリクエストに添付されたセッションIDをもとに、
	//sessionテーブル内に保存されたuseridを探してきたもの。
	const user = await knex('users').where({ id: id }).first();
	done(null, user);
	//この処理はreqオブジェクトにuserを追加する意味。
	//後のAPIにてreq.userとするとアクセス可能。
	//ただしログイン認証できないとuserはfalsyになる。
});

app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(req, res, next) {
	console.log('isAuthentiocated', req.isAuthenticated());
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).json({ message: 'Unauthorized: Access is denied due to invalid credentials.' });
}

// API =====================================================================

//ログイン認証-------------------
app.post('/login', (req, res, next) => {
	try {
		passport.authenticate('local', (err, user, info) => {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.status(401).json({ message: info.message });
			}
			console.log('rec_login');
			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				}
				return res.status(200).json({ id: user.id });
			});
		})(req, res, next);
	} catch (error) {
		console.log('catch_Login', error);
	}
});

//買い物リストの保存--------------
app.post('/api/customers/:id/shopping_list', isAuthenticated, async (req, res) => {
	console.log('postリクエスト受け取り----------');

	//受け取った内容
	const bodyArr = req.body;
	const customerId = req.params.id;

	try {
		//アイテムの数だけ、for文でshopping_listに追加していく
		for (let i = 0; i < bodyArr.length; i++) {
			//req.bodyから必要情報取り出し
			const shopping = bodyArr[i].shopping;
			const quantity = bodyArr[i].quantity;
			const unit = bodyArr[i].unit;

			//最適なstoreIdを設定する(まずは一番安いものを持ってくる)
			let minPrice;
			await knex('storage')
				.where('productName', shopping)
				.where('stock', '>', quantity)
				.where('unit', '=', unit)
				.min('price as minPrice')
				.then(([result]) => {
					minPrice = result.minPrice;
				});

			//最適なstoreIdを設定する(minPriceと同じstoreIdを探す)
			let storeId;
			await knex('storage')
				.where({ productName: shopping, price: minPrice, unit: unit })
				.select('storeId')
				.then(([result]) => {
					storeId = result.storeId;
				});

			//knexでデータ追加
			await knex('shopping_list')
				.insert({
					userId: customerId,
					storeId: storeId,
					productName: shopping,
					piece: quantity,
					unit: unit,
					flag: false,
					time: new Date(),
				})
				.then(() => {
					console.log('post対応完了');
				});
		}
		res.status(200).send('post対応完了');
	} catch (error) {
		console.error(error);
		return res.status(500).send('エラーが発生しました');
	}
});

//ユーザー毎の買い物リストを取得----
app.get('/api/customers/:id/result/shopping', isAuthenticated, async (req, res) => {
	const userId = req.params.id;

	try {
		const query = knex('shopping_list')
			.select(
				'shopping_list.id',
				'shopping_list.storeId',
				'shopping_list.productName',
				'shopping_list.piece',
				'shopping_list.unit',
				'shopping_list.flag',
				'store_list.storeName'
			)
			.join('store_list', 'shopping_list.storeId', '=', 'store_list.id')
			.where('shopping_list.userId', userId);

		if (req.query.store_id) {
			query.andWhere('shopping_list.storeId', req.query.store_id);
		}

		const data = await query;
		res.status(200).send(data);
	} catch (error) {
		console.error(error);
		res.status(400).send(error.message); // エラーメッセージを送信
	}
});

//買い物済みの登録---------------
app.patch('/api/udate_shopping_status/:id', isAuthenticated, (req, res) => {
	try {
		const id = req.params.id;
		const idArr = req.body;

		const promiseArr = idArr.map((id) => knex('shopping_list').where({ id: id }).update({ flag: true }));
		console.log('promiseArr1', promiseArr);
		Promise.all(promiseArr).then((res) => res);

		res.status(200).end();
	} catch (error) {
		console.log('promisError', error);
		res.status(500).send(error);
	}
});

app.use(express.static(path.resolve(__dirname, '../front', 'dist')));
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../front', 'dist', 'index.html'));
});

app.listen(4242, () => {
	console.log('server on PORT4242');
});
