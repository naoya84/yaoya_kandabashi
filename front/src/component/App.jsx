import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../assets/style/App.css';
import Home from './Home';
// import Login from './component/Login';
// import Signin from './component/Signin';
import Navber from './Navber';
import Search from './Search';
import Result from './Result';
import ResultStore from './ResultStore';
import Footer from './Footer';

function App() {
  return (
    <div className="App">
      <Navber></Navber>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/search" element={<Search></Search>} />
        <Route path="/result/store" element={<Result></Result>} />
        <Route
          path="/result/store/:storeId"
          element={<ResultStore></ResultStore>}
        />
        {/* <Route path="/customer" element={<Customer></Customer>} /> */}
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
