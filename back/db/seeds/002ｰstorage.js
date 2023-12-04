exports.seed = async function (knex) {
    // storageテーブルのレコード数を確認
    const count = await knex('storage').count('id as CNT');
    if (count[0].CNT > 0) {
        // レコードが存在する場合は何もしない
        return;
    }

    // シードデータの準備
    const storageSample = [];
    const foodsTemplate = [
        'かぼちゃ', '人参', '玉ねぎ', 'りんご', 'バナナ', 'ぶどう', '豚肉', '鶏肉', '牛肉', '鮭', 'さんま', 'あじ', '塩', '醤油', 'みりん',
    ];

    for (const unit of ['個', '1/2個', 'パック', '本', '1/2本', '瓶', '匹']) {
        let prices = [100, 150, 80];
        prices.sort(() => Math.random() - 0.5);
        let [price1, price2, price3] = prices;

        foodsTemplate.forEach((item) => {
            storageSample.push({ storeId: 1, productName: item, unit: unit, stock: 100, price: price1 });
            storageSample.push({ storeId: 2, productName: item, unit: unit, stock: 100, price: price2 });
            storageSample.push({ storeId: 3, productName: item, unit: unit, stock: 100, price: price3 });
        });
    }

    // シードデータを挿入
    return knex('storage').insert(storageSample);
};
