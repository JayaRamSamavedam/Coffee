import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Button, List, InputNumber, message, Input, Rate, Form } from 'antd';
import { Request } from '../helpers/axios_helper';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../App';

const { TextArea } = Input;

const ProductInfo = () => {
  const { user, setvisible, setRedirectPath } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const hasFetchedProduct = useRef(false);
  const [loading,setloading] = useEffect(false);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReviewText, setEditingReviewText] = useState('');
  const [editingReviewRating, setEditingReviewRating] = useState(0);

  const fetchProduct = async () => {
    try {
      setloading(true);
      const response = await Request("GET", `/prod/getByID/${id}`);
      setProduct(response.data);
      setloading(false);
      hasFetchedProduct.current = true;
    } catch (error) {
      toast.error('Product not found');
      navigate("/view-products");
    }
  };

  useEffect(() => {
    if (!hasFetchedProduct.current) {
      fetchProduct();
    }
  }, [id, navigate]);

  const fetchReviews = async () => {
    try {
      setloading(true);
      const response = await Request('GET', `/prod/getByProduct/${product.productId}`);
     setloading(false);
      if (response.status === 200) {
        setReviews(response.data.review || []);
        if (response.data.error) {
          toast.info(response.data.error);
        }
      }
    } catch (error) {
      toast.error('Failed to load reviews');
    }
  };

  const handleAddReview = async () => {
    if (!user.loggedIn) {
      setvisible(true);
      setRedirectPath(location);
    } else {

      if (!newRating || !newReview.trim()) {
        toast.error('Please provide both a rating and a review text');
        return;
      }
      try {
        setloading(true);
        const response = await Request('POST', '/user/create-review', {
          email: user.email,
          productId: product.productId,
          text: newReview,
          rating: newRating,
        });
        setloading(false);
        if (response.status === 200) {
          toast.success('Review added');
          fetchReviews();
          setNewReview('');
          setNewRating(0);
        }
      } catch (error) {
        toast.error('Failed to add review');
      }
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditingReviewText(review.text);
    setEditingReviewRating(review.rating);
  };

  const handleEditReview = async (reviewId, newText, newRating) => {
    if (!user.loggedIn) {
      setvisible(true);
      setRedirectPath(location);
    } else {
      try {
        setloading(true);
        const response = await Request('POST', '/user/editreview', {
          id: reviewId,
          email: user.details.email,
          productId: product.productId,
          text: newText,
          rating: newRating,
        });
        setloading(false);
        if (response.status === 200) {
          toast.success('Review updated');
          fetchReviews();
          setEditingReviewId(null);
          setEditingReviewText('');
          setEditingReviewRating(0);
        }
      } catch (error) {
        toast.error('Failed to update review');
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user.loggedIn) {
      setvisible(true);
      setRedirectPath(location);
    } else {
      try {
        setloading(true);
        const response = await Request('POST', '/user/delete-review', {
          email: user.details.email,
          productId: product.productId,
          id: reviewId,
        });
        setloading(false);
        if (response.status === 200) {
          toast.success('Review deleted');
          fetchReviews();
        }
      } catch (error) {
        toast.error('Failed to delete review');
      }
    }
  };

  const addToFav = async () => {
    if (!user.loggedIn) {
      setvisible(true);
      setRedirectPath(location);
    } else {
      try {
        setloading(true)
        const response = await Request('POST', `/prod/addfav/`, { productId: product.productId });
       setloading(false)
        if (response.status === 200) {
          toast.success('Product added to favourites');
          navigate("/wish-list", { replace: true });
        } else if (response.status === 409) {
          toast.error('Product is already in your wishlist');
        } else {
          toast.error(response.data.error || 'Failed to add product to favourites');
        }
      } catch (error) {
        toast.error(error.message || 'An unexpected error occurred');
      }
    }
  };

  const addToCart = async () => {
    if (!user.loggedIn) {
      setvisible(true);
      setRedirectPath(location);
    } else {
      try {
        const response = await Request('POST', `/cart/add/${product.productId}`, { quantity });
        if (response.status === 200) {
          toast.success('Product added to cart');
          navigate("/cart");
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        toast.error('Failed to add product to cart');
      }
    }
  };
  if (loading) {
    return (
      <div className="flex space-x-2 justify-center items-center h-screen dark:invert">
        <span className="sr-only">Loading...</span>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      {product && (
        <div className="flex flex-col md:flex-row">
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

          <div className="md:w-1/2 md:pl-8">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">origin: {product.origin}</p>
            <p className="text-gray-600 mb-4">flavour: {product.flavour}</p>
            <p className="text-gray-600 mb-4">roastlevel: {product.roastlevel}</p>
            <p className="text-gray-600 mb-4">brandname: {product.brandname}</p>
            <p className="text-gray-800 mb-4">{product.description}</p>
            <p className="text-gray-800 font-bold text-xl mb-4">${product.price}</p>
            <p className="text-gray-600 mb-4">Discount: {product.discount}%</p>
            <p className="text-gray-800 font-bold text-xl mb-4">Discounted Price: ${product.discountedPrice}</p>

            <div className="flex items-center mb-4">
              <span className="mr-4">Quantity (kg):</span>
              <InputNumber min={1} value={quantity} onChange={(value) => setQuantity(value)} />
            </div>

            <Button type="primary" className="mr-4" onClick={addToCart}>
              Add to Cart
            </Button>
            <Button
              type="primary"
              onClick={() =>
                navigate('/checkout', {
                  state: { fromCart: false, productId: product.productId, quantity: quantity },
                })
              }
            >
              Buy Now
            </Button>

            <Button type="primary" className="mr-4" onClick={addToFav}>
              Add to wishlist
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>

        <Button type="primary" onClick={fetchReviews} className="mb-4">
          Load Reviews
        </Button>

        <List
          dataSource={reviews}
          renderItem={(review) => (
            <List.Item
              actions={
                (user.details.email === review.email || user.details.userGroup === 'admin') ? [
                  <Button onClick={() => handleEditClick(review)}>Edit</Button>,
                  <Button onClick={() => handleDeleteReview(review._id)}>Delete</Button>
                ] : null
              }
            >
              <List.Item.Meta
                title={<Rate disabled value={review.rating} />}
                description={review.text}
              />

              {editingReviewId === review._id && (
                <div className="mt-4">
                  <Rate value={editingReviewRating} onChange={setEditingReviewRating} />
                  <TextArea
                    rows={4}
                    value={editingReviewText}
                    onChange={(e) => setEditingReviewText(e.target.value)}
                    className="mb-4"
                  />
                  <Button type="primary" onClick={() => handleEditReview(review._id, editingReviewText, editingReviewRating)}>
                    Save Changes
                  </Button>
                  <Button onClick={() => setEditingReviewId(null)}>
                    Cancel
                  </Button>
                </div>
              )}
            </List.Item>
          )}
        />

        <div className="mt-8">
          <h3>Add Your Review</h3>
          <Rate onChange={setNewRating} value={newRating} />
          <TextArea rows={4} value={newReview} onChange={(e) => setNewReview(e.target.value)} className="mb-4" />
          <Button type="primary" onClick={handleAddReview}>
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
