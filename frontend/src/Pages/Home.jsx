import React, { useEffect, useState } from 'react';
import Newsletter from '../Components/Newsletter';
import HeroImage from '../assets/image.png';
import Testimonial from '../assets/Testimonials/image.png';
import ProductImage from '../assets/products/image.png'; // Default product image if product doesn't have an image.
import { RequestParams } from '../helpers/axios_helper'; // Assuming you have this helper function defined
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../App';
const HomePage = () => {
  const { user, setvisible, setRedirectPath } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Assuming you have a way to determine if user is logged in

  // Function to fetch products based on login status
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const endpoint = user.loggedIn ? '/prod/recommendations' : '/prod/gettopproducts';
      const response = await RequestParams('GET', endpoint); // Use the correct endpoint based on login status
      const fetchedProducts = response.data.products;
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [user.loggedIn]);

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
    <div className="bg-[#f5f3f0] dark:bg-[#2a1a14] text-[#4b3f34] dark:text-[#d3b89b] min-h-screen">
      <div>
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-center text-center py-20 bg-[#f5f3f0] dark:bg-[#2a1a14] border-b-2 border-[#8b6f4e] dark:border-[#3c2a1b]">
          <div className="md:w-1/2 px-6 md:px-12 lg:px-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-wide">
              Welcome to <span className="text-[#7a5e48] dark:text-[#e5c1a8]">CoffeCup</span>
            </h1>
            <p className="text-lg md:text-xl max-w-lg mb-8 leading-relaxed text-[#7a5e48] dark:text-[#e5c1a8]">
              Empowering communities through outreach, education, and impact.
            </p>
            <div className="flex space-x-4 justify-center">
              <a href="/filters" className="bg-[#4b3f34] text-[#f5f3f0] py-3 px-6 rounded-lg dark:bg-[#d3b89b] dark:text-[#2a1a14] hover:bg-[#7a5e48] dark:hover:bg-[#8b6f4e] transition">
                Shop
              </a>
              <a href="/brandspage" className="border-2 border-[#4b3f34] text-[#4b3f34] py-3 px-6 rounded-lg hover:bg-[#7a5e48] hover:text-white dark:hover:text-white dark:border-[#d3b89b] dark:text-[#d3b89b] dark:hover:bg-[#8b6f4e] transition">
                Discover
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 px-6">
            <img src={HeroImage} alt="Hero" className="max-w-full h-auto rounded-md shadow-lg" />
          </div>
        </section>

        {/* Products Section */}
       {/* Products Section */}
<section className="py-20 bg-[#ebe2d6] dark:bg-[#3c2a1b]">
  <div className="container mx-auto px-5 lg:max-w-screen-xl">
    <h2 className="text-4xl font-semibold text-center text-[#4b3f34] dark:text-[#d3b89b] mb-8">
      {user.loggedIn ? 'Recommended Products' : 'Top Products'}
    </h2>

    {loading ? (
      <div className="text-center text-[#4b3f34] dark:text-[#d3b89b]">Loading products...</div>
    ) : (
      <div className="relative">
        <div className="flex space-x-8 overflow-x-auto p-5 scrollbar-hide snap-x snap-mandatory">
          {/* Render Products */}
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="min-w-[300px] bg-white dark:bg-[#2a1a14] p-6 rounded-lg shadow-md snap-start"
                style={{ flex: '0 0 300px' }} // Ensure each product takes up a consistent width
              >
                <img
                  src={product.image || ProductImage} // Fallback to default image if product doesn't have an image
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-semibold text-[#4b3f34] dark:text-[#d3b89b] mb-3">
                  {product.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-5">
                  {product.description || 'No description available.'}
                </p>
                <Link
                  to={`/product-info/${product.productId}`}
                  className="block text-center bg-[#4b3f34] text-[#f5f3f0] py-2 px-5 rounded-lg dark:bg-[#d3b89b] dark:text-[#2a1a14] hover:bg-[#7a5e48] dark:hover:bg-[#8b6f4e] transition"
                >
                  Buy Now
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center text-[#4b3f34] dark:text-[#d3b89b]">
              No products found.
            </div>
          )}
        </div>

        {/* This spacer ensures the section still looks good even with just one or two products */}
        {products.length < 3 && (
          <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-[#ebe2d6] dark:from-[#3c2a1b] w-20 pointer-events-none"></div>
        )}
      </div>
    )}
  </div>
</section>


        {/* Testimonials and Newsletter */}
        <section className="px-10 py-20 bg-[#f5f3f0] dark:bg-[#2a1a14]">
          {/* Rest of your content */}
        </section>

        <div className="p-3 dark:bg-[#2a1a14]">
          <Newsletter />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
