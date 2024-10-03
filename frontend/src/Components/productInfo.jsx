import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Button, List, InputNumber } from 'antd';  // Import InputNumber for quantity selection
import { Request } from '../helpers/axios_helper';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import CustomComment from './CustomComment';

const ProductInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [quantity, setQuantity] = useState(1);  // Default quantity set to 1 kg
  const [showComments, setShowComments] = useState(false);
  const [hotdeal, setHotDeal] = useState(false);
  const hasFetchedProduct = useRef(false); // Add a ref to track if the product has been fetched

  useEffect(() => {
    if (!hasFetchedProduct.current) {
      const fetchProduct = async () => {
        try {
          const response = await Request("GET", `/prod/getByID/${id}`);
          console.log(response.data);
          setProduct(response.data);
          setHotDeal(response.data.hotDeals);
          hasFetchedProduct.current = true; // Mark as fetched
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Product not found');
          navigate("/view-products");
        }
      };

      fetchProduct();
    }
  }, [hotdeal, id, navigate]);

  const makeItHotDeal = async () => {
    try {
      const response = await Request("PUT", "/admin/prod/makeproducthotdeal", { id: product.productId });
      if (response.status === 200) {
        setHotDeal(true);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeHotDeal = async () => {
    try {
      const response = await Request("PUT", "/admin/prod/removehotdeal", { id: product.productId });
      if (response.status === 200) {
        setHotDeal(false);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await Request("GET", `/prod/getByProduct/${id}`);
      console.log(response);
      const data = response.data;
      if (data.error) {
        setComments([]);
        setShowComments(false);
        toast.error(data.error);
      } else {
        setComments(data);
        setShowComments(true);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to fetch comments');
    }
  };

  const deleteProduct = async () => {
    try {
      const response = await Request("DELETE", `/admin/prod/delete/${product.productId}`);
      if (response.data.message) {
        toast.success('Product deleted successfully');
        navigate("/view-products");
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const editProduct = () => {
    if (product) {
      navigate(`/edit-product/${product.productId}`);
    } else {
      toast.error('Product not found');
      navigate("/view-products");
    }
  };

  const addToCart = async () => {
    try {
      const response = await Request('POST', `/cart/add/${product.productId}`, { quantity });
      if (response.status === 200) {
        toast.success('Product added to cart');
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  const buyNow = async () => {
    try {
      const response = await Request('POST', `/cart/add/${product.productId}`, { quantity });
      if (response.status === 200) {
        navigate('/checkout');  // Navigate to checkout after adding to cart
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error('Failed to proceed with purchase');
    }
  };

  return (
    <div className="container mx-auto p-4">
      {product && (  // Conditional rendering to ensure product is defined
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Images */}
          <div className="md:w-1/2">
            <Carousel autoplay>
              <div>
                <img src={product.coverImage} alt="Product" className="w-full h-auto" />
              </div>
              {product.images && product.images.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Product ${index}`} className="w-full h-auto" />
                </div>
              ))}
            </Carousel>
          </div>

          {/* Right Side - Product Details */}
          <div className="md:w-1/2 md:pl-8">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">Category: {product.category}</p>
            <p className="text-gray-600 mb-4">Item Type: {product.itemType}</p>
            <p className="text-gray-800 mb-4">{product.description}</p>
            <p className="text-gray-800 font-bold text-xl mb-4">${product.price}</p>
            <p className="text-gray-600 mb-4">Discount: {product.discount}%</p>
            <p className="text-gray-800 font-bold text-xl mb-4">Discounted Price: ${product.discountedPrice}</p>

            {/* Quantity Selector */}
            <div className="flex items-center mb-4">
              <span className="mr-4">Quantity (kg):</span>
              <InputNumber min={1} value={quantity} onChange={(value) => setQuantity(value)} />
            </div>

            {/* Add to Cart and Buy Now Buttons */}
            <Button type="primary" className="mr-4" onClick={addToCart}>
              Add to Cart
            </Button>
            <Button type="primary" onClick={buyNow}>
              Buy Now
            </Button>

            <Button type="primary" onClick={fetchComments} className="mt-4">
              Load Comments and Reviews
            </Button>
            <Button type="danger" onClick={deleteProduct} className="mt-4">
              Delete Product
            </Button>
            <Button type="primary" onClick={editProduct} className="mt-4">
              Edit Product
            </Button>

            {hotdeal ? (
              <Button type="primary" onClick={removeHotDeal} className="mt-4">
                Remove the Hot Deal
              </Button>
            ) : (
              <Button type="primary" onClick={makeItHotDeal} className="mt-4">
                Make it Hot Deal
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Comments and Reviews</h2>
          <List
            className="comment-list"
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment) => (
              <List.Item>
                <CustomComment
                  email={comment.email}
                  image={comment.image}
                  text={comment.text}
                  rating={comment.rating}
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
