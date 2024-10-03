import React, { useEffect, useState } from 'react';
import { Button, List, Card, InputNumber, Popconfirm, message, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Request } from '../helpers/axios_helper';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(false);
    const [totalCost, setTotalCost] = useState(0);

    // Fetch the cart details when the component mounts
    useEffect(() => {
        fetchCartDetails();
    }, []);

    // Function to fetch cart details from the server
    const fetchCartDetails = async () => {
        setLoading(true);
        try {
            const response = await Request('GET', '/cart/getproducts'); // Adjust the endpoint if necessary
            if (response && response.data) {
                setCartItems(response.data.products || []); // Ensure products is an array
                setTotalCost(response.data.totalCost || 0);
            } else {
                setCartItems([]); // Set to an empty array if response is invalid
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart details:', error);
            message.error('Failed to load cart');
            setLoading(false);
        }
    };

    // Function to increment quantity
    const incrementQuantity = async (productId) => {
        try {
            await Request('PUT', `/cart/increment/${productId}`);
            fetchCartDetails(); // Refresh the cart after updating
            message.success('Item quantity incremented');
        } catch (error) {
            message.error('Failed to increment quantity');
        }
    };

    // Function to decrement quantity
    const decrementQuantity = async (productId, currentQuantity) => {
        if (currentQuantity <= 1) {
            message.warning("Can't decrement quantity below 1");
            return;
        }
        try {
            await Request('PUT', `/cart/decrement/${productId}`);
            fetchCartDetails(); // Refresh the cart after updating
            message.success('Item quantity decremented');
        } catch (error) {
            message.error('Failed to decrement quantity');
        }
    };

    // Function to remove an item from the cart
    const removeItemFromCart = async (productId) => {
        try {
            await Request('DELETE', `/cart/remove/${productId}`);
            fetchCartDetails(); // Refresh the cart after removing the item
            message.success('Item removed from cart');
        } catch (error) {
            message.error('Failed to remove item');
        }
    };

    // Function to clear the entire cart
    const clearCart = async () => {
        try {
            await Request('POST', '/cart/clear');
            fetchCartDetails(); // Refresh the cart after clearing
            message.success('Cart cleared');
        } catch (error) {
            message.error('Failed to clear cart');
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Your Cart</h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p>Loading cart...</p>
                </div>
            ) : cartItems.length === 0 ? ( // Handle empty cart case
                <div className="flex justify-center items-center h-64">
                    <p className="text-xl text-gray-600">Your cart is empty</p>
                </div>
            ) : (
                <>
                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={cartItems}
                        renderItem={(item) => (
                            <List.Item>
                                <Card
                                    style={{ width: '100%', padding: '20px' }}
                                    actions={[
                                        <Button
                                            onClick={() => decrementQuantity(item.productId, item.quantity)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </Button>,
                                        <InputNumber
                                            min={1}
                                            value={item.quantity}
                                            readOnly
                                        />,
                                        <Button onClick={() => incrementQuantity(item.productId)}>+</Button>,
                                        <Popconfirm
                                            title="Are you sure to remove this product?"
                                            onConfirm={() => removeItemFromCart(item.productId)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    ]}
                                >
                                    <Row gutter={[16, 16]} align="middle">
                                        <Col span={4} className="text-center">
                                            <img src={item.coverImage} alt={item.name} style={{ width: '80px', objectFit: 'cover' }} />
                                        </Col>
                                        <Col span={16}>
                                            <h3 className="text-xl font-semibold">{item.name}</h3>
                                            <p className="text-gray-600">Price: ${item.discountedPrice.toFixed(2)}</p>
                                            <p className="text-gray-600">Total: ${(item.discountedPrice * item.quantity).toFixed(2)}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        )}
                    />

                    <div className="cart-summary text-center mt-8">
                        <h3 className="text-2xl font-bold">Total Cost: ${totalCost.toFixed(2)}</h3>
                        <div className="mt-4 flex justify-center space-x-4">
                            <Button type="primary" danger onClick={clearCart}>
                                Clear Cart
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => navigate('/checkout', { state: { fromCart: true } })}
                            >
                                Checkout
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
