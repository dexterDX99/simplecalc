import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MIN_PROFIT_RATE, MAX_PROFIT_RATE, INVESTOR_SHARE } from "@/shared/constants";
// @ts-ignore - Import types directly from shared schema
import type { Pool } from '../../shared/schema';

export default function GoldCalculator() {
  const [pricePerTola, setPricePerTola] = useState<string>("");
  const [weightInTola, setWeightInTola] = useState<string>("");
  const [purity, setPurity] = useState<string>("22");
  const [selectedPoolId, setSelectedPoolId] = useState<string>("");

  const { data: pools = [] } = useQuery<Pool[]>({
    queryKey: ['/api/pools'],
  });

  const [calculationResult, setCalculationResult] = useState<any>(null);

  const handleCalculate = () => {
    const pricePerTolaFloat = parseFloat(pricePerTola);
    const weightInTolaFloat = parseFloat(weightInTola);
    const purityFloat = parseFloat(purity);
    const weightInGrams = weightInTolaFloat * 11.664;

    const selectedPool = pools.find(pool => pool.id === Number(selectedPoolId));

    if (!isNaN(pricePerTolaFloat) && !isNaN(weightInTolaFloat) && !isNaN(purityFloat)) {
      const goldValue = pricePerTolaFloat * weightInTolaFloat * (purityFloat / 24);
      const deductedValue = goldValue * 0.9; // 10% deduction for processing

      let projectedProfit = 0;
      let duration = "3 months";

      if (selectedPool) {
        projectedProfit = deductedValue * MIN_PROFIT_RATE * INVESTOR_SHARE;
        duration = selectedPool.duration;
      }

      setCalculationResult({
        pricePerTolaFloat,
        weightInTolaFloat,
        weightInGrams,
        purityFloat,
        goldValue,
        deductedValue,
        projectedProfit,
        finalValue: deductedValue + projectedProfit,
        duration
      });
    }
  };

  return (
    <div className="mt-2">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Gold Price per Tola (Rs.)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600 font-medium">Rs.</span>
            <Input
              type="number"
              className="pl-12"
              value={pricePerTola}
              onChange={(e) => setPricePerTola(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Gold Weight (Tola)</label>
          <Input
            type="number"
            value={weightInTola}
            onChange={(e) => setWeightInTola(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Gold Purity (Karat)</label>
          <Select value={purity} onValueChange={setPurity}>
            <SelectTrigger>
              <SelectValue placeholder="Select purity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24K (Pure Gold)</SelectItem>
              <SelectItem value="22">22K</SelectItem>
              <SelectItem value="21">21K</SelectItem>
              <SelectItem value="18">18K</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Investment Pool</label>
          <Select value={selectedPoolId} onValueChange={setSelectedPoolId}>
            <SelectTrigger>
              <SelectValue placeholder="Select investment pool" />
            </SelectTrigger>
            <SelectContent>
              {pools.map((pool) => (
                <SelectItem key={pool.id} value={String(pool.id)}>
                  {pool.name} ({pool.duration})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleCalculate} className="w-full bg-gradient-to-r from-emerald-500 to-green-600">
          Calculate Investment Value
        </Button>

        {calculationResult && (
          <Card className="mt-4 border border-green-100 shadow-md rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-3 px-4">
              <h3 className="text-white font-medium">Gold Investment Summary</h3>
            </div>
            <CardContent className="py-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-gray-500">Market Gold Price (Pure 24K Reference)</p>
                  <p className="text-sm font-semibold">Rs. {calculationResult.pricePerTolaFloat.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Selected Jewelry Purity</p>
                  <p className="text-sm font-semibold">{calculationResult.purityFloat}K Gold</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-sm font-semibold">
                    {calculationResult.weightInTolaFloat} tola ({calculationResult.weightInGrams.toFixed(2)} grams)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Gold Value</p>
                  <p className="text-sm font-semibold">Rs. {calculationResult.goldValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Value After Processing Fee (90%)</p>
                  <p className="text-sm font-semibold">Rs. {calculationResult.deductedValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expected Profit ({calculationResult.duration})</p>
                  <p className="text-sm font-semibold text-green-600">
                    Rs. {calculationResult.projectedProfit.toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Total Return After {calculationResult.duration}</p>
                  <p className="text-base font-semibold text-primary-600">
                    Rs. {calculationResult.finalValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}