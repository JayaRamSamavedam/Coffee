import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Button, List } from 'antd';
import { Request } from '../helpers/axios_helper';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import CustomComment from './CustomComment';
import { set } from '@cloudinary/url-gen/actions/variable';

const ProductInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [hotdeal,sethotdeal] = useState(false);
  const hasFetchedProduct = useRef(false); // Add a ref to track if the product has been fetched
  useEffect(() => {
    if (!hasFetchedProduct.current) {
      const fetchProduct = async () => {
        try {
          const response = await Request("GET", `/prod/getByID/${id}`);
          console.log(response.data);
          setProduct(response.data);
          sethotdeal(response.data.hotDeals)
          hasFetchedProduct.current = true; // Mark as fetched
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Product not found');
          navigate("/view-products");
        }
      };

      fetchProduct();
    }
  }, [hotdeal,id, navigate]);

  const makeItHotdeal = async()=>{
    try{
      const response = await Request("PUT","/admin/prod/makeproducthotdeal",{id:product.productId});
      if(response.status === 200){
      sethotdeal(true);
    }
    else{
      toast.error(response.data.error);
      
    }
    }
    catch(Error){
      toast.error(Error.message)
    }
  }
  const removeHotdeal = async()=>{
    try{
      const response = await Request("PUT","/admin/prod/removehotdeal",{id:product.productId});
      if(response.status === 200){
        sethotdeal(false);
      }
      else{
        toast.error(response.data.error);
      }
    }
    catch(error){
      toast.error(error.message)
    }
  }
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
            <Button type="primary" onClick={fetchComments}>
              Load Comments and Reviews
            </Button>
            <Button type="primary" onClick={deleteProduct}>
              Delete
            </Button>
            <Button type="primary" onClick={editProduct}>
              Edit Product
            </Button>
            {hotdeal ?

<>
<Button type="primary" onClick={removeHotdeal}>
              Remove the hotdeal
            </Button>
</>
:
<>
<Button type="primary" onClick={makeItHotdeal}>
              Make it hotdeal
            </Button>
</>
            }
            
            <Button type="primary" onClick={editProduct}>
              Edit Product
            </Button>
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
            renderItem={comment => (
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
