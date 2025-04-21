import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
// @ts-ignore - Import types directly from shared schema
import type { Pool } from '../../shared/schema';
import { MIN_PROFIT_RATE, MAX_PROFIT_RATE, INVESTOR_SHARE } from "@/shared/constants";

export default function InvestmentCalculator() { // Cash Investment Calculator
  const [investmentAmount, setInvestmentAmount] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('amount') || "";
  });
  const [selectedPoolId, setSelectedPoolId] = useState<string>("");
  const [profit, setProfit] = useState<{min: number, max: number} | null>(null);

  const { data: pools = [] } = useQuery<Pool[]>({
    queryKey: ['/api/pools'],
  });

  const selectedPool = pools.find(pool => pool.id === Number(selectedPoolId));

  const calculateProfit = (amount: string, pool: Pool | undefined) => {
    if (!amount || Number(amount) <= 0) {
      setProfit(null);
      return;
    }
    if (!pool) return;

    // Calculate number of bulbs based on investment proportion
    const bulbsShare = Math.floor((Number(amount) / 1500000) * 12500);

    // Calculate profit using Rs. 110 profit per bulb
    const totalProfit = Math.floor((Number(amount) / 1500000) * 825000);

    setProfit({
      bulbsShare,
      profitPerBulb: 110,
      totalProfit,
      finalPayout: Number(amount) + totalProfit
    });
  };

  return (
    <div className="mt-2">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Investment Amount (Rs.)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600 font-medium">Rs.</span>
            <Input 
              type="number" 
              placeholder="Enter amount" 
              className="pl-12 w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
              value={investmentAmount}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setInvestmentAmount(value);
                calculateProfit(value, selectedPool);
              }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-xs text-gray-400">Min: Rs. 5,000</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Available Investment Pools</label>
          <Select value={selectedPoolId} onValueChange={(value) => {
            setSelectedPoolId(value);
            if (investmentAmount) calculateProfit(investmentAmount, pools.find(pool => pool.id === Number(value)));
          }}>
            <SelectTrigger className="w-full border border-green-100 focus:ring-green-200 transition-all rounded-md">
              <SelectValue placeholder="Select an investment pool" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-green-100 shadow-md rounded-md">
              {pools.map((pool) => (
                <SelectItem 
                  key={pool.id} 
                  value={String(pool.id)} 
                  className="hover:bg-green-50 cursor-pointer transition-colors"
                >
                  {pool.name}
                  {pool.slots > 0 && (
                    <span className="ml-2 text-green-600 text-xs">({pool.slots} slots available)</span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPool && (
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-green-800 mb-2">{selectedPool.name} - Mudarabah Investment</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-600">Expected Business Profit Range:</p>
                <p className="font-medium text-green-700">
                  {MIN_PROFIT_RATE * 100}%-{MAX_PROFIT_RATE * 100}% for 6 months (potential loss possible)
                </p>
              </div>
              <div>
                <p className="text-gray-600">Investment Model:</p>
                <p className="font-medium text-green-700">Mudarabah (profit-sharing)</p>
              </div>
              <div>
                <p className="text-gray-600">Start Date:</p>
                <p className="font-medium text-green-700">{selectedPool.startDate}</p>
              </div>
              <div>
                <p className="text-gray-600">End Date:</p>
                <p className="font-medium text-green-700">{selectedPool.endDate}</p>
              </div>
            </div>
          </div>
        )}



        {profit !== null && selectedPool && (
          <Card className="mt-4 border border-green-100 shadow-md rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-3 px-4">
              <h3 className="text-white font-medium">Investment Summary</h3>
            </div>
            <CardContent className="py-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-gray-500">Investment Amount</p>
                  <p className="text-sm font-semibold">Rs. {Number(investmentAmount).toLocaleString()} ({Math.floor(Number(investmentAmount) / 5000)} slots)</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Investment Pool</p>
                  <p className="text-sm font-semibold">{selectedPool.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Investment Duration</p>
                  <p className="text-sm font-semibold">6 months</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Profit Sharing Ratio</p>
                  <p className="text-sm font-semibold">
                    Investors {INVESTOR_SHARE * 100}% - Manager {(1 - INVESTOR_SHARE) * 100}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Business Type</p>
                  <p className="text-sm font-semibold">LED Bulb Manufacturing</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Number of Bulbs (Your Share)</p>
                  <p className="text-sm font-semibold">
                    {Math.floor((Number(investmentAmount) / 1500000) * 12500)} bulbs
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expected Profit Per Bulb</p>
                  <p className="text-sm font-semibold">Rs. 110</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expected Total Profit (60%)</p>
                  <p className="text-sm font-semibold text-green-600">
                    Rs. {Math.floor(Number(investmentAmount) * 0.6).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Management Fee (2% of Profit)</p>
                  <p className="text-sm font-semibold text-red-600">
                    Rs. {Math.floor(Number(investmentAmount) * 0.6 * 0.02).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Monthly Expected Profit (After Fee)</p>
                  <p className="text-sm font-semibold text-amber-600">
                    Rs. {Math.floor((Number(investmentAmount) * 0.6 * 0.98) / 6).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    *Monthly profit shown for calculation only. Profit payout occurs after completion of 6-month term
                  </p>
                </div>
                <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Total Payout After 6 Months (Capital + Profit)</p>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-primary-600">
                      Rs. {(Number(investmentAmount) + Math.floor(Number(investmentAmount) * 0.6 * 0.98)).toLocaleString()}
                    </p>

                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Note: This follows Mudarabah principles where investors provide capital while business 
                  managers handle operations. Under this Islamic finance model, investors share in both profits and losses.
                  While we target {MIN_PROFIT_RATE * 100}%-{MAX_PROFIT_RATE * 100}% returns, there is a possibility of capital loss. Your investment and any profit 
                  are returned at the end of the term ({selectedPool.endDate}).
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}