import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import topImg from "../assets/image/yasai.jpg";
import "../assets/style/Home.css";

export default function Home() {
  //   const { team } = props;
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleBtnClick = async () => {
    console.log("ボタンクリックしました！！！");
    console.log("送信時", user_name, password);
    console.log(
      "json",
      JSON.stringify({ user_name: user_name, password: password })
    );
    try {
      // Renderで.envファイルの作成手順
      // renderのフロントエンド側でEnvironmentでシークレットファイル選択。
      // Filenameは.env
      // ContentsはVITE_REACT_APP_BACKEND_URL=バックエンドのrenderのURL
      // const url = import.meta.env.VITE_DEVELOPMENT_BACKEND_URL || import.meta.env.VITE_PRODUCTION_BACKEND_URL;
      const url = "http://localhost:4242";
      console.log("最終的なURLは?", url);

      const response = await fetch(url + "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_name: user_name, password: password }),
      });
      // const data = await response.json();
      // console.log("data", data);
      if (response.ok) {
        // setUserId(data[0].id);
        // setUserName(user_name);
        console.log("response帰ってきてる？", response);
        login();
        navigate("/search"); // ここでsearchコンポーネントへ遷移
      }
    } catch (error) {
      console.log(error);
    }
    // navigate("/search");
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className="home-container">
        <div className="home-login">
          <h1 className="login-title">yaoya へようこそ</h1>
          <p className="login-text">ユーザー名</p>
          <input
            className="login-input"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className="login-text">パスワード</p>
          <input
            className="login-input"
            type="text"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-btn" onClick={handleBtnClick}>
            ログイン
          </button>
        </div>
        <img src={topImg} alt="マップの画像" />
      </div>
    </>
  );
}
