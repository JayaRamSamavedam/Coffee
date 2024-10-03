import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Request } from '../helpers/axios_helper'; // Assuming the axios utils are in `api.js`
import { FaInstagram, FaTwitter, FaYoutube, FaGlobe } from 'react-icons/fa'; // Importing icons for social media

const BrandInfoPage = () => {
  const { id } = useParams(); // Get the brand ID from the URL
  const [brand, setBrand] = useState(null); // To store the brand data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Function to fetch brand data
    const fetchBrand = async () => {
      try {
        setLoading(true);
        const response = await Request('GET', `/prod/getBrand/${id}`); // Adjust the URL based on your API route
        console.log(response);
        setBrand(response.data); // Set the brand data
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Brand Image */}
      <div className="flex items-center justify-center mb-4">
        {brand.proImage && (
          <img
            src={brand.proImage}
            alt={`${brand.name} logo`}
            className="w-32 h-32 rounded-full shadow-md object-cover"
          />
        )}
      </div>
      
      {/* Brand Name */}
      <h1 className="text-3xl font-bold text-center mb-4">{brand.name}</h1>
      
      {/* Discount Section */}
      {brand.discount > 0 && (
        <div className="bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg text-center mb-4">
          <span className="font-semibold">Special Discount: </span>
          {brand.discount}% Off!
        </div>
      )}

      <div className="space-y-4">
        {/* Brand Story */}
        {brand.brandstory && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Our Story</h2>
            <p className="text-gray-700">{brand.brandstory}</p>
          </div>
        )}

        {/* Roasting Techniques */}
        {brand.roasting_techniques && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Roasting Techniques</h2>
            <p className="text-gray-700">{brand.roasting_techniques}</p>
          </div>
        )}

        {/* Coffee Blends */}
        {brand.coffee_blends && brand.coffee_blends.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Our Coffee Blends</h2>
            <ul className="list-disc list-inside text-gray-700">
              {brand.coffee_blends.map((blend, index) => (
                <li key={index}>{blend}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Email */}
        {brand.contact_email && (
          <div className="flex items-center space-x-2 mt-4">
            <span className="font-semibold text-gray-700">Contact Us: </span>
            <a
              href={`mailto:${brand.contact_email}`}
              className="text-blue-500 hover:underline"
            >
              {brand.contact_email}
            </a>
          </div>
        )}

        {/* Website Link */}
        {brand.link && (
          <div className="flex items-center space-x-2 mt-4">
            <FaGlobe className="text-2xl text-gray-500" />
            <a
              href={brand.link}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit our Website
            </a>
          </div>
        )}

        {/* Social Media Links */}
        {brand.social_links && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Follow Us</h2>
            <div className="flex space-x-4">
              {brand.social_links.instagram && (
                <a
                  href={brand.social_links.instagram}
                  className="text-pink-600 hover:text-pink-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="text-2xl" />
                </a>
              )}
              {brand.social_links.twitter && (
                <a
                  href={brand.social_links.twitter}
                  className="text-blue-400 hover:text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="text-2xl" />
                </a>
              )}
              {brand.social_links.youtube && (
                <a
                  href={brand.social_links.youtube}
                  className="text-red-600 hover:text-red-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube className="text-2xl" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandInfoPage;
