import React, { useState, useEffect } from 'react';
import { Request } from '../../helpers/axios_helper';
import { Table, Button, Modal, Form, Input, Upload, Select, message, Popconfirm, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
// import { Request } from '../../helpers/axios_helper';

const { Option } = Select;

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null); // Track the brand being edited
  const [form] = Form.useForm();
  const [proImage, setProImage] = useState(''); // Store uploaded image URL

  // Fetch all brands
  const fetchAllBrands = async () => {
    setLoading(true);
    try {
      const response = await Request('GET', '/prod/getallbrands');
      setBrands(response.data);
    } catch (error) {
      message.error('Error fetching brands');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllBrands();
  }, []);

  // Handle Modal visibility for create/edit
  const handleModalVisibility = (brand = null) => {
    setEditingBrand(brand);
    if (brand) {
      form.setFieldsValue({
        ...brand,
        instagram: brand.social_links?.instagram,
        twitter: brand.social_links?.twitter,
        youtube: brand.social_links?.youtube,
        coffee_blends: brand.coffee_blends || [],
      });
    } else {
      form.resetFields();
    }
    setShowModal(!showModal);
  };

  // Handle image upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'zmtmbe7m'); // Replace with your Cloudinary upload preset
    formData.append('cloud_name', 'dyszone43'); // Replace with your Cloudinary cloud name

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dyszone43/image/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.secure_url;
    } catch (error) {
      message.error('Error uploading to Cloudinary');
      throw error;
    }
  };

  // Handle form submission to create or edit a brand
  const handleSubmit = async (values) => {
    const formData = {
      ...values,
      coffee_blends: values.coffee_blends || [], // Ensure coffee_blends is sent as an array
      proImage, // Image URL after upload
      social_links: {
        instagram: values.instagram || '',
        twitter: values.twitter || '',
        youtube: values.youtube || '',
      },
    };

    try {
      if (editingBrand) {
        // Update brand
        await Request('PUT', '/admin/prod/editbrand', {
          brandname: editingBrand.name,
          newbrandname: formData.name,
          ...formData,
        });
        message.success('Brand updated successfully');
      } else {
        // Create new brand
        await Request('POST', '/admin/prod/createbrand', formData);
        message.success('Brand created successfully');
      }

      setShowModal(false); // Close the modal after success
      fetchAllBrands(); // Refresh brands after creation or update
    } catch (error) {
      message.error('Error saving brand');
    }
  };

  // Handle image upload for the brand image
  const handleProImageUpload = async ({ file }) => {
    try {
      const url = await uploadToCloudinary(file);
      setProImage(url);
      message.success('Brand image uploaded successfully');
    } catch (error) {
      message.error('Error uploading brand image');
    }
  };

  // Handle brand deletion
  const handleDelete = async (brandname) => {
    try {
      await Request('DELETE', '/admin/prod/deletebrand', { brandname });
      message.success('Brand deleted successfully');
      fetchAllBrands(); // Refresh brands after deletion
    } catch (error) {
      message.error('Error deleting brand');
    }
  };

  // Define columns for Ant Design Table
  const columns = [
    {
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
      responsive: ['md'],
    },
    {
      title: 'Brand Story',
      dataIndex: 'brandstory',
      key: 'brandstory',
      responsive: ['md'],
    },
    {
      title: 'Roasting Techniques',
      dataIndex: 'roasting_techniques',
      key: 'roasting_techniques',
      responsive: ['md'],
    },
    {
      title: 'Coffee Blends',
      dataIndex: 'coffee_blends',
      key: 'coffee_blends',
      responsive: ['sm'],
      render: (blends) => (blends && blends.length > 0 ? blends.join(', ') : 'No blends available'),
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      responsive: ['sm'],
      render: (text) => `${text}%`,
    },
    {
      title: 'Social Links',
      key: 'social_links',
      responsive: ['md'],
      render: (_, record) => (
        <>
          {record.social_links?.instagram && (
            <a href={record.social_links.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          )}{' '}
          {record.social_links?.twitter && (
            <a href={record.social_links.twitter} target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          )}{' '}
          {record.social_links?.youtube && (
            <a href={record.social_links.youtube} target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          )}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button onClick={() => handleModalVisibility(record)} type="primary" style={{ marginRight: '8px' }}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this brand?"
            onConfirm={() => handleDelete(record.name)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Brands</h2>

      <Row justify="space-between" gutter={[16, 16]}>
        <Col>
          <Button type="primary" onClick={() => handleModalVisibility(null)} style={{ marginBottom: '20px' }}>
            Create New Brand
          </Button>
        </Col>
      </Row>

      {/* Table displaying the fetched brands */}
      <Table
        columns={columns}
        dataSource={brands}
        rowKey={(record) => record._id}
        loading={loading}
        scroll={{ x: true }} // Enable horizontal scrolling for responsiveness
      />

      {/* Modal for Brand Creation/Editing */}
      <Modal title={editingBrand ? 'Edit Brand' : 'Create Brand'} visible={showModal} onCancel={handleModalVisibility} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Brand Name"
            rules={[{ required: true, message: 'Please enter the brand name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="brandstory" label="Brand Story">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="roasting_techniques" label="Roasting Techniques">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="coffee_blends"
            label="Coffee Blends"
          >
            <Select mode="tags" style={{ width: '100%' }} placeholder="Add coffee blends" tokenSeparators={[',']} />
          </Form.Item>

          {/* Flattened social_links fields */}
          <Form.Item name="instagram" label="Instagram">
            <Input />
          </Form.Item>

          <Form.Item name="twitter" label="Twitter">
            <Input />
          </Form.Item>

          <Form.Item name="youtube" label="YouTube">
            <Input />
          </Form.Item>

          <Form.Item name="discount" label="Discount (%)">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="contact_email" label="Contact Email">
            <Input />
          </Form.Item>

          <Form.Item name="proImage" label="Brand Image" valuePropName="file" getValueFromEvent={(e) => e.file}>
            <Upload customRequest={handleProImageUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload Brand Image</Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {editingBrand ? 'Update Brand' : 'Create Brand'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Brands;
