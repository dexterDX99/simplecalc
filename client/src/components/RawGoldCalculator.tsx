import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RawGoldCalculator() {
  const [pricePerTola, setPricePerTola] = useState<string>(localStorage.getItem('goldPrice24K') || "");

  useEffect(() => {
    const handleStorageChange = () => {
      setPricePerTola(localStorage.getItem('goldPrice24K') || "");
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [weightGram, setWeightGram] = useState<string>("");
  const [weightTola, setWeightTola] = useState<string>("");
  const [purity, setPurity] = useState<string>("24");
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
    if (!pricePerTola || (!weightGram && !weightTola) || !purity) {
      return;
    }

    const pricePerTolaFloat = parseFloat(pricePerTola);
    const weightGramFloat = parseFloat(weightGram);
    const purityFloat = parseFloat(purity);

    // For raw gold, we calculate based on weight and purity without deductions
    const pricePerGram = (pricePerTolaFloat / 11.664) * (purityFloat / 24);
    const totalGoldValue = weightGramFloat * pricePerGram;

    setCalculationResult({
      pricePerTolaFloat,
      purityFloat,
      pricePerGram,
      weightGramFloat,
      totalGoldValue
    });
  };

  return (
    <div className="mt-2">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">24K Gold Price per Tola (Rs.)</label>
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
              className="pl-12 w-[300px] border border-green-100 font-semibold text-red-600"
              value={pricePerTola}
              disabled
              readOnly
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
          <div className="border border-green-100 rounded-md p-3 bg-gray-50">
            <p className="font-medium text-sm">24K <span className="text-amber-600 text-xs">(Pure Gold)</span></p>
          </div>
        </div>

        <Button 
          onClick={calculatePrice} 
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          disabled={!pricePerTola || (!weightGram && !weightTola) || !purity}
        >
          Calculate Raw Gold Value
        </Button>

        {calculationResult && (
          <Card className="mt-4 border border-green-100 shadow-md rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-3 px-4">
              <h3 className="text-white font-medium">Raw Gold Valuation</h3>
            </div>
            <CardContent className="py-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-gray-500">Market Gold Price (24K)</p>
                  <p className="text-sm font-semibold">Rs. {calculationResult.pricePerTolaFloat.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Selected Gold Purity</p>
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
                    {calculationResult.weightGramFloat.toLocaleString(undefined, { maximumFractionDigits: 2 })} grams 
                    ({(calculationResult.weightGramFloat / 11.664).toLocaleString(undefined, { maximumFractionDigits: 3 })} tola)
                  </p>
                </div>
                <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Total Raw Gold Value</p>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-primary-600">
                      Rs. {calculationResult.totalGoldValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <div>
                      <Button 
                        onClick={() => {
                          window.location.href = `/calculator?tab=investment&amount=${calculationResult.totalGoldValue}`;
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
              <div className="mt-3 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Note: This calculation represents the value of raw gold without any making charges or deductions.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}