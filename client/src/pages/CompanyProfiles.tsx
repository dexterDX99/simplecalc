
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { INVESTOR_SHARE } from "@/shared/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CompanyProfiles() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Company Profiles</h2>
      <Tabs defaultValue="led" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="led">LED Manufacturing</TabsTrigger>
          <TabsTrigger value="gold">Gold Investment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="led" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h3 className="font-semibold text-lg mb-2">LED Bulb Manufacturing</h3>
            <p className="text-gray-600 mb-3">Manufacturing and wholesale distribution of LED lighting products to retailers and construction companies.</p>
            
            <Accordion type="single" collapsible className="w-full space-y-2">
              <AccordionItem value="contract">
                <AccordionTrigger className="text-green-600 font-medium">
                  Investment Contract Details
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">This is a <strong>Mudarabah</strong> partnership where:</p>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li><strong>Investors provide capital</strong> for the business.</li>
                    <li><strong>The business manager runs operations</strong> (buys raw materials, manufactures, and sells).</li>
                    <li><strong>Profits are shared</strong> based on an agreed ratio (Investors {INVESTOR_SHARE * 100}% – Manager {(1 - INVESTOR_SHARE) * 100}%).</li>
                    <li><strong>Investors bear financial risk</strong> (if there's a loss, they lose money, but the manager loses effort).</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="business-model">
                <AccordionTrigger className="text-green-600 font-medium">
                  Business Model & Revenue
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li><strong>Manufacturing Cost:</strong> Rs. 90 per bulb</li>
                    <li><strong>Selling Price:</strong> Rs. 200 per bulb</li>
                    <li><strong>Profit per Bulb:</strong> Rs. 110</li>
                    <li><strong>Monthly Production:</strong> 12,500 bulbs</li>
                    <li><strong>Distribution Channels:</strong>
                      <ul className="list-circle pl-5 mt-1">
                        <li>Wholesale retailers</li>
                        <li>Construction companies</li>
                        <li>Direct corporate clients</li>
                      </ul>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="investment-details">
                <AccordionTrigger className="text-green-600 font-medium">
                  Investment Structure
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li><strong>Total Investment Required:</strong> Rs. 1,500,000</li>
                    <li><strong>Minimum Investment:</strong> Rs. 5,000</li>
                    <li><strong>Investment Period:</strong> 3 months</li>
                    <li><strong>Expected Profit:</strong> 25-35% per quarter</li>
                    <li><strong>Profit Distribution:</strong> Every 3 months</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq">
                <AccordionTrigger className="text-green-600 font-medium">
                  Frequently Asked Questions
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Q: What happens if the business faces losses?</h4>
                      <p>A: In a Mudarabah contract, financial losses are borne by investors, while the business manager loses their time and effort.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Q: Can I withdraw my investment early?</h4>
                      <p>A: Early withdrawal is possible after the first quarter, subject to business liquidity and management approval.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Q: How is my investment protected?</h4>
                      <p>A: The business maintains insurance, follows strict quality control, and has established distribution channels.</p>
                    </div>
                  </div>
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
        </TabsContent>

        <TabsContent value="gold" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h3 className="font-semibold text-lg mb-2">Gold Jewelry Investment</h3>
            <p className="text-gray-600 mb-3">Investment in gold jewelry through a diversified portfolio, offering exposure to a stable and appreciating asset class.</p>
            
            <Accordion type="single" collapsible className="w-full space-y-2">
              <AccordionItem value="contract">
                <AccordionTrigger className="text-green-600 font-medium">
                  Investment Contract Details
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">This is a <strong>Mudarabah</strong> partnership focused on gold investment where:</p>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li><strong>Investors provide capital</strong> for gold jewelry acquisition</li>
                    <li><strong>The business manager handles</strong> procurement, storage, and sales</li>
                    <li><strong>Profits are shared</strong> based on agreed ratio (Investors {INVESTOR_SHARE * 100}% – Manager {(1 - INVESTOR_SHARE) * 100}%)</li>
                    <li><strong>Portfolio is diversified</strong> across different types of gold jewelry</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="business-model">
                <AccordionTrigger className="text-green-600 font-medium">
                  Business Model & Strategy
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li><strong>Investment Strategy:</strong>
                      <ul className="list-circle pl-5 mt-1">
                        <li>Purchase high-quality gold jewelry at wholesale rates</li>
                        <li>Hold during price appreciation periods</li>
                        <li>Sell when market conditions are favorable</li>
                      </ul>
                    </li>
                    <li><strong>Revenue Sources:</strong>
                      <ul className="list-circle pl-5 mt-1">
                        <li>Market price appreciation</li>
                        <li>Wholesale to retail markup</li>
                        <li>Craftsmanship premium</li>
                      </ul>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="investment-details">
                <AccordionTrigger className="text-green-600 font-medium">
                  Investment Structure
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li><strong>Minimum Investment:</strong> Rs. 5,000</li>
                    <li><strong>Investment Period:</strong> 6 months minimum</li>
                    <li><strong>Expected Returns:</strong> 25-35% annually</li>
                    <li><strong>Portfolio Composition:</strong>
                      <ul className="list-circle pl-5 mt-1">
                        <li>70% Gold Jewelry</li>
                        <li>20% Gold Coins</li>
                        <li>10% Cash Reserve</li>
                      </ul>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq">
                <AccordionTrigger className="text-green-600 font-medium">
                  Frequently Asked Questions
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Q: How is the gold stored securely?</h4>
                      <p>A: All gold is stored in bank vaults with comprehensive insurance coverage.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Q: What affects the returns?</h4>
                      <p>A: Returns depend on gold market prices, jewelry demand, and craftsmanship premiums.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Q: Can I get physical gold instead of cash returns?</h4>
                      <p>A: Yes, investors can opt to receive their returns in physical gold, subject to minimum quantities.</p>
                    </div>
                  </div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
