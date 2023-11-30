import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../assets/style/Navber.css';

export default function Navber() {
  //   const { team } = props;

  useEffect(() => {
    const hamburger = document.getElementById('hamburger');
    const icon = document.querySelector('.icon');
    const sm = document.querySelector('.sm');

    hamburger.addEventListener('click', function () {
      icon.classList.toggle('close');
      if (sm.style.display === 'block') {
        sm.style.display = 'none';
      } else {
        sm.style.display = 'block';
      }
    });
  }, []);

  return (
    <header>
      <div className="logo">
        <Link to={`/`}>yaoya-三人工</Link>
      </div>

      <div id="hamburger">
        <div className="icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <nav className="sm">
        <ul>
          <li>
            <Link to={`/`}>HOME</Link>
          </li>
          <li>
            <Link to={`/search`}>SEARCH</Link>
          </li>
          <li>
            <Link to={`/result/store`}>RESULT</Link>
          </li>
          <li>
            <Link to={`#`}>MYPAGE</Link>
          </li>
          <li>
            <Link to={`#`}>LOGOUT</Link>
          </li>
        </ul>
      </nav>

      <nav className="pc">
        <ul>
          <li>
            <Link to={`/`}>HOME</Link>
          </li>
          <li>
            <Link to={`/search`}>SEARCH</Link>
          </li>
          <li>
            <Link to={`/result/store`}>RESULT</Link>
          </li>
          <li>
            <Link to={`#`}>MYPAGE</Link>
          </li>
          <li>
            <Link to={`#`}>LOGOUT</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
