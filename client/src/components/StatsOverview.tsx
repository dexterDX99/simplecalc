import React from 'react';

interface StatsOverviewProps {
  poolCount: number;
  availableSlots: number;
}

export default function StatsOverview({ poolCount, availableSlots }: StatsOverviewProps) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-700 mb-1">Active Investments</p>
        <p className="text-lg font-bold text-blue-800">{poolCount} Pools</p>
      </div>
      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
        <p className="text-xs text-green-700 mb-1">Available Slots</p>
        <p className="text-lg font-bold text-green-800">{availableSlots} Slots</p>
      </div>
    </div>
  );
}
