import React, { useState, useEffect } from 'react';
import { Request } from '../helpers/axios_helper';

import { message } from 'antd';
import BrandCard from '../Components/BrandCard';

const Brands = () => {
  const [brand, setBrand] = useState([]);

  const [loading,setLoading] = useState(false);
  useEffect(() => {
    // console.log(document.cookie)
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await Request("GET", "/prod/getallbrands");
        console.log(response.data)
        setBrand(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const removeCategory = (brandname) => {
    setBrand(brand.filter(category => category.name !== brandname));
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
    <div>
      <h2>Brands</h2>
      <div className="container mx-auto p-8">
        <div className="flex flex-row flex-wrap -mx-2">
          {brand.map((cat) => (
            <div key={cat.name} className="w-full sm:w-1/2 md:w-1/3 mb-4 px-2">
              <BrandCard cat={cat} removeCategory={removeCategory} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
