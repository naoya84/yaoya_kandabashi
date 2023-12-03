const express = require('express');
const app = express();
const knex = require('./knex');
const cors = require('cors');
const path = require('path');
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
app.use(cors());

//セッションの保存設定-----------
app.use(
	session({
		store: new pgSession({
			knex: knex, // 既存のKnexインスタンスを使用
			tableName: 'session', // セッションデータを保存するテーブル名
		}),
		secret: 'himitsudayo',
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 30 * 60 * 1000, // 30分間の有効期限
		},
	})
);

//ローカル認証-----------------
passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await knex('users').where({ username: username }).first();
			if (!user || user.password !== password) {
				return done(null, false, { message: 'Invalid username or password' });
			}
			return done(null, user);
		} catch (error) {
			return done(error);
		}
	})
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await knex('users').where({ id: id }).first();
	done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

// API =====================================================================

//ログイン認証-------------------
app.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({ message: info.message });
		}
		req.logIn(user, (err) => {
			if (err) {
				return next(err);
			}
			return res.status(200).json({ message: 'Login successful' });
		});
	})(req, res, next);
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
