import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InvestmentCalculator from "../components/InvestmentCalculator";

export default function Calculator() {
  // Default to showing the Halal Investment Calculator without dropdown functionality
  const [activeTab, setActiveTab] = useState("investment");

  useEffect(() => {
    // Set investment calculator as default when component mounts
    setActiveTab("investment");
  }, []);

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Investment Calculators</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="investment"
            className="flex-1 rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all"
          >
            Cash Investment
          </TabsTrigger>
          <TabsTrigger
            value="gold"
            className="flex-1 rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all"
          >
            Gold Investment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="investment">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Cash Investment Calculator</h3>
            <InvestmentCalculator />
          </div>
        </TabsContent>
        
        <TabsContent value="gold">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Jewelry Investment Calculator</h3>
            <GoldCalculator />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Raw Gold Calculator</h3>
            <RawGoldCalculator />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}