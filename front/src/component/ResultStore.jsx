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

    const fetchData_param = async (storeId) => {
      try {
        const url = import.meta.env.VITE_DEVELOPMENT_BACKEND_URL || 'https://yaoya-lenzzzz.onrender.com';
        const response = await fetch(url + `/api/customers/${userId}/result/shopping?store_id=${storeId}`);
        const data = await response.json();

        if (response.ok) {
          // console.log('post_ok', response, data);
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
  }, []);

  const product = storeProductDetails.map((el, index) => {
    return (
      <ul className="details-ul" key={index}>
        <React.Fragment key={`fragment-${index}`}>
          <li key={`item-${index}`}>
            <span className="bold-span">{el.productName}</span> ({el.piece}) [{el.unit}]
          </li>
        </React.Fragment>
      </ul>
    );
  });

  return (
    <>
      <div className="page-title">RESULT Details</div>
      <div className="details-container">
        <div className="details-box">
          <h2 className="details-title">{storeName}</h2>
          <div className="food-container">
            <h2 className="details-title">【食材詳細】</h2>
            {product}
          </div>
          <div className="root-container">
            <h2 className="details-title">【ルート】</h2>
            <p>距離:1.5km</p>
            <p>所要時間:12分</p>
          </div>
          <div className="img-container">
            <img className="details-img" src={mapImg} alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
