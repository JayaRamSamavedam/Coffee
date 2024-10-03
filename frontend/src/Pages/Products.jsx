import React, { useState, useEffect } from 'react';
import { Pagination, Row, Col } from 'antd';
import ProductCard from '../Components/ProductCard';
import { RequestParams } from '../helpers/axios_helper'; // Import your Axios helper function

const Products = () => {
  const [products, setProducts] = useState([]); // Product data
  const [loading, setLoading] = useState(false); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalProducts, setTotalProducts] = useState(0); // Total number of products
  const [pageSize] = useState(1); // Products per page

  // Fetch products from backend using Axios
  const fetchProducts = async (page, pageSize) => {
    setLoading(true);
    try {
      // Using Axios helper function for API request
      const response = await RequestParams('GET', '/prod/get', { page, limit: pageSize });
      const data = response.data; // Axios stores response data in .data
      setProducts(data.products);
      setTotalProducts(data.total); // Set total number of products for pagination
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  
  // Fetch products when page or pageSize changes
  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
    <div style={{ padding: '20px' }}>
      
        <div>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col key={product.id} span={8}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          <Pagination
            current={currentPage} // Current page being displayed
            total={totalProducts} // Total number of products from the backend
            pageSize={pageSize} // Number of products per page
            onChange={handlePageChange} // Handle page changes
            showSizeChanger={false} // Hide the page size selector if not needed
            style={{ marginTop: '20px', textAlign: 'center' }}
            className='justify-center'
          />
        </div>
      
    </div>
  );
};

export default Products;
