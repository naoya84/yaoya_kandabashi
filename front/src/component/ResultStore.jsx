import { Link, useParams, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/style/ResultStore.css';
import mapImg from '../assets/image/map.jpg';
import { useAuth } from '../contexts/AuthContext';

export default function ResultStore() {
	const { storeId } = useParams();
	const [storeProductDetails, setStoreProductDetails] = useState([]);
	const location = useLocation();
	const [storeName, setStoreName] = useState();
	const { isAuthenticated, userId, userName } = useAuth();

	useEffect(() => {
		setStoreName(location.state.storeName);
		// axios
		//   .get(`/api/customers/${3}/result/shopping?store_id=${storeId}`) //後でユーザーIDに書き換え
		//   .then((response) => {
		//     console.log('response', response.data);
		//     setStoreProductDetails(response.data);
		//   })
		//   .catch((error) => {
		//     console.log(error);
		//     alert('取得に失敗しました');
		//   });

		const fetchData_param = async (storeId) => {
			try {
				// const url = import.meta.env.VITE_DEVELOPMENT_BACKEND_URL || "https://yaoya-test2.onrender.com";
				let url;
				if (process.env.NODE_ENV === 'development') {
					url = import.meta.env.VITE_DEVELOPMENT_BACKEND_URL;
				} else {
					url = 'https://yaoya-test2.onrender.com';
				}
				const response = await fetch(url + `/api/customers/${userId}/result/shopping?store_id=${storeId}`, {
					credentials: 'include',
				});
				const data = await response.json();

				if (response.ok) {
					console.log('post_ok', response, data);
					setStoreProductDetails(data);
				} else {
					console.log('post_ng', response);
					return [];
				}
			} catch (error) {
				console.log('error', error);
			}
		};
		fetchData_param(storeId);
		// 以下、レスポンス来たと仮定して。。。
		// const arr = [
		//   { id: 3, storeId: 3, productName: '豚肉', piece: 10, unit: '個', flag: false, storeName: 'セブンイレブン' },
		//   { id: 4, storeId: 3, productName: 'あじ', piece: 2, unit: '個', flag: false, storeName: 'セブンイレブン' },
		//   { id: 5, storeId: 3, productName: '塩', piece: 3, unit: '個', flag: false, storeName: 'セブンイレブン' },
		// ];

		// setStoreProductDetails(arr);
	}, []);

	// console.log(storeProductDetails);

	const product = storeProductDetails.map((el, index) => {
		return (
			<ul className='details-ul' key={index}>
				<React.Fragment key={`fragment-${index}`}>
					<li key={`item-${index}`}>
						{el.productName}: ({el.piece}
						{el.unit})
					</li>
				</React.Fragment>
			</ul>
		);
	});

	return (
		<>
			<div className='page-title'>RESULT Details</div>
			<div className='details-container'>
				<div className='details-box'>
					<h2 className='details-title'>{storeName}</h2>
					<div className='food-container'>
						<h2 className='details-title'>【食材詳細】</h2>
						{product}
					</div>
					<div className='root-container'>
						<h2 className='details-title'>【ルート】</h2>
						<p>距離:1.5km</p>
						<p>所要時間:12分</p>
					</div>
					<div className='img-container'>
						<img className='details-img' src={mapImg} alt='' />
					</div>
				</div>
			</div>
		</>
	);
}
