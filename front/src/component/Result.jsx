import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/style/Result.css';

export default function Result() {
  //   const { team } = props;
  const [store, setStore] = useState([]);

  // const createMap = () => {
  //   //錦糸町駅の緯度・経度
  //   const position = new google.maps.LatLng(35.696802, 139.814136);

  //   //地図を作成
  //   const options = {
  //     zoom: 15,
  //     center: position,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP,
  //   };
  //   const map1 = new google.maps.Map(document.getElementById('map1'), options);

  //   //マーカーの作成
  //   const marker = new google.maps.Marker({
  //     position: position,
  //     map: map1,
  //   });
  // };

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
      <h1>店一覧</h1>
      <table>
        <thead>
          <tr>
            <th>店名</th>
            <th>マップ</th>
          </tr>
        </thead>
        <tbody>
          {store.map((obj, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>
                  <Link to={`/result/store/${obj.id}`} className="Link">
                    {obj.storeName}
                  </Link>
                </td>
                <td>後で地図を表示</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}
