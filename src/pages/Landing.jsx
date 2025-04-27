import React from 'react';
import Categories from '../components/Categories';
import FlashDeals from '../components/FlashDeals';
import SummerSale from '../components/SummerSale';

const Landing = () => {
  return (
    <div className="space-y-12">
      <SummerSale />
      <FlashDeals />
      <Categories />
    </div>
  );
};

export default Landing; 