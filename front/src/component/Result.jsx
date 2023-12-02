import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/style/Result.css';
import storeImg from '../assets/image/store.jpg';
import shoppingImg from '../assets/image/shopping.jpg';

export default function Result() {
  // const [store, setStore] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get(`/api/customers/1/result/store`) //後でユーザーIDに書き換え
  //     .then((response) => {
  //       setStore(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       alert('取得に失敗しました');
  //     });
  // }, []);

  // ------------- new-start --------------------

  const [storeProduct, setStoreProduct] = useState([]);

  useEffect(() => {
    const arr = [
      { id: 1, storeId: 1, productName: 'ヨーグルト', piece: 5, unit: '個', flag: false, storeName: 'プライムツリー赤池' },
      { id: 2, storeId: 2, productName: 'かぼちゃ', piece: 1, unit: '個', flag: false, storeName: 'ワークマン' },
      { id: 3, storeId: 3, productName: '豚肉', piece: 10, unit: '個', flag: false, storeName: 'セブンイレブン' },
      { id: 4, storeId: 3, productName: 'あじ', piece: 2, unit: '個', flag: false, storeName: 'セブンイレブン' },
      { id: 5, storeId: 3, productName: '塩', piece: 3, unit: '個', flag: true, storeName: 'セブンイレブン' },
    ];
    setStoreProduct(arr);
  }, []);

  const product = storeProduct.map((el, index) => {
    return (
      <div className="shopping-label" key={index}>
        <label key={`item-${index}`}>
          {!el.flag && <input type="checkbox" />}
          {el.productName} ({el.piece}
          {el.unit})
        </label>
        {el.flag && <span>購入済み</span>}
      </div>
    );
  });

  const store = () => {
    const storeArray = storeProduct.map((el) => {
      return JSON.stringify({ storeId: el.storeId, storeName: el.storeName });
    });
    const uniqStoreArray = Array.from(new Set([...storeArray])).map((el) => JSON.parse(el));

    // console.log(uniqStoreArray);

    return uniqStoreArray.map((el, index) => {
      return (
        <React.Fragment key={index}>
          <Link to={`/result/store/${el.storeId}`} state={{ storeName: el.storeName }} className="Link">
            {el.storeName}
          </Link>
        </React.Fragment>
      );
    });
  };

  const handleFlagChangeClick = () => {
    console.log('クリックした！');
    // チェックボックスにチェック入っているか見にいく
    // ~~~~~~処理~~~~~

    // 配列で取得する。
    const idArr = [1, 2];

    // idをPATCHリクエストのbodyで送信
    // バックエンドでidと一致するデータのflagをtrueにする

    // バックエンドはshopping_listテーブルのデータ全て返す。
  };

  return (
    <>
      <div className="page-title">RESULT</div>
      <div className="result-container">
        <div className="shopping-list" style={{ backgroundImage: `url(${shoppingImg})` }}>
          <h1>買い物リスト</h1>
          <div className="shopping-box">{product}</div>
          <button className="shopping-btn" onClick={handleFlagChangeClick}>
            選択した商品を購入済みに変更する
          </button>
        </div>
        <div className="store-list" style={{ backgroundImage: `url(${storeImg})` }}>
          <h1>ショップの提案</h1>
          <div className="store-box">{store()}</div>
        </div>
      </div>
    </>
  );
}
