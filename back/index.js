const express = require('express');
const app = express();
const knex = require('./knex');
const cors = require('cors');
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json()); //JSON形式のファイルを扱えるようにする
app.use(cors());

//購入する商品を送信する　-> shipping_list（id:既存＋１,userId:現状持って来れる？今後はどうとる？,storeId:なにを基準？,productName,piece,flag,time）に追加する。
app.post('/api/customers/:id/shopping_list', async (req, res) => {
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

//あるユーザーが提案された店の商品を取得する
app.get('/api/customers/:id/result/shopping', async (req, res) => {
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

//買い物が済んだらflagをtrueにする
app.patch('/api/udate_shopping_status/:id', (req, res) => {
	try {
		const id = req.params.id;
		const idArr = req.body;

		const promiseArr = idArr.map(id=>
			knex('shopping_list')
				.where({id: id})
				.update({ flag: true })
		)
		console.log('promiseArr1',promiseArr);
		Promise.all(promiseArr).then(res => res)
			
		res.status(200).end();
	} catch (error) {
		console.log('promisError',error)
		res.status(500).send(error);
	}
});

//あるユーザーが送信した商品が購入できる店を取得する
app.get('/api/customers/:id/result/store', async (req, res) => {
	//カスタマーidを取得
	const customerId = req.params.id;
	//フロントに渡す変数を定義
	let resultArray;
	await knex('shopping_list')
		.where({ userId: customerId, flag: false })
		.select('store_list.id', 'store_list.storeName')
		.join('store_list', 'shopping_list.storeId', '=', 'store_list.id')
		.then((data) => {
			resultArray = data;
		})
		.then(() => {
			console.log('🚀 ~ file: index.js:87 ~ app.get ~ result:', resultArray);
			res.status(200).send(resultArray);
		});
});

//全てのお店の情報を取得する
app.get('/api/store', async (req, res) => {
	await knex
		.select()
		.from('store_list')
		.then((data) => {
			return data;
		})
		.then((data) => {
			res.status(200).send(data); //dataは配列
		});
});

app.use(express.static(path.resolve(__dirname, '../front', 'dist')));
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../front', 'dist', 'index.html'));
});

app.listen(4242, () => {
	console.log('server on PORT4242');
});
