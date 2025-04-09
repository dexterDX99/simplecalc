import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GoldCalculator() {
  const [pricePerTola, setPricePerTola] = useState<string>(localStorage.getItem('goldPrice24K') || "");
  const [buyingPrice, setBuyingPrice] = useState<string>("");

  useEffect(() => {
    const handleStorageChange = () => {
      setPricePerTola(localStorage.getItem('goldPrice24K') || "");
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [weightGram, setWeightGram] = useState<string>("");
  const [weightTola, setWeightTola] = useState<string>("");
  const [purity, setPurity] = useState<string>("22");
  const [wastage, setWastage] = useState<string>("");
  const [makingCut, setMakingCut] = useState<string>("");
  const [calculationResult, setCalculationResult] = useState<any>(null);

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
    if (!pricePerTola || (!weightGram && !weightTola) || !purity || !wastage || !makingCut) {
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
      buyingPrice: parseFloat(buyingPrice)
    });
  };

  return (
    <div className="mt-2">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center">24K Gold Price per Tola (Rs.)<span className="text-red-500 ml-1">*</span></label>
          <div className="relative">
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600 font-medium">Rs.</span>
            <Input 
              type="number" 
              placeholder="Enter current gold price" 
              className="pl-12 w-full border border-green-100 bg-gray-50 cursor-not-allowed"
              value={pricePerTola}
              disabled
              readOnly
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center">Your Buying Price (Rs.)<span className="text-red-500 ml-1">*</span></label>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600 font-medium">Rs.</span>
            <Input 
              type="number" 
              placeholder="Enter your buying price" 
              className="pl-12 w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
              value={buyingPrice}
              onChange={(e) => setBuyingPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center">Gold Weight (Tola)<span className="text-red-500 ml-1">*</span></label>
            <Input 
              type="number" 
              placeholder="Enter tola weight" 
              className="w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
              value={weightTola}
              onChange={(e) => {
                setWeightTola(e.target.value);
                convertTolaToGram(e.target.value);
              }}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center">Gold Weight (Grams)<span className="text-red-500 ml-1">*</span></label>
            <Input 
              type="number" 
              placeholder="Enter gram weight" 
              className="w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
              value={weightGram}
              onChange={(e) => {
                setWeightGram(e.target.value);
                convertGramToTola(e.target.value);
              }}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center">Gold Purity<span className="text-red-500 ml-1">*</span></label>
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
            <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center">Wastage (Grams)<span className="text-red-500 ml-1">*</span></label>
            <Input 
              type="number" 
              placeholder="Enter wastage" 
              className="w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
              value={wastage}
              onChange={(e) => setWastage(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center">Making Charges (%)<span className="text-red-500 ml-1">*</span></label>
            <Input 
              type="number" 
              placeholder="Enter making charges" 
              className="w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
              value={makingCut}
              onChange={(e) => setMakingCut(e.target.value)}
              required
            />
          </div>
        </div>

        <Button 
          onClick={calculatePrice} 
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          disabled={!pricePerTola || (!weightGram && !weightTola) || !purity || !wastage || !makingCut || !buyingPrice}
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
                  <p className="text-xs text-gray-500">Your Buying Price</p>
                  <p className="text-sm font-semibold">Rs. {calculationResult.buyingPrice?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || 'N/A'}</p>
                </div>
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
                    <p className="text-xs text-gray-500">Wastage Value (Deducted by your Jeweler)</p>
                    <p className="text-sm font-semibold">
                      {calculationResult.wastageFloat.toLocaleString(undefined, { maximumFractionDigits: 2 })} grams (Rs. {calculationResult.wastageValue.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                    </p>
                  </div>
                )}

                {calculationResult.makingChargesDeduction > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Making Charges (Deducted by Halal Tajir)</p>
                    <p className="text-sm font-semibold">
                      {calculationResult.makingChargesDeduction}% (Rs. {calculationResult.makingChargesAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                    </p>
                  </div>
                )}

                <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Final Price After Deductions</p>
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold text-primary-600">
                      Rs. {calculationResult.finalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <div>
                      <Button 
                        onClick={() => {
                          window.location.href = `/calculator?tab=investment&amount=${calculationResult.finalPrice}`;
                        }}
                        size="sm"
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all"
                      >
                        Calculate Investment
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">Calculate estimated returns and explore investment opportunities based on current gold value</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}