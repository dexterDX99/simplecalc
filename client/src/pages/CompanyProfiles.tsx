
import React from 'react';

export default function CompanyProfiles() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Company Profiles</h2>
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="font-semibold text-lg mb-2">LED Bulb Manufacturing</h3>
          <p className="text-gray-600 mb-3">Manufacturing and wholesale distribution of LED lighting products to retailers and construction companies.</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Website:</span>
              <a href="#" className="text-primary-600 ml-2">www.ledpakistan.com</a>
            </div>
            <div>
              <span className="text-gray-500">Contact:</span>
              <span className="ml-2">+92-300-1234567</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="font-semibold text-lg mb-2">Gold Jewelry Investment</h3>
          <p className="text-gray-600 mb-3">Investment in gold jewelry through a diversified portfolio, offering exposure to a stable and appreciating asset class.</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Website:</span>
              <a href="#" className="text-primary-600 ml-2">www.goldinvest.com</a>
            </div>
            <div>
              <span className="text-gray-500">Contact:</span>
              <span className="ml-2">+92-300-7890123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
