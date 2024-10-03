import React from 'react'
import { Route, Routes } from "react-router-dom";
import { AdminDashBoard } from './Pages/AdminDashBoard';
import Brands from './Components/Admin/Brands';
import Orders from './Components/Admin/Orders';
import Products from './Components/Admin/Products';
import Logs from './Components/Admin/Logs';
import ProtectedRoutes from './ProtectedRoutes';
import Users from './Components/Admin/Users';
import ProductInfo from './Components/productInfo';
import Home from './Pages/Home';
import ProductsPage from './Pages/Products';
import Filter from './Components/Filters';
import ProductInfoPage from './Pages/ProductInfo';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderConfirmation from './Pages/OrderConfirmation';
import OrdersPage  from  './Pages/Orders';
import OrderDetailsPage from './Pages/OrderDetailsPage';
import UserProfile from './Pages/Profile';
import Favourites from './Pages/Favourites';
import BrandsPage from "./Pages/Brands"
import BrandInfoPage from './Pages/BrandInfoPage';
const Views = () => {
    const stripePromise = loadStripe("pk_test_51N4hU4SFkOxgvYC9PVnsAUrfAt1DrBgl6z5CWVVfBvFhgVM4Mi7EGquPBv4wDW1yxBh3wuHoozETR5CbfSsO1c5u00HediLTnN");
  return (
    <div>
         <Routes>
            <Route element={<Home/>} path='/'/>
            <Route element={<ProductsPage/>} path='/products'/>
            <Route element={<ProductInfoPage/>} path='/product-info/:id'/>
            <Route element={<Filter/>} path='filters'/>
            <Route element={<BrandsPage/>} path="/brandspage"/>
            <Route element={<BrandInfoPage/>} path="/brand/:id"/>
            <Route element={<ProtectedRoutes />}>
               <Route element={<Cart/>} path='/cart'/>
               <Route element={<OrdersPage/>} path='/orders'/>
               <Route element={<OrderDetailsPage/>} path='/order/:orderId'/>
               <Route element={<UserProfile/>} path="/profile"/>
               <Route element={<Favourites/>} path="/wish-list"/>
               
               <Route
          path="/checkout"
          element={
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          }
        />
        <Route path='/order-confirmation' element={  <Elements stripe={stripePromise}> <OrderConfirmation/></Elements>}/>
                <Route element={<AdminDashBoard/>}  path='/AdminDashBoard'>
                    <Route element={<Brands/>} path='brands'/>
                    <Route element={<Orders/>} path='orders'/>
                    <Route element={<Products/>} path='products'/>
                    <Route element={<ProductInfo/>} path='product-info/:id'/>
                    <Route element={<Logs/>} path='logs'/>
                    <Route element={<Users/>} path='users'/>
                </Route>
            </Route>
         </Routes>
    </div>
  )
}

export default Views