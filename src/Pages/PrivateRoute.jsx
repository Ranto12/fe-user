import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("tokenUser"); // Periksa token di localStorage

  if (!token) {
    // Jika tidak ada token, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  return children;
};

const NonProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("tokenUser"); // Periksa token di localStorage

  if (token) {
    // Jika tidak ada token, arahkan ke halaman login
    return <Navigate to="/home" replace />;
  }

  return children;
};

export {NonProtectedRoute, ProtectedRoute};
