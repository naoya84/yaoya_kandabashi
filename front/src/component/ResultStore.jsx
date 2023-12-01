import { Link, useParams, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/style/ResultStore.css';
import mapImg from '../assets/image/map.jpg';

export default function ResultStore() {
  //   const { team } = props;
  const [shopping, setShopping] = useState([]);
  const { storeId } = useParams();
  const [storeName, setStoreName] = useState();
  const location = useLocation();

  useEffect(() => {
    axios
      .get(`/api/customers/${3}/result/shopping?store_id=${storeId}`) //後でユーザーIDに書き換え
      .then((response) => {
        setShopping(response.data);
        setStoreName(location.state.storeName);
      })
      .catch((error) => {
        console.log(error);
        alert('取得に失敗しました');
      });
  }, []);

  return (
    <>
      <div className="page-title">RESULT Details</div>
      <div className="details-container">
        <div className="details-box">
          <h2 className="details-title">{storeName}</h2>
          <div className="food-container">
            <h2 className="details-title">【食材詳細】</h2>
            <ul className="details-ul">
              {shopping.map((obj, index) => (
                <React.Fragment key={index}>
                  <li>{obj.productName}: 100個</li>
                </React.Fragment>
              ))}
            </ul>
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
