import React from 'react';
import { Card } from 'antd';

const ProductCard = ({ product }) => {
  return (
    <Card title={product.name} bordered={false} style={{ width: 300 }}>
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
    </Card>
  );
};

export default ProductCard;
