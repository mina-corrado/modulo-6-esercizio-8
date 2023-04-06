import React, { useEffect, useState } from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import Login from "./views/login/Login";
import ValidateToken from "./views/login/ValidateToken";
import Registration from "./views/login/Registration"; 
import NewBlogPost from "./views/new/New";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";

function App() {

  const [userIsLogged, setUserIsLogged] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUserIsLogged(true);
      const decodedToken=jwt_decode(token);
      const user = {
        nome: decodedToken.nome,
        cognome: decodedToken.cognome,
        email: decodedToken.email,
        isAdmin: decodedToken.isAdmin,
      };
      setUser((prevState) => ({...prevState, ...user}));
    }
  },[]);
  const handleSetUserIsLogged = (value) => {
    if (value === false) {
      setUserIsLogged(false);
      setUser(null);
    }
  };
  return (
    <Router>
      <NavBar userIsLogged={userIsLogged} setUserIsLogged={handleSetUserIsLogged} user={user} />
      <Routes>
        <Route path="/" exact element={<Home userIsLogged={userIsLogged}/>} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/new" element={<NewBlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/validateToken/:token" element={<ValidateToken />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
