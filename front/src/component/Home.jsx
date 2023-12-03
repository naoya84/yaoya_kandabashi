import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import topImg from '../assets/image/yasai.jpg';
import '../assets/style/Home.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, setUserId, setUserName } = useAuth();

  const handleSubmit = async () => {
    try {
      let url;
      if (process.env.NODE_ENV === "development"){
        url = import.meta.env.VITE_DEVELOPMENT_BACKEND_URL;  
      } else {
        url = "https://yaoya-lenzzzz.onrender.com";  
      }
      // url = import.meta.env.VITE_DEVELOPMENT_BACKEND_URL || "https://yaoya-lenzzzz.onrender.com";
      console.log('最終的なURLは?', url);

      const response = await fetch(url + '/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (response.ok) {
        console.log('response',response);
        const data = await response.json();
        console.log('data',data);
        setUserId(data.id);
        setUserName(username);
        login();
        navigate('/search');
      }else{
        console.log('login失敗',response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitTest = () => {
    try {
      setUserId(1);
      setUserName(username);
      console.log('username',username);
      login();
      navigate('/search');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="home-container">
        <div className="home-login">
          <h1 className="login-title">yaoya へようこそ</h1>
          <p className="login-text" >ユーザー名</p>
          <input className="login-input" type="text" onChange={(e) => setUsername(e.target.value)}/>
          <p className="login-text">パスワード</p>
          <input className="login-input" type="password" onChange={(e) => setPassword(e.target.value)}/>
          <button className="login-btn" onClick={handleSubmit}>ログイン</button>
        </div>
        <img src={topImg} alt="マップの画像" />
      </div>
    </>
  );
}
