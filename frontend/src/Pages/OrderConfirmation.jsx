import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { message, Spin } from 'antd';
import { Request, RequestParams } from '../helpers/axios_helper';

const OrderConfirmation = () => {
 
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null);

  // Extract the paymentIntentId from the query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentIntentId = queryParams.get('payment_intent');
    const method = queryParams.get('method');
    console.log(method)
    if (paymentIntentId) {
      handlePaymentConfirmation(paymentIntentId,method);
    } else {
      message.error('No payment intent found.');
      setLoading(false);
    }
  }, [location]);

  const handlePaymentConfirmation = async (paymentIntentId,method) => {
    try {
      // Send request to the server to confirm the payment intent and handle cart/order updates
      const response = await Request("POST",'/orders/confirm-payment',{paymentIntentId ,method});
     
      if (response.data.success) {
        setOrderStatus('Payment successful and cart cleared!');
        // Optionally, redirect to another page or display more order details
        message.success('Payment confirmed successfully!');
        setTimeout(() => {
          navigate('/orders'); // Redirect to the orders page after a few seconds
        }, 3000);
      } else {
        message.error('Payment confirmation failed. Please contact support.');
        setOrderStatus('Payment confirmation failed.');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      message.error('An error occurred while confirming the payment.');
      setOrderStatus('Error during payment confirmation.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin tip="Confirming payment..." />;
  }

  return (
    <div className="order-confirmation">
      <h2>Order Confirmation</h2>
      <p>{orderStatus}</p>
    </div>
  );
};

export default OrderConfirmation;
