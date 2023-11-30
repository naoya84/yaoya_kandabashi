import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import topImg from '../assets/image/yasai.jpg';
import '../assets/style/Home.css';

export default function Home() {
  //   const { team } = props;

  const handleBtnClick = () => {
    console.log('ボタンクリックしました！！！');
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className="home-container">
        <div className="home-login">
          <h1 className="login-title">yaoya へようこそ</h1>
          <p className="login-text">ユーザー名</p>
          <input className="login-input" type="text" />
          <p className="login-text">パスワード</p>
          <input className="login-input" type="text" />
          <button className="login-btn" onClick={handleBtnClick}>
            ログイン
          </button>
        </div>
        <img src={topImg} alt="マップの画像" />
      </div>
    </>
  );
}
