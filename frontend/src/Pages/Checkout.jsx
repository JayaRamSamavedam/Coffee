import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Form, message } from 'antd';
import { Request } from '../helpers/axios_helper';
import { useNavigate, useLocation } from 'react-router-dom';

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const { fromCart, productId, quantity } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipmentAddress: {
      name: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      shipmentAddress: { ...formData.shipmentAddress, [name]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      message.error('Stripe has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      message.error('Please enter your payment details.');
      return;
    }

    setLoading(true);

    const billingDetails = {
      name: formData.shipmentAddress.name,
      address: {
        line1: formData.shipmentAddress.street,
        city: formData.shipmentAddress.city,
        state: formData.shipmentAddress.state,
        postal_code: formData.shipmentAddress.postalCode,
        country: formData.shipmentAddress.country,
      },
    };

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    });

    if (error) {
      message.error(`Payment error: ${error.message}`);
      setLoading(false);
      return;
    }

    if (!paymentMethod) {
      message.error('Please provide valid card details.');
      setLoading(false);
      return;
    }

    const orderPayload = {
      shipmentAddress: formData.shipmentAddress,
      paymentDetails: {
        method: 'stripe',
        paymentMethodId: paymentMethod.id,
      },
    };

    try {
      const apiUrl = fromCart ? '/orders/cart-buy-now' : '/orders/buy-now';
      const orderData = fromCart
        ? { ...orderPayload }
        : { productId, quantity, ...orderPayload };

      const { data } = await Request('POST', apiUrl, orderData);

      if (data.requiresAction) {
        window.location.href = data.nextActionUrl;
      } else {
        message.success('Order placed successfully');
        navigate('/order-confirmation', { state: { order: data } });
      }
    } catch (err) {
      message.error(`Failed to place order: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex space-x-2 justify-center items-center h-screen dark:invert">
        <span className="sr-only">Loading...</span>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Checkout</h2>
        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          <Form.Item label="Full Name" className="mb-4">
            <input
              className="w-full p-2 border rounded-lg"
              name="name"
              value={formData.shipmentAddress.name}
              onChange={handleInputChange}
              required
            />
          </Form.Item>
          <Form.Item label="Street" className="mb-4">
            <input
              className="w-full p-2 border rounded-lg"
              name="street"
              value={formData.shipmentAddress.street}
              onChange={handleInputChange}
              required
            />
          </Form.Item>
          <Form.Item label="City" className="mb-4">
            <input
              className="w-full p-2 border rounded-lg"
              name="city"
              value={formData.shipmentAddress.city}
              onChange={handleInputChange}
              required
            />
          </Form.Item>
          <Form.Item label="State" className="mb-4">
            <input
              className="w-full p-2 border rounded-lg"
              name="state"
              value={formData.shipmentAddress.state}
              onChange={handleInputChange}
              required
            />
          </Form.Item>
          <Form.Item label="Postal Code" className="mb-4">
            <input
              className="w-full p-2 border rounded-lg"
              name="postalCode"
              value={formData.shipmentAddress.postalCode}
              onChange={handleInputChange}
              required
            />
          </Form.Item>
          <Form.Item label="Country" className="mb-4">
            <select
              className="w-full p-2 border rounded-lg"
              name="country"
              value={formData.shipmentAddress.country}
              onChange={handleInputChange}
              required
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="IN">India</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="JP">Japan</option>
              <option value="CN">China</option>
              {/* Add other country codes as needed */}
            </select>
          </Form.Item>

          <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
          <div className="mb-6 p-4 border rounded-lg">
            <CardElement />
          </div>

          <Button
            type="primary"
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
            onClick={handleSubmit}
            loading={loading}
          >
            Place Order
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Checkout;
