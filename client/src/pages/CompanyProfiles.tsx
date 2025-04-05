
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { INVESTOR_SHARE } from "@/shared/constants";

export default function CompanyProfiles() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Company Profiles</h2>
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="font-semibold text-lg mb-2">LED Bulb Manufacturing</h3>
          <p className="text-gray-600 mb-3">Manufacturing and wholesale distribution of LED lighting products to retailers and construction companies.</p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-green-600 font-medium">
                Investment Contract Details
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">
                  This is a <strong>Mudarabah</strong> partnership where:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li><strong>Investors provide capital</strong> for the business.</li>
                  <li><strong>The business manager runs operations</strong> (buys raw materials, manufactures, and sells).</li>
                  <li><strong>Profits are shared</strong> based on an agreed ratio (in this case, <strong>Investors {INVESTOR_SHARE * 100}% – Manager {(1 - INVESTOR_SHARE) * 100}%</strong>).</li>
                  <li><strong>Investors bear financial risk</strong> (if there's a loss, they lose money, but the manager loses effort).</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
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
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-green-600 font-medium">
                Investment Contract Details
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">
                  This is a <strong>Mudarabah</strong> partnership where:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li><strong>Investors provide capital</strong> for gold jewelry portfolio management.</li>
                  <li><strong>The business manager handles</strong> gold acquisition, storage, and sales.</li>
                  <li><strong>Profits are shared</strong> based on an agreed ratio (in this case, <strong>Investors {INVESTOR_SHARE * 100}% – Manager {(1 - INVESTOR_SHARE) * 100}%</strong>).</li>
                  <li><strong>Investors bear financial risk</strong> while benefiting from gold's inherent value.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
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
