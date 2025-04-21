import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GoldCalculator() {
  const [pricePerTola, setPricePerTola] = useState<string>(localStorage.getItem('goldPrice24K') || "");
  const [buyingPrice, setBuyingPrice] = useState<string>("");
  const [buyingPricePerTola, setBuyingPricePerTola] = useState<string>("");
  const [isPricePerTola, setIsPricePerTola] = useState<boolean>(false);
  const [isWeightInGrams, setIsWeightInGrams] = useState<boolean>(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setPricePerTola(localStorage.getItem('goldPrice24K') || "");
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [weightGram, setWeightGram] = useState<string>("");
  const [weightTola, setWeightTola] = useState<string>("");
  const [purity, setPurity] = useState<string>("");
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
    if (!pricePerTola || (!weightGram && !weightTola) || !purity || !wastage || !buyingPrice || !buyingPricePerTola) {
      console.log("Missing required fields:", { pricePerTola, weightGram, weightTola, purity, wastage, buyingPrice, buyingPricePerTola });
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
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block flex items-center">Today's 24K Gold Price per Tola (Rs.)<span className="text-red-500 ml-1">*</span></label>
          <div className="relative">
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600 font-medium">Rs.</span>
            <Input 
              type="number" 
              placeholder="Enter current gold price" 
              className="pl-12 w-[300px] border border-green-100 font-semibold text-red-600"
              value={pricePerTola}
              disabled
              readOnly
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="weightType"
                value="tola"
                checked={!isWeightInGrams}
                onChange={() => setIsWeightInGrams(false)}
                className="mr-2 text-emerald-600 focus:ring-emerald-600"
              />
              Weight in Tola
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="weightType"
                value="grams"
                checked={isWeightInGrams}
                onChange={() => setIsWeightInGrams(true)}
                className="mr-2 text-emerald-600 focus:ring-emerald-600"
              />
              Weight in Grams
            </label>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center">
              {isWeightInGrams ? (
                <>
                  Gold Weight (Grams)
                  {weightGram && (
                    <span className="ml-2 text-gray-500 text-xs">(In Tola: {weightTola})</span>
                  )}
                </>
              ) : (
                <>
                  Gold Weight (Tola)
                  {weightTola && (
                    <span className="ml-2 text-gray-500 text-xs">(In Grams: {weightGram})</span>
                  )}
                </>
              )}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input 
              type="number" 
              placeholder={isWeightInGrams ? "Enter weight in grams" : "Enter weight in tola"}
              className="w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
              value={isWeightInGrams ? weightGram : weightTola}
              onChange={(e) => {
                if (isWeightInGrams) {
                  setWeightGram(e.target.value);
                  const newTolaWeight = (parseFloat(e.target.value) / 11.664).toFixed(3);
                  setWeightTola(newTolaWeight);
                  if (isPricePerTola && buyingPricePerTola) {
                    setBuyingPrice((parseFloat(buyingPricePerTola) * parseFloat(newTolaWeight)).toFixed(2));
                  } else if (!isPricePerTola && buyingPrice) {
                    setBuyingPricePerTola((parseFloat(buyingPrice) / parseFloat(newTolaWeight)).toFixed(2));
                  }
                } else {
                  setWeightTola(e.target.value);
                  const newGramWeight = (parseFloat(e.target.value) * 11.664).toFixed(2);
                  setWeightGram(newGramWeight);
                  if (isPricePerTola && buyingPricePerTola) {
                    setBuyingPrice((parseFloat(buyingPricePerTola) * parseFloat(e.target.value)).toFixed(2));
                  } else if (!isPricePerTola && buyingPrice) {
                    setBuyingPricePerTola((parseFloat(buyingPrice) / parseFloat(e.target.value)).toFixed(2));
                  }
                }
              }}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="priceType"
                value="total"
                checked={!isPricePerTola}
                onChange={() => setIsPricePerTola(false)}
                className="mr-2"
              />
              Total Price
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="priceType"
                value="perTola"
                checked={isPricePerTola}
                onChange={() => setIsPricePerTola(true)}
                className="mr-2"
              />
              Price Per Tola
            </label>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center">
              {isPricePerTola ? (
                <>
                  Your Buying Price Per Tola (Rs.)
                  {buyingPrice && weightTola && (
                    <span className="ml-2 text-gray-500 text-xs">(Total: Rs. {buyingPrice})</span>
                  )}
                </>
              ) : (
                <>
                  Your Total Buying Price (Rs.)
                  {buyingPricePerTola && (
                    <span className="ml-2 text-gray-500 text-xs">(Per Tola: Rs. {buyingPricePerTola})</span>
                  )}
                </>
              )}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600 font-medium">Rs.</span>
              <Input 
                type="number" 
                placeholder={isPricePerTola ? "Enter price per tola" : "Enter total buying price"}
                className="pl-12 w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
                value={isPricePerTola ? buyingPricePerTola : buyingPrice}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (isPricePerTola) {
                    setBuyingPricePerTola(newValue);
                    if (weightTola && newValue) {
                      const totalPrice = (parseFloat(newValue) * parseFloat(weightTola)).toFixed(2);
                      setBuyingPrice(totalPrice);
                    } else if (newValue && !weightTola && weightGram) {
                      const tolaWeight = (parseFloat(weightGram) / 11.664).toFixed(3);
                      const totalPrice = (parseFloat(newValue) * parseFloat(tolaWeight)).toFixed(2);
                      setBuyingPrice(totalPrice);
                    }
                  } else {
                    setBuyingPrice(newValue);
                    if (weightTola && newValue) {
                      const perTolaPrice = (parseFloat(newValue) / parseFloat(weightTola)).toFixed(2);
                      setBuyingPricePerTola(perTolaPrice);
                    } else if (newValue && !weightTola && weightGram) {
                      const tolaWeight = (parseFloat(weightGram) / 11.664).toFixed(3);
                      const perTolaPrice = (parseFloat(newValue) / parseFloat(tolaWeight)).toFixed(2);
                      setBuyingPricePerTola(perTolaPrice);
                    }
                  }
                }}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center">Gold Purity<span className="text-red-500 ml-1">*</span></label>
          <Select value={purity} onValueChange={setPurity} required>
            <SelectTrigger className="w-full border border-green-100 focus:ring-green-200 transition-all rounded-md">
              <SelectValue placeholder="Please select gold purity" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-green-100 shadow-md rounded-md">
              <SelectItem className="hover:bg-green-50 cursor-pointer transition-colors" value="22">22K <span className="ml-2 text-amber-600 text-xs">(Purity: 91.67% gold)</span></SelectItem>
              <SelectItem className="hover:bg-green-50 cursor-pointer transition-colors" value="21">21K <span className="ml-2 text-amber-600 text-xs">(Purity: 87.5% gold)</span></SelectItem>
              <SelectItem className="hover:bg-green-50 cursor-pointer transition-colors" value="20">20K <span className="ml-2 text-amber-600 text-xs">(Purity: 83.33% gold)</span></SelectItem>
              <SelectItem className="hover:bg-green-50 cursor-pointer transition-colors" value="18">18K <span className="ml-2 text-amber-600 text-xs">(Purity: 75% gold)</span></SelectItem>
              <SelectItem className="hover:bg-green-50 cursor-pointer transition-colors" value="14">14K <span className="ml-2 text-amber-600 text-xs">(Purity: 58.33% gold)</span></SelectItem>
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
          
        </div>

        <Button 
          onClick={calculatePrice} 
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          disabled={!pricePerTola || (!weightGram && !weightTola) || !purity || !wastage || !buyingPrice || !buyingPricePerTola}
        >
          Generate Estimate
        </Button>

        {calculationResult && (
          <Card className="mt-3 sm:mt-4 border border-green-100 shadow-md rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-2 sm:py-3 px-3 sm:px-4">
              <h3 className="text-white text-sm sm:text-base font-medium">Your Jewelry's Current Valuation</h3>
            </div>
            <CardContent className="py-4 sm:py-6 px-2 sm:px-4">
              <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-2">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Your Total Buying Price</p>
                  <p className="text-xs sm:text-sm font-semibold">Rs. {calculationResult.buyingPrice?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Your Buying Price Per Tola</p>
                  <p className="text-xs sm:text-sm font-semibold">Rs. {((calculationResult.buyingPrice || 0) / (calculationResult.weightGramFloat / 11.664)).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
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
                  <p className="text-xs text-gray-500">Your Total Jewelry Weight</p>
                  <p className="text-sm font-semibold">
                    {calculationResult.weightGramFloat.toLocaleString(undefined, { maximumFractionDigits: 2 })} grams ({(calculationResult.weightGramFloat / 11.664).toLocaleString(undefined, { maximumFractionDigits: 3 })} tola)
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

                <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 pt-2 border-t border-gray-100">
                  {/* Weight Loss Analysis */}
                  <div>
                    <p className="text-[10px] sm:text-xs font-medium text-amber-600 mb-1">Weight Loss Analysis</p>
                    <div className="space-y-1 sm:space-y-2">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Loss Due to Purity (24K to {calculationResult.purityFloat}K)</p>
                        <p className="text-[11px] sm:text-sm font-semibold text-amber-600">
                          {(calculationResult.weightGramFloat * (24 - calculationResult.purityFloat) / 24).toFixed(3)} grams
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Loss Due to Wastage</p>
                        <p className="text-[11px] sm:text-sm font-semibold text-amber-600">
                          {calculationResult.wastageFloat.toFixed(3)} grams
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Total Weight Loss</p>
                        <p className="text-[11px] sm:text-sm font-semibold text-amber-600">
                          {(calculationResult.wastageFloat + (calculationResult.weightGramFloat * (24 - calculationResult.purityFloat) / 24)).toFixed(3)} grams ({((calculationResult.wastageFloat + (calculationResult.weightGramFloat * (24 - calculationResult.purityFloat) / 24)) / calculationResult.weightGramFloat * 100).toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Value Loss Analysis */}
                  <div>
                    <p className="text-[10px] sm:text-xs font-medium text-red-500 mb-1">Value Loss Analysis</p>
                    <div className="space-y-1 sm:space-y-2">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Loss Due to Lower Purity</p>
                        <p className="text-[11px] sm:text-sm font-semibold text-red-600">
                          Rs. {(calculationResult.pricePerTolaFloat * (calculationResult.weightGramFloat / 11.664) - ((calculationResult.pricePerTolaFloat * calculationResult.purityFloat / 24) * (calculationResult.weightGramFloat / 11.664))).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Loss Due to Wastage</p>
                        <p className="text-[11px] sm:text-sm font-semibold text-red-600">
                          Rs. {calculationResult.wastageValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Net Value Loss</p>
                        <p className="text-[11px] sm:text-sm font-semibold text-red-600">
                          Rs. {(
                            ((calculationResult.pricePerTolaFloat * (calculationResult.weightGramFloat / 11.664)) * ((24 - calculationResult.purityFloat) / 24)) +
                            calculationResult.wastageValue
                          ).toLocaleString(undefined, { maximumFractionDigits: 2 })} ({(
                            (((calculationResult.pricePerTolaFloat * (calculationResult.weightGramFloat / 11.664)) * ((24 - calculationResult.purityFloat) / 24)) +
                            calculationResult.wastageValue) / (calculationResult.pricePerTolaFloat * (calculationResult.weightGramFloat / 11.664)) * 100
                          ).toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Value Profit Analysis */}
                  <div>
                    <p className="text-xs font-medium text-green-500 mb-2">Value Profit Analysis</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Market Value Savings</p>
                        <p className="text-sm font-semibold text-green-600">
                          Rs. {Math.max(0, ((calculationResult.pricePerTolaFloat * calculationResult.purityFloat / 24) * (calculationResult.weightGramFloat / 11.664)) - calculationResult.buyingPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })} ({(Math.max(0, ((calculationResult.pricePerTolaFloat * calculationResult.purityFloat / 24) * (calculationResult.weightGramFloat / 11.664)) - calculationResult.buyingPrice) / calculationResult.buyingPrice * 100).toFixed(2)}%)
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Net Profit</p>
                        <p className="text-sm font-semibold text-green-600">
                          Rs. {Math.max(0, ((calculationResult.pricePerTolaFloat * calculationResult.purityFloat / 24) * (calculationResult.weightGramFloat / 11.664)) - calculationResult.buyingPrice - calculationResult.wastageValue).toLocaleString(undefined, { maximumFractionDigits: 2 })} ({(Math.max(0, ((calculationResult.pricePerTolaFloat * calculationResult.purityFloat / 24) * (calculationResult.weightGramFloat / 11.664)) - calculationResult.buyingPrice - calculationResult.wastageValue) / calculationResult.buyingPrice * 100).toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Combined Analysis Summary */}
                <div className="col-span-2 mt-4 pt-4 border-t border-gray-100">
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Total Weight Analysis</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Total Weight Loss</p>
                        <p className="text-sm font-semibold text-amber-600">
                          {(calculationResult.wastageFloat + (calculationResult.weightGramFloat * (24 - calculationResult.purityFloat) / 24)).toFixed(3)} grams ({((calculationResult.wastageFloat + (calculationResult.weightGramFloat * (24 - calculationResult.purityFloat) / 24)) / 11.664).toFixed(3)} tola)
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Including purity reduction and wastage
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Remaining Pure 24K Weight</p>
                        <p className="text-sm font-semibold text-emerald-600">
                          {(calculationResult.weightGramFloat * (calculationResult.purityFloat / 24) - calculationResult.wastageFloat).toFixed(3)} grams ({((calculationResult.weightGramFloat * (calculationResult.purityFloat / 24) - calculationResult.wastageFloat) / 11.664).toFixed(3)} tola)
                        </p>
                        <p className="text-[10px] text-gray-500">
                          After all deductions
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-gray-700 mb-2">Total Value Analysis</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Original Buying Price</p>
                      <p className="text-sm font-semibold text-gray-700">
                        Rs. {calculationResult.buyingPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Your Pure 24K Gold Value</p>
                      <p className="text-sm font-semibold text-primary-600">
                        Rs. {(calculationResult.totalGoldValue - calculationResult.wastageValue).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Net Profit/Loss</p>
                      <p className={`text-sm font-semibold ${(calculationResult.totalGoldValue - calculationResult.buyingPrice - calculationResult.wastageValue) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Rs. {Math.abs(calculationResult.totalGoldValue - calculationResult.buyingPrice - calculationResult.wastageValue).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        {(calculationResult.totalGoldValue - calculationResult.buyingPrice - calculationResult.wastageValue) >= 0 ? ' (Profit' : ' (Loss'} - {((Math.abs(calculationResult.totalGoldValue - calculationResult.buyingPrice - calculationResult.wastageValue) / calculationResult.buyingPrice) * 100).toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </div>

                {calculationResult.makingChargesDeduction > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Total Loss Percentage</p>
                    <p className="text-sm font-semibold">
                      {calculationResult.makingChargesDeduction}% (Rs. {calculationResult.makingChargesAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Based on typical market loss rate</p>
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Final Price After Deductions</p>
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold text-primary-600">
                      Rs. {((calculationResult.totalGoldValue - calculationResult.wastageValue) - calculationResult.makingChargesAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <div>
                      <Button 
                        onClick={() => {
                          const finalValue = (calculationResult.totalGoldValue - calculationResult.wastageValue) - calculationResult.makingChargesAmount;
                          window.location.href = `/calculator?tab=investment&amount=${finalValue}`;
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