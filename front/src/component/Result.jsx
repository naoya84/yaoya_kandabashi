import { Link } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../assets/style/Result.css';
import storeImg from '../assets/image/store.jpg';
import shoppingImg from '../assets/image/shopping.jpg';

export default function Result() {
	const [storeProduct, setStoreProduct] = useState([]);
	const [checkBoxes, setCheckBoxes] = useState({});
	const { isAuthenticated, userId, userName } = useAuth();

	const fetchData = async () => {
		try {
			const url = import.meta.env.VITE_DEVELOPMENT_BACKEND_URL || import.meta.env.VITE_PRODUCTION_BACKEND_URL;
			const response = await fetch(url + `/api/customers/${userId}/result/shopping`, {credentials: 'include'});
			const data = await response.json();

			if (response.ok) {
				console.log('post_ok', response, data);
				setStoreProduct(data);
			} else {
				console.log('post_ng', response);
				return [];
			}
		} catch (error) {
			console.log('error', error);
		}
	};

	// 初回レンダリング時に以下を実行
	useEffect(() => {
		console.log('ここだよ');
		// バックエンドにGETリクエストを送り、shopping_listテーブルのデータを全て取得する。

		fetchData();

		// 受け取った配列の数分だけ、checkBoxesにflagを格納する
		// const numCheckboxes = arr.length;
		const numCheckboxes = storeProduct.length;

		const initialCheckboxes = Array.from({ length: numCheckboxes }, (_, index) => ({
			[`checkBox${index + 1}`]: false,
		})).reduce((acc, checkbox) => ({ ...acc, ...checkbox }), {});

		setCheckBoxes(initialCheckboxes);
	}, []);

	// 買い物リストの商品のレンダリング
	const product = storeProduct.map((el, index) => {
		return (
			<div className='shopping-label' key={index}>
				<label key={`item-${index}`}>
					{!el.flag && <input type='checkbox' onChange={() => handleCheckBoxChange(`checkBox${index + 1}`)} />}
					{el.productName} ({el.piece}
					{el.unit})
				</label>
				{el.flag && <span>購入済み</span>}
			</div>
		);
	});

	// ショップの提案のストアのレンダリング
	const store = useMemo(() => {
		// console.log('useMemoきてる？？？？？');
		const storeFlagFalseArray = storeProduct.filter((el) => !el.flag); // flagがtrueのオブジェクトは取り除く
		const storeArray = storeFlagFalseArray.map((el) => {
			return JSON.stringify({ storeId: el.storeId, storeName: el.storeName });
		});
		const uniqStoreArray = Array.from(new Set([...storeArray])).map((el) => JSON.parse(el));
		// console.log('uniqStoreArray', uniqStoreArray);

		return uniqStoreArray.map((el, index) => {
			return (
				<React.Fragment key={index}>
					<Link to={`/result/store/${el.storeId}`} state={{ storeName: el.storeName }} className='Link'>
						{el.storeName}
					</Link>
				</React.Fragment>
			);
		});
	}, [storeProduct]);

	// チェックボックスの変更が有った時のハンドラー
	const handleCheckBoxChange = (checkBoxName) => {
		// console.log(checkBoxName);
		setCheckBoxes((el) => ({
			...el,
			[checkBoxName]: !el[checkBoxName],
		}));
	};

	// 選択した商品を購入済みに変更するボタンをクリックした時のハンドラー
	const handleFlagChangeClick = async () => {
		// console.log('クリックした！');
		// console.log(checkBoxes);
		const checkedCheckboxes = Object.keys(checkBoxes).filter((el) => checkBoxes[el]);
		const idArr = checkedCheckboxes.map((el) => el.split('x')[1]); // PATCHで投げるbody

		const url = import.meta.env.VITE_DEVELOPMENT_BACKEND_URL || import.meta.env.VITE_PRODUCTION_BACKEND_URL;
		const response = await fetch(url + `/api/udate_shopping_status/${userId}`, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(idArr),
		});

		if (response.ok) {
			console.log('patch成功');
			fetchData();
		} else {
			console.log('patch失敗');
		}

		// [1,2,3]
		// console.log('Checked Checkboxes:', idArr);

		// try {
		//   const response = await axios.patch('', {
		//     data: idArr
		//   });
		//   setStoreProduct(response.data);
		//   console.log('PATCHリクエストが成功しました。');
		// } catch (error) {
		//   console.error('PATCHリクエストでエラーが発生しました。', error);
		// }

		// 返ってきた配列をstoreProductに格納する => 再レンダリング
		// const arr = [
		// 	{
		// 		id: 1,
		// 		storeId: 1,
		// 		productName: 'ヨーグルト',
		// 		piece: 5,
		// 		unit: '個',
		// 		flag: false,
		// 		storeName: 'プライムツリー赤池',
		// 	},
		// 	{ id: 2, storeId: 2, productName: 'かぼちゃ', piece: 1, unit: '個', flag: true, storeName: 'ワークマン' },
		// 	{ id: 3, storeId: 3, productName: '豚肉', piece: 10, unit: '個', flag: false, storeName: 'セブンイレブン' },
		// 	{ id: 4, storeId: 3, productName: 'あじ', piece: 2, unit: '個', flag: false, storeName: 'セブンイレブン' },
		// 	{ id: 5, storeId: 3, productName: '塩', piece: 3, unit: '個', flag: false, storeName: 'セブンイレブン' },
		// ];

		// setStoreProduct(arr);
	};

	return (
		<>
			<div className='page-title'>RESULT</div>
			<div className='result-container'>
				<div className='shopping-list' style={{ backgroundImage: `url(${shoppingImg})` }}>
					<h1>買い物リスト</h1>
					<div className='shopping-box'>{product}</div>
					<button className='shopping-btn' onClick={handleFlagChangeClick}>
						選択した商品を購入済みに変更する
					</button>
				</div>
				<div className='store-list' style={{ backgroundImage: `url(${storeImg})` }}>
					<h1>ショップの提案</h1>
					<div className='store-box'>{store}</div>
				</div>
			</div>
		</>
	);
}
