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

	//店舗１
	foodsTemplate.forEach((item, i) => {
		storageSample.push({
			storeId: 1,
			productName: item,
			unit: '本',
			stock: 100,
			price: 120,
		});
	});

	//店舗２
	storageSample.push({
		storeId: 2,
		productName: '人参',
		unit: '本',
		stock: 80,
		price: 120,
	});
	foodsTemplate.forEach((item, i) => {
		if (i % 2 === 1) {
			storageSample.push({
				storeId: 2,
				productName: item,
				unit: '匹',
				stock: 200,
				price: 240,
			});
		}
	});

	//店舗３
	storageSample.push({
		storeId: 3,
		productName: '人参',
		unit: '本',
		stock: 3,
		price: 50,
	});
	foodsTemplate.forEach((item, i) => {
		if (i % 2 === 0) {
			storageSample.push({
				storeId: 3,
				productName: item,
				unit: '個',
				stock: 200,
				price: 240,
			});
		}
	});

	// テーブル内の既存データを削除
	return knex('storage')
		.del()
		.then(function () {
			// 新しいシードデータを挿入
			return knex('storage').insert(storageSample);
		});
};
