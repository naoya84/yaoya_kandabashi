import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/style/Result.css';
import storeImg from '../assets/image/store.jpg';
import shoppingImg from '../assets/image/shopping.jpg';

export default function Result() {
  //   const { team } = props;
  const [store, setStore] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/customers/${3}/result/store`) //後でユーザーIDに書き換え
      .then((response) => {
        setStore(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert('取得に失敗しました');
      });
  }, []);

  return (
    <>
      <div className="page-title">RESULT</div>
      <div className="result-container">
        <div className="shopping-list" style={{ backgroundImage: `url(${shoppingImg})` }}>
          <h1>買い物リスト</h1>
          <div className="shopping-box">
            <label>
              <input type="checkbox" />
              りんご
            </label>
            <label>
              <input type="checkbox" />
              バナナ
            </label>
            <label>
              <input type="checkbox" />
              レモン
            </label>
            <label>
              <input type="checkbox" />
              りんご
            </label>
            <label>
              <input type="checkbox" />
              バナナ
            </label>
            <label>
              <input type="checkbox" />
              レモン
            </label>
          </div>
        </div>
        <div className="store-list" style={{ backgroundImage: `url(${storeImg})` }}>
          <h1>ショップの提案</h1>
          <div className="store-box">
            {store.map((obj, index) => (
              <React.Fragment key={index}>
                {/* <Link to={{ pathname: `/result/store/${obj.id}`, state: { store: 'obj.storeName' } }} className="Link"> */}
                <Link to={`/result/store/${obj.id}`} state={{ storeName: obj.storeName }} className="Link">
                  {obj.storeName}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
