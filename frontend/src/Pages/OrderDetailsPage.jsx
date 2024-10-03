import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Request } from '../helpers/axios_helper';
import { useParams } from 'react-router-dom';
import { Spin, Alert } from 'antd';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order and product data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await Request("GET", `/orders/${orderId}`);
        const fetchedOrder = response.data.order;
        setOrder(fetchedOrder);

        // Fetch product details for each productId in the order
        const productIds = fetchedOrder.items.map(item => item.productId);
        const productResponses = await Promise.all(
          productIds.map(async (productId) => {
            const response = await Request("GET", `/prod/getByID/${productId}`);
            return response;
          })
        );
        setProducts(productResponses.map(res => res.data));
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch order or product details.');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Generate PDF Invoice
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set the title
    doc.setFontSize(22);
    doc.text('Invoice', 105, 20, { align: 'center' });

    if (order && products.length > 0) {
      doc.setFontSize(12);
      doc.text(`Order ID: ${order._id}`, 10, 40);
      doc.text(`User: ${order.user}`, 10, 50);
      doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 10, 60);

      doc.setFontSize(15);
      doc.text('Shipment Address', 10, 80);
      doc.setFontSize(12);
      doc.text(`${order.shipmentAddress.street}`, 10, 90);
      doc.text(`${order.shipmentAddress.city}, ${order.shipmentAddress.state}, ${order.shipmentAddress.postalCode}`, 10, 100);
      doc.text(`${order.shipmentAddress.country}`, 10, 110);

      doc.setFontSize(15);
      doc.text('Items', 10, 130);

      // Table for items
      const tableRows = [];
      order.items.forEach((item, index) => {
        const product = products.find(p => p.productId === item.productId); // Find product details by productId
        tableRows.push([
          index + 1,
          product ? product.name : `Product ID: ${item.productId}`, // Show product name if available
          `Quantity: ${item.quantity}`,
          `Price: $${item.price.toFixed(2)}`,
        ]);
      });

      doc.autoTable({
        head: [['#', 'Product', 'Quantity', 'Price']],
        body: tableRows,
        startY: 140,
      });

      // Payment details
      const finalY = doc.lastAutoTable.finalY;
      doc.setFontSize(15);
      doc.text('Payment Details', 10, finalY + 10);
      doc.setFontSize(12);
      doc.text(`Method: ${order.paymentDetails.method}`, 10, finalY + 20);
      doc.text(`Transaction ID: ${order.paymentDetails.transactionId}`, 10, finalY + 30);
      doc.text(`Status: ${order.paymentDetails.status}`, 10, finalY + 40);

      // Summary
      doc.setFontSize(15);
      doc.text('Summary', 10, finalY + 60);
      doc.setFontSize(12);
      doc.text(`Total Amount: $${order.totalAmount.toFixed(2)}`, 10, finalY + 70);
      doc.text(`Shipment Charges: $${order.shipmentCharges.toFixed(2)}`, 10, finalY + 80);
      doc.text(`Grand Total: $${(order.totalAmount + order.shipmentCharges).toFixed(2)}`, 10, finalY + 90);

      // Save the PDF
      doc.save(`invoice_${order._id}.pdf`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto mt-8">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center mb-8">Order Details</h1>

      {/* Download PDF Button */}
      {order.paymentDetails.status && (
        <div className="text-center mb-8">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            onClick={generatePDF}
          >
            Download Invoice as PDF
          </button>
        </div>
      )}

      {/* Order Summary Card */}
      <div className="mb-8">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <p className="text-gray-700 mb-2">Order ID: {order._id}</p>
          <p className="text-gray-700 mb-2">User: {order.user}</p>
          <p className="text-gray-700 mb-2">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Shipment Address Card */}
      <div className="mb-8">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Shipment Address</h2>
          <p className="text-gray-700">{order.shipmentAddress.street}</p>
          <p className="text-gray-700">{order.shipmentAddress.city}, {order.shipmentAddress.state}, {order.shipmentAddress.postalCode}</p>
          <p className="text-gray-700">{order.shipmentAddress.country}</p>
        </div>
      </div>

      {/* Items Section with Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {order.items.map((item, index) => {
            const product = products.find(p => p.productId === item.productId); // Find product details by productId
            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105">
                <img
                  src={product?.coverImage}
                  alt={product?.name || 'Product Image'}
                  className="w-full h-40 object-cover rounded-t-lg mb-4"
                />
                <div>
                  <h3 className="text-lg font-bold mb-2">{product ? product.name : `Product ID: ${item.productId}`}</h3>
                  <p className="text-gray-700 mb-1">Quantity: {item.quantity}</p>
                  <p className="text-gray-700">Price: ${item.price.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Details Card */}
      <div className="mb-8">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
          <p className="text-gray-700">Method: {order.paymentDetails.method}</p>
          <p className="text-gray-700">Transaction ID: {order.paymentDetails.transactionId}</p>
          <p className="text-gray-700">Status: {order.paymentDetails.status}</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="mb-8">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          <p className="text-gray-700 mb-2">Total Amount: ${order.totalAmount.toFixed(2)}</p>
          <p className="text-gray-700 mb-2">Shipment Charges: ${order.shipmentCharges.toFixed(2)}</p>
          <p className="text-gray-700">Grand Total: ${(order.totalAmount + order.shipmentCharges).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
