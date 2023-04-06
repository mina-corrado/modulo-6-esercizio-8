import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles.css";

const ValidateToken = props => {
  const params = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
      const { token } = params;
      localStorage.setItem("token", token);
      navigate('/');
  }, []);

  
    return (
        <div className="token-container">
        token successfully validated!
        </div>
    );
};

export default ValidateToken;
