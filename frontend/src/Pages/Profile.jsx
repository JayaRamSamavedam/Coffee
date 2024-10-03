import React, { useState, useEffect } from 'react';
import { Request, flushCookies } from '../helpers/axios_helper';
import { Input, Button, Form, DatePicker, Select, Spin, message } from 'antd';
import moment from 'moment';
import { replace, useLocation, useNavigate } from 'react-router-dom';
const { Option } = Select;
const { TextArea } = Input;

const UserProfile = () => {
    const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [billingAddress, setBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const response = await Request('GET', '/user/getuser');
      const user = response.data.user;
      if (user.birthday) {
        user.birthday = moment(user.birthday, 'YYYY-MM-DD'); // Convert date string to moment object
      }
      setUserData(user);
      setPreferences(user.preferences || {});
      setBillingAddress(user.billingAddress || {});
      setShippingAddress(user.deliveryAddress || {});
      setLoading(false);
    } catch (error) {
      message.error('Error fetching user data');
      setLoading(false);
    }
  };

  const handleEditUserData = async (values) => {
    // Format the birthday to 'yyyy-mm-dd'
    if (values.birthday) {
      values.birthday = values.birthday.format('YYYY-MM-DD');
    }
    
    try {
      await Request('POST', '/user/edituser', values);
      message.success('User details updated');
    } catch (error) {
      message.error('Error updating user details');
    }
  };

  const handleAddBillingAddress = async (values) => {
    try {
      await Request('POST', '/user/createbilling', { billingAddress: values });
      setBillingAddress(values);
      message.success('Billing address created successfully');
    } catch (error) {
      message.error('Error creating billing address');
    }
  };

  const handleEditBillingAddress = async (values) => {
    try {
      await Request('POST', '/user/editbillingAdress', { billingAddress: values });
      setBillingAddress(values);
      message.success('Billing address updated');
    } catch (error) {
      message.error('Error updating billing address');
    }
  };

  const handleAddShippingAddress = async (values) => {
    try {
      await Request('POST', '/user/createdelivery', { deliveryAddress: values });
      setShippingAddress(values);
      message.success('Shipping address created successfully');
    } catch (error) {
      message.error('Error creating shipping address');
    }
  };

  const handleEditShippingAddress = async (values) => {
    try {
      await Request('POST', '/user/editdeliveryAdress', { deliveryAddress: values });
      setShippingAddress(values);
      message.success('Shipping address updated');
    } catch (error) {
      message.error('Error updating shipping address');
    }
  };

  const handleAddPreference = async (values) => {
    try {
      await Request('POST', '/user/addpreference', { preference: values });
      setPreferences(values);
      message.success('Preferences added successfully');
    } catch (error) {
      message.error('Error adding preferences');
    }
  };

  const handleEditPreference = async (values) => {
    try {
      await Request('POST', '/user/editpreference', { preference: values });
      setPreferences(values);
      message.success('Preferences updated');
    } catch (error) {
      message.error('Error updating preferences');
    }
  };

  

  return (
    <div className="container mx-auto p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      {loading ? (
        <Spin size="large" className="flex justify-center" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white p-6 shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <Form onFinish={handleEditUserData} initialValues={userData} layout="vertical">
            <Form.Item name="fullName" label="Full Name">
                <Input />
              </Form.Item>
              <Form.Item name="phonenumber" label="Phone Number">
                <Input />
              </Form.Item>
              <Form.Item name="birthday" label="Birthday">
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item name="gender" label="Gender">
                <Select>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
              <Form.Item name="region" label="Region">
                <Input />
              </Form.Item>
              <Form.Item name="payementmode" label="Payment Mode">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">Update User Details</Button>
            </Form>
          </div>

          {/* Billing Address */}
          <div className="bg-white p-6 shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
            <Form
              onFinish={billingAddress.fullName ? handleEditBillingAddress : handleAddBillingAddress}
              initialValues={billingAddress}
              layout="vertical"
            >
              <Form.Item name="fullName" label="Full Name">
                <Input />
              </Form.Item>
              <Form.Item name="email" label="email">
                <Input />
              </Form.Item>
              <Form.Item name="companyName" label="Company Name">
                <Input />
              </Form.Item>
              <Form.Item name="street" label="Street">
                <Input />
              </Form.Item>
              <Form.Item name="city" label="City">
                <Input />
              </Form.Item>
              <Form.Item name="country" label="country">
                <Input />
              </Form.Item>
              <Form.Item name="state" label="State">
                <Input />
              </Form.Item>
              <Form.Item name="pin" label="PIN Code">
                <Input  />
              </Form.Item>
              <Form.Item name="phonenumber" label="Phone Number">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                {billingAddress.fullName ? 'Update Billing Address' : 'Create Billing Address'}
              </Button>
            </Form>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <Form
              onFinish={shippingAddress.fullName ? handleEditShippingAddress : handleAddShippingAddress}
              initialValues={shippingAddress}
              layout="vertical"
            >
              <Form.Item name="fullName" label="Full Name">
                <Input />
              </Form.Item>
              <Form.Item name="email" label="email">
                <Input />
              </Form.Item>
              <Form.Item name="companyName" label="Company Name">
                <Input />
              </Form.Item>
              <Form.Item name="street" label="Street">
                <Input />
              </Form.Item>
              <Form.Item name="city" label="City">
                <Input />
              </Form.Item>
              <Form.Item name="state" label="State">
                <Input />
              </Form.Item>
              <Form.Item name="country" label="country">
                <Input />
              </Form.Item>
              <Form.Item name="pin" label="PIN Code">
                <Input />
              </Form.Item>

              <Form.Item name="phonenumber" label="Phone Number">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                {shippingAddress.fullName ? 'Update Shipping Address' : 'Create Shipping Address'}
              </Button>
            </Form>
          </div>

          {/* Preferences */}
          <div className="bg-white p-6 shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            <Form
              onFinish={preferences.roast_level ? handleEditPreference : handleAddPreference}
              initialValues={preferences}
              layout="vertical"
            >
              <Form.Item name="roast_level" label="Roast Level">
                <Input />
              </Form.Item>
              <Form.Item name="origin" label="Coffee Origin">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                {preferences.roast_level ? 'Update Preferences' : 'Add Preferences'}
              </Button>
            </Form>
          </div>

          {/* Logout Button */}
         
        </div>
      )}
    </div>
  );
};

export default UserProfile;
