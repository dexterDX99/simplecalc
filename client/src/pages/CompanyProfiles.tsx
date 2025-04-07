import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { INVESTOR_SHARE } from "@/shared/constants";

export default function CompanyProfiles() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Company Profiles</h2>
      <Accordion type="single" collapsible className="space-y-4">
        {/* LED Manufacturing Profile */}
        <AccordionItem value="led-manufacturing" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 hover:no-underline">
            <h3 className="text-xl font-semibold text-green-700">LED Bulb Manufacturing</h3>
          </AccordionTrigger>
          <AccordionContent className="px-6">
            <div className="space-y-6">
              <section>
                <h4 className="text-lg font-medium text-green-600 mb-2">Business Overview</h4>
                <p className="text-gray-600">Manufacturing and wholesale distribution of LED lighting products to retailers and construction companies.</p>
              </section>

              <section>
                <h4 className="text-lg font-medium text-green-600 mb-2">Investment Contract Details</h4>
                <div className="pl-4">
                  <p className="mb-2">This is a <strong>Mudarabah</strong> partnership where:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Investors provide capital for the business</li>
                    <li>Business manager runs operations (buys raw materials, manufactures, and sells)</li>
                    <li>Profits are shared {INVESTOR_SHARE * 100}% to investors, {(1 - INVESTOR_SHARE) * 100}% to manager</li>
                    <li>Investors bear financial risk</li>
                  </ul>
                </div>
              </section>

              <section>
                <h4 className="text-lg font-medium text-green-600 mb-2">Business Model & Revenue</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-1">Cost Structure</h5>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Manufacturing Cost: Rs. 90/bulb</li>
                      <li>Selling Price: Rs. 200/bulb</li>
                      <li>Profit per Bulb: Rs. 110</li>
                      <li>Monthly Production: 12,500 bulbs</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Distribution Channels</h5>
                    <ul className="list-disc pl-4">
                      <li>Wholesale retailers</li>
                      <li>Construction companies</li>
                      <li>Direct corporate clients</li>
                    </ul>
                  </div>
                </div>
              </section>
              <section>
                <h4 className="text-lg font-medium text-green-600 mb-2">Investment Structure</h4>
                <div className="grid grid-cols-2 gap-4">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Total Required: Rs. 1,500,000</li>
                    <li>Minimum Investment: Rs. 5,000</li>
                  </ul>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Period: 3 months</li>
                    <li>Expected Profit: 25-35% per quarter</li>
                  </ul>
                </div>
              </section>
              <section>
                <h4 className="text-lg font-medium text-green-600 mb-2">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>Website: <a href="#" className="text-blue-600">www.ledpakistan.com</a></div>
                  <div>Phone: +92-300-1234567</div>
                </div>
              </section>
            </div>
          </AccordionContent>
        </AccordionItem>

        
      </Accordion>
    </div>
  );
}