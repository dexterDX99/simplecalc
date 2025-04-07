
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GoldCalculator } from "@/components/GoldCalculator";

export default function GoldDeposits() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gold Deposits</h1>
      <Card>
        <CardContent className="p-6">
          <GoldCalculator />
        </CardContent>
      </Card>
    </div>
  );
}
