exports.seed = function (knex) {
  // 25件の店名データを準備
  const storeNames = [
    "プライムツリー赤池",
    "ワークマン",
    "セブンイレブン",
    "ローソン",
    "ららぽーと愛知東郷店",
    "BigA",
    "長久手イオン",
    "マックスバリュー日進店",
    "CAINZ",
    "DAISO",
    "3COINS",
    "バロー",
    "エプロン",
  ];

  // ダミーデータの生成
  const seedData = storeNames.map((name, index) => ({
    // id: index + 1,
    storeName: name,
  }));

  // テーブル内の既存データを削除
  return knex("store_list")
    .del()
    .then(function () {
      // 新しいシードデータを挿入
      return knex("store_list").insert(seedData);
    });
};
