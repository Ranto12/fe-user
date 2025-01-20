import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";

import DressPage from "./Pages/Wedding Dress/DressPage";
import DetailGaun from "./Pages/Wedding Dress/DetailDress";

import KebayaPage from "./Pages/Kebaya/KebayaPage";

import JasPage from "./Pages/Jas/JasPage";

import BatikPage from "./Pages/Batik/BatikPage";

import CartPage from "./Pages/Buy/CartPage";
import Invoice from "./Pages/Buy/Invoice";
import OrderList from "./Pages/Orders/OrderList";

import { NonProtectedRoute, ProtectedRoute } from "./Pages/PrivateRoute";

import { CartProvider } from "./Components/Buy/CartContext";
import AksesorisPage from "./Pages/AksesorisPernikahan/AksesorisPernikahan";
import Payment from "./Pages/Orders/Payment";

function App() {
  const [currentAvatar, setCurrentAvatar] = useState("default-avatar.jpg");

  const handleEditAvatar = (newAvatar) => {
    setCurrentAvatar(newAvatar);
  };

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <NonProtectedRoute>
                <Login />
              </NonProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <NonProtectedRoute>
                <Register />
              </NonProtectedRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editProfile/:id"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile
                  currentAvatar={currentAvatar}
                  onEditAvatar={handleEditAvatar}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dress-page"
            element={
              <ProtectedRoute>
                <DressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail/:id"
            element={
              <ProtectedRoute>
                <DetailGaun />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kebaya-page"
            element={
              <ProtectedRoute>
                <KebayaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/batik-page"
            element={
              <ProtectedRoute>
                <BatikPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jas-page"
            element={
              <ProtectedRoute>
                <JasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Aksesoris-Pernikahan"
            element={
              <ProtectedRoute>
                <AksesorisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoice/:id"
            element={
              <ProtectedRoute>
                <Invoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-list"
            element={
              <ProtectedRoute>
                <OrderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:id"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
