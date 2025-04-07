import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GoldCalculator() {
  const [pricePerTola, setPricePerTola] = useState<string>("");
  const [weightGram, setWeightGram] = useState<string>("");
  const [weightTola, setWeightTola] = useState<string>("");
  const [purity, setPurity] = useState<string>("22");
  const [wastage, setWastage] = useState<string>("");
  const [makingCut, setMakingCut] = useState<string>("");
  const [calculationResult, setCalculationResult] = useState<any>(null);
const [selectedPoolId, setSelectedPoolId] = useState<string>("");
const { data: pools = [] } = useQuery<Pool[]>({
  queryKey: ['/api/pools'],
});

  const convertGramToTola = (value: string) => {
    if (!value) {
      setWeightTola("");
      return;
    }
    const tolaValue = (parseFloat(value) / 11.664).toFixed(3);
    setWeightTola(tolaValue);
  };

  const convertTolaToGram = (value: string) => {
    if (!value) {
      setWeightGram("");
      return;
    }
    const gramValue = (parseFloat(value) * 11.664).toFixed(2);
    setWeightGram(gramValue);
  };

  const calculatePrice = () => {
    if (!pricePerTola || (!weightGram && !weightTola) || !purity) {
      return;
    }

    const pricePerTolaFloat = parseFloat(pricePerTola);
    const weightGramFloat = parseFloat(weightGram);
    const purityFloat = parseFloat(purity);
    const wastageFloat = parseFloat(wastage) || 0;
    const makingChargesDeduction = parseFloat(makingCut) || 0;

    const pricePerGram = (pricePerTolaFloat / 11.664) * (purityFloat / 24);
    const totalGoldValue = weightGramFloat * pricePerGram;
    const makingChargesAmount = (totalGoldValue * makingChargesDeduction) / 100;
    const finalPrice = totalGoldValue - makingChargesAmount;
    const wastageValue = wastageFloat * pricePerGram;

    const selectedPool = pools.find(pool => pool.id === Number(selectedPoolId));
    const poolProfit = selectedPool ? {
      minProfit: finalPrice * parseFloat(selectedPool.minProfitRate),
      maxProfit: finalPrice * parseFloat(selectedPool.maxProfitRate),
      minPayout: finalPrice * (1 + parseFloat(selectedPool.minProfitRate)),
      maxPayout: finalPrice * (1 + parseFloat(selectedPool.maxProfitRate))
    } : null;

    setCalculationResult({
      pricePerTolaFloat,
      purityFloat,
      pricePerGram,
      weightGramFloat,
      wastageFloat,
      makingChargesDeduction,
      totalGoldValue,
      makingChargesAmount,
      finalPrice,
      wastageValue,
      poolProfit
    });
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
              placeholder="Enter current gold price" 
              className="pl-12 w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
              value={pricePerTola}
              onChange={(e) => setPricePerTola(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Gold Weight (Tola)</label>
            <Input 
              type="number" 
              placeholder="Enter tola weight" 
              className="w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
              value={weightTola}
              onChange={(e) => {
                setWeightTola(e.target.value);
                convertTolaToGram(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Gold Weight (Grams)</label>
            <Input 
              type="number" 
              placeholder="Enter gram weight" 
              className="w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
              value={weightGram}
              onChange={(e) => {
                setWeightGram(e.target.value);
                convertGramToTola(e.target.value);
              }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Gold Purity</label>
          <Select value={purity} onValueChange={setPurity}>
            <SelectTrigger className="w-full border border-green-100 focus:ring-green-200 transition-all rounded-md">
              <SelectValue placeholder="Select purity" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-green-100 shadow-md rounded-md">
              <SelectItem className="hover:bg-green-50 cursor-pointer transition-colors" value="22">22K <span className="ml-2 text-amber-600 text-xs">(Standard)</span></SelectItem>
              <SelectItem className="hover:bg-green-50 cursor-pointer transition-colors" value="21">21K</SelectItem>
              <SelectItem className="hover:bg-green-50 cursor-pointer transition-colors" value="20">20K</SelectItem>
              <SelectItem className="hover:bg-green-50 cursor-pointer transition-colors" value="18">18K</SelectItem>
              <SelectItem className="hover:bg-green-50 cursor-pointer transition-colors" value="14">14K</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">Note: Jewelry cannot be made from pure 24K gold as it's too soft. Gold jewelry typically uses 22K or lower purity mixed with other metals for durability.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Wastage (Grams)</label>
            <Input 
              type="number" 
              placeholder="Enter wastage" 
              className="w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
              value={wastage}
              onChange={(e) => setWastage(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Making Charges (%)</label>
            <Input 
              type="number" 
              placeholder="Enter making charges" 
              className="w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
              value={makingCut}
              onChange={(e) => setMakingCut(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={calculatePrice} 
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          disabled={!pricePerTola || (!weightGram && !weightTola) || !purity}
        >
          Generate Estimate
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
                  <p className="text-sm font-semibold">Rs. {calculationResult.pricePerTolaFloat.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Selected Jewelry Purity</p>
                  <p className="text-sm font-semibold">{calculationResult.purityFloat}K Gold</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gold Price Per Tola ({calculationResult.purityFloat}K)</p>
                  <p className="text-sm font-semibold">
                    Rs. {(calculationResult.pricePerTolaFloat * (calculationResult.purityFloat / 24)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gold Price Per Gram ({calculationResult.purityFloat}K)</p>
                  <p className="text-sm font-semibold">
                    Rs. {calculationResult.pricePerGram.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Gold Weight</p>
                  <p className="text-sm font-semibold">
                    {calculationResult.weightGramFloat.toLocaleString(undefined, { maximumFractionDigits: 2 })} grams ({(calculationResult.weightGramFloat / 11.664).toLocaleString(undefined, { maximumFractionDigits: 3 })} tola)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Gold Value</p>
                  <p className="text-sm font-semibold text-green-600">
                    Rs. {calculationResult.totalGoldValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>

                {calculationResult.wastageFloat > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Wastage Value</p>
                    <p className="text-sm font-semibold">
                      {calculationResult.wastageFloat.toLocaleString(undefined, { maximumFractionDigits: 2 })} grams (Rs. {calculationResult.wastageValue.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                    </p>
                  </div>
                )}

                {calculationResult.makingChargesDeduction > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Making Charges Deduction</p>
                    <p className="text-sm font-semibold">
                      {calculationResult.makingChargesDeduction}% (Rs. {calculationResult.makingChargesAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                    </p>
                  </div>
                )}

                <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Final Price After Deductions</p>
                  <p className="text-base font-semibold text-primary-600">
                    Rs. {calculationResult.finalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {pools.length > 0 && (
                <>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Investment Pool Selection</label>
                    <Select value={selectedPoolId} onValueChange={setSelectedPoolId}>
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

                  {calculationResult.poolProfit && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Expected Returns (3 Months)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Initial Investment</p>
                          <p className="text-sm font-semibold">Rs. {calculationResult.finalPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Potential Profit Range</p>
                          <p className="text-sm font-semibold">
                            Rs. {calculationResult.poolProfit.minProfit.toLocaleString()} - {calculationResult.poolProfit.maxProfit.toLocaleString()}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Total Payout Range (Capital + Profit)</p>
                          <p className="text-sm font-semibold text-green-600">
                            Rs. {calculationResult.poolProfit.minPayout.toLocaleString()} - {calculationResult.poolProfit.maxPayout.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}