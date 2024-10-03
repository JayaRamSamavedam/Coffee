import React, { useState, useEffect } from 'react';
import { Request } from '../../helpers/axios_helper';
import { Input, message, Modal, Form, Button, Upload, Select, Popconfirm } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState([]); 
  const [show, setShow] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); 
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await Request("GET", "/prod");
      setProducts(response.data);
    } catch (error) {
      message.error('Error fetching all products');
    }
    setLoading(false);
  };

  const fetchBrands = async () => {
    try {
      const response = await Request("GET", "/prod/getallbrands");
      setBrands(response.data); 
    } catch (error) {
      message.error('Error fetching brands');
    }
  };

  const onSearch = async (value) => {
    setSearchTerm(value);
    if (!value) {
      return;
    }
    setLoading(true);
    try {
      const response = await Request("GET", `/prod/search?q=${value}`);
      setProducts(response.data);
    } catch (error) {
      message.error('Error fetching search results');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchTerm === "") {
      fetchAllProducts();
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchAllProducts();
    fetchBrands(); 
  }, []);

  const handleModalVisibility = () => {
    setShow(!show);
    if (!show) setEditingProduct(null); 
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'zmtmbe7m'); 
    formData.append('cloud_name', 'dyszone43'); 

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

  const handleSubmit = async (values) => {
    const formData = {
      ...values,
      brandname: values.brand,
      coverImage: values.coverImage,
    };

    try {
      if (editingProduct) {
        await Request("PUT", `/admin/prod/edit/${editingProduct.productId}`, formData);
        message.success('Product updated successfully');
      } else {
        await Request("POST", "/admin/prod/create", formData);
        message.success('Product created successfully');
      }
      setShow(false); 
      fetchAllProducts(); 
    } catch (error) {
      message.error('Error saving product');
    }
  };

  const handleCoverImageUpload = async ({ file }) => {
    try {
      const url = await uploadToCloudinary(file);
      form.setFieldValue('coverImage', url);
      message.success('Cover image uploaded successfully');
    } catch (error) {
      message.error('Error uploading cover image');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product); 
    setShow(true);
  };

  const handleDelete = async (productId) => {
    try {
      await Request("DELETE", `/admin/prod/delete/${productId}`);
      message.success('Product deleted successfully');
      fetchAllProducts(); 
    } catch (error) {
      message.error('Error deleting product');
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <button
        type="button"
        onClick={handleModalVisibility}
        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
      >
        Create New Product
      </button>

      {/* Modal for Product Creation/Edit */}
      <Modal
        title={editingProduct ? "Edit Product" : "Create Product"}
        visible={show}
        onCancel={handleModalVisibility}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter the product name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the product description' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter the product price' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Please enter the stock quantity' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="origin"
            label="Origin"
            rules={[{ required: true, message: 'Please enter the origin' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="flavour"
            label="Flavour"
            rules={[{ required: true, message: 'Please enter the flavour' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="roastlevel"
            label="Roast Level"
            rules={[{ required: true, message: 'Please enter the roast level' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="brand"
            label="Brand"
            rules={[{ required: true, message: 'Please select a brand' }]}
          >
            <Select placeholder="Select a brand">
              {brands.map((brand) => (
                <Option key={brand._id} value={brand.name}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="coverImage"
            label="Cover Image"
            valuePropName="file"
            getValueFromEvent={(e) => e.file}
          >
            <Upload customRequest={handleCoverImageUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {editingProduct ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>

      {!show && (
        <div className="container mx-auto p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product._id} className="border p-4 rounded-lg bg-white shadow-lg">
                <img src={product.coverImage} alt={product.name} className="w-full h-48 object-cover mb-4 rounded-lg" />
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Discount:</strong> {product.discount}%</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><strong>Brand:</strong> {product.brandname}</p>
                <p><strong>Origin:</strong> {product.origin}</p>
                <p><strong>Flavour:</strong> {product.flavour}</p>
                <p><strong>Roast Level:</strong> {product.roastlevel}</p>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(product)}
                    className="focus:outline-none text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-4 py-2"
                  >
                    Edit
                  </button>

                  <Popconfirm
                    title="Are you sure to delete this product?"
                    onConfirm={() => handleDelete(product.productId)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button className="focus:outline-none text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-4 py-2">
                      Delete
                    </button>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
