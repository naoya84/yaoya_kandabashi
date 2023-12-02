exports.seed = function (knex) {
  // ダミーデータの生成
  const shoppingListSample = [
    {
      id: 1,
      userId: 1,
      storeId: 2,
      productName: 'かぼちゃ',
      piece: 1,
      unit: '1/2個',
      flag: true,
      time: new Date(), // 現在のタイムスタンプ
    },
    {
      id: 2,
      userId: 1,
      storeId: 3,
      productName: 'りんご',
      piece: 3,
      unit: '個',
      flag: true,
      time: new Date(), // 現在のタイムスタンプ
    },
    {
      id: 3,
      userId: 1,
      storeId: 2,
      productName: '牛肉',
      piece: 300,
      unit: 'パック',
      flag: true,
      time: new Date(), // 現在のタイムスタンプ
    },
  ];

  // for (let i = 1; i <= 50; i++) {
  //   seedData.push({
  //     id: i,
  //     userId: Math.random() < 0.5 ? 1 : 2, // userIdは1または2
  //     storeId: Math.random() < 0.5 ? 1 : 2, // storeIdも1または2
  //     productName: `商品${i}`,
  //     flag: Math.random() < 0.5, // 約50%の確率でtrueまたはfalse
  //     time: new Date(), // 現在のタイムスタンプ
  //   });
  // }

  // テーブル内の既存データを削除
  return knex('shopping_list')
    .del()
    .then(function () {
      // 新しいシードデータを挿入
      return knex('shopping_list').insert(shoppingListSample);
    });
};
