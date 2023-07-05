import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MenuPage from '../Pages/MenuPage';
import OrdersPage from '../Pages/OrdersPage';
import TakeOrdersPage from '../Pages/TakeOrdersPage';
import AllOrdersPage from '../Pages/AllOrdersPage';
import LoginPage from '../Pages/LoginPage';
import SignupPage from '../Pages/SignupPage';

const AllRoutes = () => {
  return (
   

      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/take-orders" element={<TakeOrdersPage />} />
        <Route path="/all-orders" element={<AllOrdersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    
  );
};

export default AllRoutes;
