import React, { useState, useEffect } from 'react';
import { Table, Pagination, Spin, message, Button, Modal, Input, Select, Popconfirm } from 'antd';
import { Request, RequestParams } from '../../helpers/axios_helper'; // Adjust the path to where RequestParams is located
import { Link } from 'react-router-dom';
// import 'antd/dist/antd.css'; // Ensure Ant Design styles are imported

const { Option } = Select;

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pageSize] = useState(10); // Number of orders per page

  const [selectedOrder, setSelectedOrder] = useState(null); // For tracking the order to be updated
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // For showing the update modal
  const [orderStatus, setOrderStatus] = useState(''); // Selected order status
  const [orderStatusMessage, setOrderStatusMessage] = useState(''); // Order status message

  const orderStatusEnum = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']; // Enum for status

  // Fetch orders with pagination
  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const response = await RequestParams('GET', '/admin/getallorders', { page, limit: pageSize });
      setOrders(response.data.orders);
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

  // Open the update modal for a specific order
  const openUpdateModal = (order) => {
    setSelectedOrder(order);
    setOrderStatus(order.orderStatus); // Set the current order status
    setOrderStatusMessage(order.orderStatusMessage); // Set the current order status message
    setIsUpdateModalVisible(true);
  };

  // Handle the update order status
  const handleUpdateOrder = async () => {
    try {
      const response = await Request('PUT', `/orders/update/${selectedOrder._id}`, {
        orderStatus,
        orderStatusMessage,
      });
      if (response.status === 200) {
        message.success('Order status successfully updated');
        fetchOrders(currentPage); // Reload orders after update
        setIsUpdateModalVisible(false);
      }
    } catch (error) {
      message.error('Failed to update order status');
    }
  };

  // Handle order deletion
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await Request('DELETE', `/orders/delete/${orderId}`);
      if (response.status === 200) {
        message.success('Order successfully deleted');
        fetchOrders(currentPage); // Reload orders after deletion
      }
    } catch (error) {
      message.error('Failed to delete order');
    }
  };

  // Define table columns
  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      responsive: ['md'], // Visible only on medium screens and larger
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      responsive: ['sm'], // Visible on small screens and up
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
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
    },
    {
      title: 'Order Status Message',
      dataIndex: 'orderStatusMessage',
      key: 'orderStatusMessage',
      responsive: ['md'], // Visible only on medium screens and larger
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button
            type="link"
            onClick={() => openUpdateModal(record)}
            className="text-blue-500 hover:underline"
          >
            Update Status
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this order?"
            onConfirm={() => handleDeleteOrder(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" className="text-red-500 hover:underline">
              Delete
            </Button>
          </Popconfirm>
          <Link to={`/order/${record._id}`} className="text-blue-500 hover:underline">
            View Details
          </Link>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 mt-8">
      <h1 className="text-3xl font-bold text-center mb-8">All Orders</h1>

      {/* Display a spinner while loading */}
      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Orders Table */}
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            pagination={false} // Disable Ant Design's built-in pagination (we'll use custom pagination below)
            scroll={{ x: 800 }} // Allow horizontal scroll for small screens
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

      {/* Update Order Status Modal */}
      <Modal
        title="Update Order Status"
        visible={isUpdateModalVisible}
        onOk={handleUpdateOrder}
        onCancel={() => setIsUpdateModalVisible(false)}
        className="max-w-full"
        bodyStyle={{ padding: '1rem' }}
      >
        <div className="mb-4">
          <label className="block mb-2">Order Status</label>
          <Select
            value={orderStatus}
            onChange={(value) => setOrderStatus(value)}
            style={{ width: '100%' }}
          >
            {orderStatusEnum.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block mb-2">Order Status Message</label>
          <Input
            value={orderStatusMessage}
            onChange={(e) => setOrderStatusMessage(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AllOrdersPage;
