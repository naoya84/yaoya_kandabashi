exports.seed = function (knex) {
  // ダミーデータの生成
  let seedData = [];
  for (let i = 1; i <= 50; i++) {
    seedData.push({
      id: i,
      userId: Math.random() < 0.5 ? 1 : 2, // userIdは1または2
      storeId: Math.random() < 0.5 ? 1 : 2, // storeIdも1または2
      productName: `商品${i}`,
      flag: Math.random() < 0.5, // 約50%の確率でtrueまたはfalse
      time: new Date(), // 現在のタイムスタンプ
    });
  }

  // テーブル内の既存データを削除
  return knex("shopping_list")
    .del()
    .then(function () {
      // 新しいシードデータを挿入
      return knex("shopping_list").insert(seedData);
    });
};
