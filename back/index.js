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

// app.use(express.static('public'));

let date = new Date();

//購入する商品を送信する　-> shipping_list（id:既存＋１,userId:現状持って来れる？今後はどうとる？,storeId:なにを基準？,productName,piece,flag,time）に追加する。
app.post('/api/customers/:id/shopping_list', async (req, res) => {
  console.log('postリクエスト受け取り----------');

  //受け取った内容をdataに格納
  const data = req.body;
  console.log('🚀 ~ file: index.js:14 ~ app.post ~ data:', data);

  //全アイテム共通の変数を作成
  const customerId = req.params.id;
  console.log('🚀 ~ file: index.js:12 ~ app.post ~ customerId:', customerId);
  const flag = false; //デフォルトは全てfalseにする
  console.log('🚀 ~ file: index.js:22 ~ app.post ~ flag:', flag);
  const time = date.toLocaleString();
  console.log('🚀 ~ file: index.js:24 ~ app.post ~ time:', time);

  //アイテム数を確認
  const Num = data.length;

  //アイテムの数だけ、for文でshopping_listに追加していく
  for (let i = 0; i < Num; i++) {
    //req.bodyから必要情報取り出し
    const shopping = data[i].shopping;
    const amount = data[i].count;

    //現在のshopping_listからidが１番大きいものを抜き出して今から登録するアイテムのidを設定
    let id;
    await knex('shopping_list')
      .max('id as maxId')
      .then(([result]) => {
        id = result.maxId + 1;
        console.log('🚀 ~ file: index.js:28 ~ app.post ~ id:', id);
      });

    //最適なstoreIdを設定する(まずは一番安いものを持ってくる)
    let minPrice;
    await knex('storage')
      .where('productName', shopping)
      .where('piece', '>', amount)
      .min('price as minPrice')
      .then(([result]) => {
        minPrice = result.minPrice;
        console.log('🚀 ~ file: index.js:39 ~ app.post ~ minPrice:', minPrice);
      });

    //最適なstoreIdを設定する(minPriceと同じstoreIdを探す)
    let storeId;
    await knex('storage')
      .where({ productName: shopping, price: minPrice })
      .select('storeId')
      .then(([result]) => {
        storeId = result.storeId;
        console.log('🚀 ~ file: index.js:47 ~ app.post ~ storeId:', storeId);
      });

    //１つのアイテムに対して安い順番で３候補持ってきて、場所をまとめたパターンと最安値パターンの２ルートは水曜日以降で作りたい。

    //knexでデータ追加
    await knex('shopping_list')
      .insert({
        id: id,
        userId: customerId,
        storeId: storeId,
        productName: shopping,
        piece: amount,
        flag: flag,
        time: time,
      })
      .then(() => {
        res.status(200).send('post対応完了');
      });
  }
});

//あるユーザーが送信した商品が購入できる店を取得する
app.get('/api/customers/:id/result/store', async (req, res) => {
  //カスタマーidを取得
  const customerId = req.params.id;
  // const customerId = Number(req.params.id);

  //フロントに渡す変数を定義
  let resultArray;
  await knex('store_list')
    .where({ userId: customerId, flag: false })
    .select(
      'store_list.id',
      'store_list.storeName',
      'shopping_list.productName'
    )
    .join('shopping_list', 'shopping_list.storeId', '=', 'store_list.id')
    .then((data) => {
      resultArray = data;
    })
    .then(() => {
      console.log('🚀 ~ file: index.js:87 ~ app.get ~ result:', resultArray);
      res.status(200).send(resultArray);
    });
});

//あるユーザーが提案された店の商品を取得する
app.get('/api/customers/:id/result/shopping', async (req, res) => {
  //storeIdを取得
  const storeId = req.query.store_id;
  console.log('🚀 ~ file: index.js:105 ~ app.get ~ storeId:', storeId);
  const customerId = req.params.id;
  console.log('🚀 ~ file: index.js:108 ~ app.get ~ customerId:', customerId);

  await knex('shopping_list')
    .where({ userId: customerId, flag: false, storeId: storeId })
    .select('productName')
    // .join("storage", "shopping_list.storeId", "=", "storage.storeId")
    .then((data) => {
      console.log('🚀 ~ file: index.js:114 ~ .then ~ data:', data);
      res.status(200).send(data);
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

//ある店が持っている商品を取得する

//あるユーザーの情報を取得する

//あるユーザーの登録履歴を取得する

//登録した商品リストを削除する

// app.get("/", async (req, res) => {
//   const user = await knex
//     .select()
//     .from("game")
//     .then((data) => {
//       return data;
//     })
//     .then((data) => {
//       res.send(data); //dataは配列
//     });
// });

// app.get('/', (req, res) => {
//   res.status(200);
//   res.sendFile('/index.html');
// });

app.use(express.static(path.resolve(__dirname, '../front', 'dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front', 'dist', 'index.html'));
});

app.listen(4242, () => {
  console.log('server on PORT4242');
});
