exports.seed = function (knex) {
	const storageSample = [];
	const foodsTemplate = [
		'かぼちゃ',
		'人参',
		'玉ねぎ',
		'りんご',
		'バナナ',
		'ぶどう',
		'豚肉',
		'鶏肉',
		'牛肉',
		'鮭',
		'さんま',
		'あじ',
		'塩',
		'醤油',
		'みりん',
	];

	for (const unit of ['個', '1/2個', 'パック', '本', '1/2本', '瓶', '匹']) {
        //ランダム
        let prices = [100, 150, 80];
        prices.sort(() => Math.random() - 0.5);
        let [price1, price2, price3] = prices;

		//店舗１
		foodsTemplate.forEach((item, i) => {
			storageSample.push({
				storeId: 1,
				productName: item,
				unit: unit,
				stock: 100,
				price: price1,
			});
		});

		//店舗2
		foodsTemplate.forEach((item, i) => {
			storageSample.push({
				storeId: 2,
				productName: item,
				unit: unit,
				stock: 100,
				price: price2,
			});
		});

		//店舗3
		foodsTemplate.forEach((item, i) => {
			storageSample.push({
				storeId: 3,
				productName: item,
				unit: unit,
				stock: 100,
				price: price3,
			});
		});
	}

	// テーブル内の既存データを削除
	return knex('storage')
		.del()
		.then(function () {
			// 新しいシードデータを挿入
			return knex('storage').insert(storageSample);
		});
};
