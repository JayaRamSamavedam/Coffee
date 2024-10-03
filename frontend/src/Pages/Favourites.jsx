import React, { useEffect, useState } from 'react';
import { Button, List, Card, InputNumber, Popconfirm, message, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Request } from '../helpers/axios_helper';
import { useNavigate } from 'react-router-dom';

const Favourites = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(false);

    // Fetch the favourites details when the component mounts
    useEffect(() => {
        fetchCartDetails();
    }, []);

    // Function to fetch favourites details from the server
    const fetchCartDetails = async () => {
        setLoading(true);
        try {
            const response = await Request('GET', '/prod/getFavourites'); // Adjust the endpoint if necessary
            if (response && response.data) {
                setCartItems(response.data.products || []);
                console.log(response.data) // Ensure products is an array
                console.log(cartItems)
            } else {
                setCartItems([]); // Set to an empty array if response is invalid
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching favourites details:', error);
            message.error('Failed to load favourites');
            setLoading(false);
        }
    };

    // Function to increment quantity
    

    // Function to decrement quantity
    
    // Function to remove an item from the favourites
    const handleclick = async(productId)=>{
        
        navigate(`/product-info/${productId}`);
       }

    const removeItemfromCart = async (productId) => {
        try {
            await Request('post', `/prod/remFav`,{productId});
            fetchCartDetails(); // Refresh the favourites after removing the item
            message.success('Item removed from favourites');
        } catch (error) {
            message.error('Failed to remove item');
        }
    };

    // Function to clear the entire favourites

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Your favourites</h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p>Loading Favourites...</p>
                </div>
            ) : cartItems.length === 0 ? ( // Handle empty favourites case
                <div className="flex justify-center items-center h-64">
                    <p className="text-xl text-gray-600">Your WishList is empty</p>
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
                                        <button onClick={() => handleclick(item.productId)}
                                        class="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      Go to product
</button>,

                                        <Popconfirm
                                            title="Are you sure to remove this product?"
                                            onConfirm={() => removeItemfromCart(item.productId)}
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
                                            {/* <p className="text-gray-600">Total: ${(item.discountedPrice * item.quantity).toFixed(2)}</p> */}
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        )}
                    />
                </>
            )}
        </div>
    );
};

export default Favourites;
