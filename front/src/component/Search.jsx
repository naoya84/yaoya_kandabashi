import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import '../assets/style/Search.css';

export default function Search() {
  //   const { team } = props;
  const [condition, setCondition] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {}, []);

  const handleInputChange = (e) => {
    const target = e.target;
    if (target.checked) {
      setCondition((prevData) => {
        prevData.push({ shopping: target.value, quantity: 0 });
        return prevData;
      });
    } else {
      const arrOfSelect = document.getElementsByTagName('select');
      for (const tag of arrOfSelect) {
        if (tag.name === target.value) {
          tag.value = 0;
        }
      }
      setCondition((prevData) => {
        const newArray = prevData.filter((n) => n.shopping !== target.value);
        return newArray;
      });
    }
  };

  const handleQuantityChange = (foodName, num) => {
    if (num === 0) {
      document.getElementById(foodName).checked = false;
      setCondition((prevData) => {
        const newArray = prevData.filter((n) => n.shopping !== foodName);
        return newArray;
      });
    } else {
      if (document.getElementById(foodName).checked) {
        setCondition((prevData) => {
          for (const obj of prevData) {
            if (obj.shopping === foodName) {
              obj.quantity = num;
            }
          }
          return prevData;
        });
      } else {
        document.getElementById(foodName).checked = true;
        setCondition((prevData) => {
          prevData.push({ shopping: foodName, quantity: num });
          return prevData;
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(condition); // データをコンソールに表示

    axios
      .post(`/api/customers/${1}/shopping_list`, condition) //後でユーザーIDに書き換え
      .post(`http:localhost:4242/api/customers/${1}/shopping_list`, condition) //後でユーザーIDに書き換え
      .then((response) => {
        setPost(response.data);
        navigate(`/result`);
        alert('登録が完了しました');
      })
      .catch((error) => {
        console.log(error);
        alert('登録に失敗しました');
      });
  };

  const groupedFoodItems = [];
  const groupSize = 25;

  for (let i = 0; i < foodItems.length; i += groupSize) {
    groupedFoodItems.push(foodItems.slice(i, i + groupSize));
  }

  return (
    <form onSubmit={handleSubmit}>
      <table className="shoppingList">
        <tbody>
          <tr>
            {groupedFoodItems.map((group, index) => (
              <>
                <td>
                  {group.map((food) => (
                    <>
                      <input
                        type="checkbox"
                        id={food}
                        name="selectFood"
                        value={food}
                        onChange={(e) => handleInputChange(e)}
                      />
                      <label htmlFor={food}>{food}　</label>
                      <br />
                    </>
                  ))}
                </td>
                <td>
                  {group.map((food) => (
                    <>
                      <select
                        name={food}
                        onChange={(e) =>
                          handleQuantityChange(food, Number(e.target.value))
                        }
                      >
                        {[...Array(11).keys()].map((num) => (
                          <option key={num} name={food} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                      <label>　　</label>

                      <br />
                    </>
                  ))}
                </td>
              </>
            ))}
          </tr>
        </tbody>
      </table>
      <button type="submit">登録</button>
    </form>
  );
}

const foodItems = [
  'リンゴ',
  'バナナ',
  'オレンジ',
  'ブドウ',
  '桃',
  'メロン',
  'キウイ',
  'マンゴー',
  'パイナップル',
  'イチゴ',
  'トマト',
  'キャベツ',
  'レタス',
  'ほうれん草',
  'ナス',
  'ピーマン',
  'ジャガイモ',
  'さつまいも',
  'かぼちゃ',
  'アボカド',
  '牛肉',
  '豚肉',
  '鶏肉',
  'ラム肉',
  'ベーコン',
  'ハム',
  'サーモン',
  'マグロ',
  'いわし',
  'えび',
  '卵',
  '牛乳',
  'ヨーグルト',
  'チーズ',
  'バター',
  '豆腐',
  '納豆',
  '味噌',
  'しょうゆ',
  '醤油',
  'パスタ',
  '米',
  'パン',
  'うどん',
  'そば',
  'ラーメン',
  'クスクス',
  'キノア',
  'オートミール',
  'コーンフレーク',
  'アーモンド',
  'カシューナッツ',
  'くるみ',
  'ピーナッツ',
  'ひまわりの種',
  'オリーブオイル',
  'ココナッツオイル',
  'ごま油',
  '菜種油',
  'ひまわり油',
  'ニンニク',
  'しょうが',
  'ネギ',
  '玉ねぎ',
  'にんじん',
  '大根',
  'セロリ',
  'きゅうり',
  '茄子',
  'ゴーヤ',
  'チョコレート',
  'クッキー',
  'ケーキ',
  'ドーナツ',
  'パイ',
  'アイスクリーム',
  'プリン',
  'ゼリー',
  'ヨーグルト2',
  'キャンディ',
  'コーヒー豆',
  '紅茶葉',
  '緑茶',
  'ウーロン茶',
  'ハーブティー',
  'ココア',
  '砂糖',
  'はちみつ',
  'メープルシロップ',
  'ジャム',
  'しいたけ',
  'まいたけ',
  'エノキ',
  '舞茸',
  'トリュフ',
  'ポルチーニ',
  'キクラゲ',
  'ひらたけ',
  'エリンギ',
  'なめこ',
];
