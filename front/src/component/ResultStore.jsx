import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../style/Home.css';

export default function ResultStore() {
  //   const { team } = props;
  const [shopping, setShopping] = useState([]);
  const { storeId } = useParams();

  useEffect(() => {
    axios
      .get(`/api/customers/${3}/result/shopping?store_id=${storeId}`) //後でユーザーIDに書き換え
      .then((response) => {
        setShopping(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert('取得に失敗しました');
      });
  }, []);

  return (
    <>
      <h1>商品一覧</h1>
      <table>
        <thead>
          <tr>
            <th>商品名</th>
            <th>在庫数</th>
          </tr>
        </thead>
        <tbody>
          {shopping.map((obj, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{obj.productName}</td>
                <td>後で在庫数を表示</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}
