import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Descriptions, Typography } from 'antd';
import { RequestParams } from '../../helpers/axios_helper'; // Assuming you have this helper function defined

const { Text } = Typography;

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Track current page
  const [pageSize, setPageSize] = useState(10); // Track number of logs per page
  const [totalLogs, setTotalLogs] = useState(0); // Track total number of logs
  const [selectedLog, setSelectedLog] = useState(null); // Selected log for the modal
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility

  // Fetch logs from the server with pagination
  const fetchLogs = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await RequestParams('GET', '/admin/logs', {
        page,
        limit: pageSize,
      });
      
      const { logs, totalLogs } = response.data;
      setLogs(logs);
      setTotalLogs(totalLogs);
    } catch (error) {
      message.error('Failed to fetch logs');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs(page, pageSize);
  }, [page, pageSize]);

  // Function to show the modal with log details
  const showModal = (log) => {
    setSelectedLog(log);
    setIsModalVisible(true);
  };

  // Close the modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedLog(null);
  };

  // Define columns for Ant Design Table
  const columns = [
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      responsive: ['md'], // Responsive visibility
      render: (text) => <span className={`font-semibold ${text === 'error' ? 'text-red-500' : 'text-gray-700'}`}>{text}</span>,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'User',
      dataIndex: ['meta', 'user'],
      key: 'user',
      responsive: ['lg'], // Visible on larger screens
      render: (text, record) => (record.meta?.user?.fullName ? record.meta.user.fullName : 'Unknown'),
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',  // Using 'timestamp' from your schema
      key: 'timestamp',
      render: (timestamp) => {
        // Ensure 'timestamp' is a Date and convert it to a string
        return timestamp ? new Date(timestamp).toLocaleString() : 'N/A';
      },
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          View Details
        </Button>
      ),
    },
  ];

  // Handle page change in the table
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Render the detailed modal content
  const renderModalContent = () => {
    if (!selectedLog) return null;

    const { meta = {} } = selectedLog;
    const { method, url, headers = {}, user = {} } = meta;
    const timestamp = new Date(selectedLog.createdAt).toLocaleString();

    return (
      <Descriptions bordered column={1}>
        {/* Request Information */}
        <Descriptions.Item label="Method">{method || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="URL">{url || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Timestamp">
  {timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}
</Descriptions.Item>


        {/* User Information */}
        <Descriptions.Item label="User Full Name">{user.fullName || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="User Email">{user.email || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="User Group">{user.userGroup || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Phone Number">{user.phonenumber || 'N/A'}</Descriptions.Item>

        {/* Request Headers */}
        <Descriptions.Item label="User Agent">{headers['user-agent'] || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Authorization">
          {headers.authorization ? (
            <Text copyable>{headers.authorization}</Text>
          ) : (
            'N/A'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Host">{headers.host || 'N/A'}</Descriptions.Item>
      </Descriptions>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">System Logs</h1>

      <Button type="primary" onClick={() => fetchLogs(page, pageSize)} className="mb-4">
        Refresh Logs
      </Button>

      <Table
        columns={columns}
        dataSource={logs}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: totalLogs,
          showSizeChanger: true, // Allows changing the page size
          pageSizeOptions: ['10', '20', '50', '100'], // Options for page size
        }}
        onChange={handleTableChange} // Hook to handle pagination change
        scroll={{ x: true }} // Enable horizontal scroll for responsiveness
        className="w-full"
      />

      {/* Modal for displaying detailed log info */}
      <Modal
        title="Log Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default Logs;
