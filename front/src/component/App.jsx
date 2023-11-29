import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../assets/style/App.css';
import Home from './Home';
// import Login from './component/Login';
// import Signin from './component/Signin';
import Navber from './Navber';
import Search from './Search';
import Result from './Result';
import Footer from './Footer';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Navber></Navber>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/search" element={<Search></Search>} />
        <Route path="/result" element={<Result></Result>} />
        {/* <Route path="/customer" element={<Customer></Customer>} /> */}
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
