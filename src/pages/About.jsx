import React from "react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Our Story</h2>
        <p className="text-gray-700 mb-4">
          Founded in 2023, our e-commerce store started with a simple mission: to provide high-quality products at affordable prices with exceptional customer service.
        </p>
        <p className="text-gray-700 mb-4">
          What began as a small online shop has grown into a trusted destination for electronics, home goods, and lifestyle products. We carefully select each item in our inventory to ensure it meets our standards for quality and value.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Our Values</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>Customer satisfaction is our highest priority</li>
          <li>Transparency in all our business practices</li>
          <li>Commitment to sustainable and ethical sourcing</li>
          <li>Supporting the communities we serve</li>
          <li>Continuous improvement in everything we do</li>
        </ul>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Email:</span> support@example.com
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Phone:</span> (123) 456-7890
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Hours:</span> Monday - Friday, 9am - 5pm EST
        </p>
      </div>
    </div>
  );
} 