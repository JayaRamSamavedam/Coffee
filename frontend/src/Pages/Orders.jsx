import React, { useState, useEffect } from 'react';
import { Table, Pagination, Spin, message } from 'antd';
import { RequestParams } from '../helpers/axios_helper'; // Adjust the path to where RequestParams is located
import { Link } from 'react-router-dom';

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pageSize] = useState(10); // Number of orders per page

  // Fetch orders with pagination
  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const response = await RequestParams('GET', '/orders/getorders', { page, limit: pageSize });
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      setTotalOrders(response.data.totalOrders); // Total orders to manage pagination
      setCurrentPage(page);
      setLoading(false);
    } catch (error) {
      message.error('Error fetching orders');
      setLoading(false);
    }
  };

  // Fetch orders when the component mounts or when the page changes
  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Define table columns
  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: 'PaymentStatus',
      dataIndex: ['paymentDetails', 'status'],
      key: 'status',
    },
    {
        title: 'OrderStatus',
        dataIndex:'orderStatus',
        key: 'orderStatus',
      },
      {
        title: 'orderStatusMessage',
        dataIndex:'orderStatusMessage',
        key: 'orderStatusMessage',
      },

    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Link to={`/order/${record._id}`} className="text-blue-500 hover:underline">
          View Details
        </Link>
      ),
    },
  ];

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center mb-8">All Orders</h1>

      {/* Display a spinner while loading */}
      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          {/* Orders Table */}
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            pagination={false} // Disable Ant Design's built-in pagination (we'll use custom pagination below)
          />

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              total={totalOrders}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false} // Disable changing the page size
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrdersPage;
