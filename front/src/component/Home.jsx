import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import topImg from '../assets/image/yasai.jpg';
import '../assets/style/Home.css';

export default function Home() {
  //   const { team } = props;

  useEffect(() => {}, []);

  return (
    <>
      <img src={topImg} alt="マップの画像" />
    </>
  );
}
