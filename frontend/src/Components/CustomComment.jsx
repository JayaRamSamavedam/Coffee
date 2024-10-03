import React from 'react';

const CustomComment = ({ email, image, text, rating }) => {
  return (
    <div className="custom-comment flex items-start space-x-4 p-4 border-b border-gray-200">
      <div className="avatar">
        <img src={image} alt={email} className="w-10 h-10 rounded-full" />
      </div>
      <div className="content">
        <div className="author font-bold">{email}</div>
        <div className="rating text-gray-500 text-sm">Rating: {rating}</div>
        <div className="text mt-2">{text}</div>
      </div>
    </div>
  );
};

export default CustomComment;
