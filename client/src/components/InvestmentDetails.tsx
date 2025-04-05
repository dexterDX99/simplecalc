import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { MIN_PROFIT_RATE, MAX_PROFIT_RATE, INVESTOR_SHARE } from "@/shared/constants";

export default function InvestmentDetails() {
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="text-xl font-bold mb-4 text-green-700">
        LED Bulb Manufacturing - Business Details
      </h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-green-600 font-medium">
            What is the Investment Contract?
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
        
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-green-600 font-medium">
            Business Plan & Investment
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>The business <strong>manufactures and sells LED bulbs</strong>.</li>
              <li><strong>Investment required:</strong> <strong>Rs. 1,500,000</strong> (from 15 investors).</li>
              <li><strong>Profit generated after 3 months:</strong> <strong>Rs. 750,000</strong>.</li>
              <li>
                <strong>Profit distribution:</strong>
                <ul className="list-circle pl-5 mt-1">
                  <li><strong>{INVESTOR_SHARE * 100}% to investors</strong> = <strong>Rs. 450,000</strong></li>
                  <li><strong>{(1 - INVESTOR_SHARE) * 100}% to the business manager</strong> = <strong>Rs. 300,000</strong></li>
                </ul>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-green-600 font-medium">
            How Does It Work? (Step-by-Step)
          </AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li><strong>Investors contribute money</strong> (total Rs. 1,500,000).</li>
              <li><strong>Business buys materials, manufactures LED bulbs, and sells them</strong>.</li>
              <li><strong>After 3 months, total revenue = Rs. 3,000,000</strong>.</li>
              <li><strong>After deducting costs, the net profit = Rs. 750,000</strong>.</li>
              <li><strong>Profit is split:</strong> {INVESTOR_SHARE * 100}% (₹450,000) for investors, {(1 - INVESTOR_SHARE) * 100}% (₹300,000) for the manager.</li>
              <li><strong>Each investor gets their capital back + their share of the profit</strong>.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-green-600 font-medium">
            Key Takeaways
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Safe for investors</strong> (business manager does the work).</li>
              <li><strong>Transparent profit sharing</strong> (based on agreed ratio).</li>
              <li><strong>Investors earn based on their contribution</strong>.</li>
              <li><strong>Higher investment = higher earnings</strong>.</li>
              <li><strong>Business manager benefits by earning a share of the profits</strong>.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-green-600 font-medium">
            Company Information
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Green Light LED Manufacturing</h4>
                <p className="text-sm text-gray-600">Established 2022</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">Location:</p>
                  <p className="text-gray-600">Industrial Zone, Karachi</p>
                </div>
                <div>
                  <p className="font-medium">Business Type:</p>
                  <p className="text-gray-600">Manufacturing</p>
                </div>
                <div>
                  <p className="font-medium">Contact:</p>
                  <p className="text-gray-600">info@greenlightled.pk</p>
                </div>
                <div>
                  <p className="font-medium">Website:</p>
                  <p className="text-gray-600">greenlightled.pk</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium">About:</p>
                <p className="text-sm text-gray-600">
                  Green Light LED is a rapidly growing manufacturer of energy-efficient lighting solutions. 
                  Our products are known for their quality, durability, and energy efficiency, meeting the 
                  growing market demand for sustainable lighting options.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}