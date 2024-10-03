import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Slider, Row, Col, Form, Pagination } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { RequestParams, Request } from '../helpers/axios_helper';
import Card from './Card';

const { Option } = Select;

const Filter = () => {
  const navigate = useNavigate(); // Use useNavigate for navigation
  const location = useLocation(); // Get current location

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading,setloading]  =useState(false);
  const [totalProducts, setTotalProducts] = useState(0); // Track total number of products
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [pageSize] = useState(6); // Products per page
  const [showFilters, setShowFilters] = useState(false); // Toggle filter visibility
  const [filters, setFilters] = useState({
    search: "",
    minPrice: 0,
    maxPrice: 10000,
    rating: 0,
    brand: '',
    category: '',
    subcategory: '',
    minDiscount: 0,
    maxDiscount: 100,
    hotDeals: false,
    sortBy: '',
    order: 'asc',
  });

  const [form] = Form.useForm();

  // Fetch filters and brands when component mounts
  useEffect(() => {
    const fetchFilters = async () => {
      const brandsResponse = await Request("GET", "/prod/getallbrands");
      setBrands(brandsResponse.data);
    };

    fetchFilters();
  }, []);

  // Re-run whenever location.search (query params) changes
  useEffect(() => {
    const parsedQuery = queryString.parse(location.search); // Parse the query string
    applyQueryParamsToFilters(parsedQuery); // Apply the query params to the filters
  }, [location.search]); // Add location.search as a dependency

  const applyQueryParamsToFilters = (params) => {
    console.log(params);
    const updatedFilters = {
      ...filters,
      search: params.search || "",
      brand: params.brand || "",
      minPrice: params.minPrice ? Number(params.minPrice) : 0,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : 10000,
      rating: params.rating ? Number(params.rating) : 0,
      sortBy: params.sortBy || '',
      order: params.order || 'asc',
    };
    setFilters(updatedFilters);

    // Set form field values when query params change (e.g., search)
    form.setFieldsValue({
      search: updatedFilters.search,
      brand: updatedFilters.brand,
    });

    setShowFilters(false);
    fetchProducts(1, pageSize, updatedFilters); // Fetch products with query params
  };

  const fetchProducts = async (page = 1, pageSize = 6, customFilters = filters) => {
    setloading(true);
    const response = await RequestParams("GET", "/prod/filter", {
      ...customFilters,
      page, // Send current page to the backend
      limit: pageSize, // Send page size (products per page) to the backend
    });
    

    setProducts(response.data.products); // Set fetched products
    setTotalProducts(response.data.total); // Set total number of products for pagination
    setloading(false);
  };

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    updateQueryParams(updatedFilters); // Update query params in URL
  };

  const updateQueryParams = (updatedFilters) => {
    const queryParams = {
      search: updatedFilters.search || undefined,
      brand: updatedFilters.brand || undefined,
      minPrice: updatedFilters.minPrice !== 0 ? updatedFilters.minPrice : undefined,
      maxPrice: updatedFilters.maxPrice !== 10000 ? updatedFilters.maxPrice : undefined,
      rating: updatedFilters.rating || undefined,
      sortBy: updatedFilters.sortBy || undefined,
      order: updatedFilters.order || undefined,
    };
    const queryStringified = queryString.stringify(queryParams, { skipNull: true, skipEmptyString: true });
    navigate(`?${queryStringified}`); // Push updated query to the history
  };

  const handlePriceChange = (value) => {
    const updatedFilters = { ...filters, minPrice: value[0], maxPrice: value[1] };
    setFilters(updatedFilters);
    updateQueryParams(updatedFilters); // Update query params in URL
  };

  const handleDiscountChange = (value) => {
    const updatedFilters = { ...filters, minDiscount: value[0], maxDiscount: value[1] };
    setFilters(updatedFilters);
    updateQueryParams(updatedFilters); // Update query params in URL
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page
    fetchProducts(page); // Fetch products for the new page
  };

  const applyFilters = () => {
    // Fetch products using the current filters and page number when "Apply Filters" is clicked
    fetchProducts(currentPage, pageSize);
    setShowFilters(false); // Hide filters once applied
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: "",
      minPrice: 0,
      maxPrice: 10000,
      rating: 0,
      brand: '',
      minDiscount: 0,
      maxDiscount: 100,
      sortBy: '',
      order: 'asc',
    };
    setFilters(defaultFilters);
    form.resetFields(); // Reset the form fields
    setCurrentPage(1); // Reset to first page
    fetchProducts(1, pageSize); // Fetch products with cleared filters
    navigate(''); // Clear query params from URL
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters); // Toggle filter visibility
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
    <>
      <div style={{ left: '10px', }} className='p-5'>
        <Button type="primary" onClick={toggleFilters}>
          {showFilters ? "Close Filters" : "Show Filters"}
        </Button>
      </div>

      {showFilters && (
        <div className="p-6 bg-white shadow-lg rounded-lg mb-4">
          <Form layout="vertical" form={form}>
            <Row gutter={[16, 16]}>
              {/* Form Fields */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Search by name" name="search">
                  <Input
                    placeholder="Search by name"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="rounded-md shadow-sm border-gray-300 focus:border-blue-300"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Select Brand" name="brand">
                  <Select
                    placeholder="Select Brand"
                    value={filters.brand}
                    onChange={(value) => handleFilterChange('brand', value)}
                    style={{ width: '100%' }}
                    className="rounded-md shadow-sm border-gray-300 focus:border-blue-300"
                  >
                    {brands.map((brand) => (
                      <Option key={brand._id} value={brand.name}>
                        {brand.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Price Range" name="priceRange">
                  <Slider
                    range
                    value={[filters.minPrice, filters.maxPrice]}
                    max={10000}
                    onChange={handlePriceChange}
                    className="rounded-md shadow-sm border-gray-300 focus:border-blue-300"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Discount Range" name="discountRange">
                  <Slider
                    range
                    value={[filters.minDiscount, filters.maxDiscount]}
                    max={100}
                    onChange={handleDiscountChange}
                    className="rounded-md shadow-sm border-gray-300 focus:border-blue-300"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Rating" name="rating">
                  <Slider
                    value={filters.rating}
                    max={5}
                    onChange={(value) => handleFilterChange('rating', value)}
                    className="rounded-md shadow-sm border-gray-300 focus:border-blue-300"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Sort By" name="sortBy">
                  <Select
                    placeholder="Sort By"
                    value={filters.sortBy}
                    onChange={(value) => handleFilterChange('sortBy', value)}
                    style={{ width: '100%' }}
                    className="rounded-md shadow-sm border-gray-300 focus:border-blue-300"
                  >
                    <Option value="price">Price</Option>
                    <Option value="rating">Rating</Option>
                    <Option value="views">Views</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Order" name="order">
                  <Select
                    placeholder="Order"
                    value={filters.order}
                    onChange={(value) => handleFilterChange('order', value)}
                    style={{ width: '100%' }}
                    className="rounded-md shadow-sm border-gray-300 focus:border-blue-300"
                  >
                    <Option value="asc">Ascending</Option>
                    <Option value="desc">Descending</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} className="mt-6 text-center">
                <Button type="primary" onClick={applyFilters} className="rounded-md px-6 py-2 shadow-md">
                  Apply Filters
                </Button>
                <Button onClick={clearFilters} className="rounded-md px-6 py-2 shadow-md ml-2">
                  Clear Filters
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}

      <div className="container mx-auto p-8">
        <div className="flex flex-row flex-wrap -mx-2">
          {products.map((product) => (
            <div className="w-full sm:w-1/2 md:w-1/3 mb-4 px-2" key={product._id}>
              <Card product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-4">
        <Pagination
          current={currentPage}
          total={totalProducts} // Use total products to calculate pages
          pageSize={pageSize}
          onChange={handlePageChange} // Trigger page change
          className='justify-center'
        />
      </div>
    </>
  );
};

export default Filter;
