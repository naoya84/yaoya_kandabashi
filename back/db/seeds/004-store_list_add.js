exports.seed = function (knex) {
  // 25件の店名データを準備
  const storeNames = [
    'イオンモール長久手',
    'マックスバリュー米野木店',
    'バロー',
    'プライムツリー赤池',
    'ワークマン',
    'セブンイレブン',
    'ローソン',
    'ららぽーと愛知東郷店',
    '酒ゃビッグ',
    'CAINZ',
    'DAISO',
    '3COINS',
    'エプロン',
  ];

  const coordinate = [
    [35.1183, 137.0224],
    [35.1325, 137.0455],
    [35.1237, 137.0577],
    [35.1211, 137.0417],
    [35.0989, 137.0469],
    [35.1122, 137.0507],
    [35.1732, 137.0498],
    [35.1259, 137.0681],
    [35.128, 137.1643],
    [35.112, 137.0577],
    [35.1275, 137.0216],
    [35.1255, 137.1373],
    [35.1209, 137.1366],
  ];

  // ダミーデータの生成
  const seedData = storeNames.map((name, i) => ({
    storeName: name,
    northLatitude: coordinate[i][0],
    eastLongitude: coordinate[i][1],
  }));

  // テーブル内の既存データを削除
  return knex('store_list')
    .del()
    .then(function () {
      // 新しいシードデータを挿入
      return knex('store_list').insert(seedData);
    });
};
