
import React from 'react';
import { useQuery } from '@tanstack/react-query';
// @ts-ignore - Import types directly from shared schema
import type { Pool, Investment } from '../../shared/schema';

interface StatsOverviewProps {
  poolCount: number;
  availableSlots: number;
}

export default function StatsOverview({ poolCount, availableSlots }: StatsOverviewProps) {
  const { data: pools = [] } = useQuery<Pool[]>({
    queryKey: ['/api/pools'],
  });

  const { data: userInvestments = [] } = useQuery<Investment[]>({
    queryKey: ['/api/users/1/investments'],
  });

  // Calculate total invested across all pools
  const totalInvested = pools.reduce((acc, pool) => acc + Number(pool.total), 0);
  
  // Calculate total value (including expected minimum profit)
  const minProfitRate = 0.3; // 30% minimum profit
  const investorShare = 0.6; // 60% investor share
  const totalValue = totalInvested + (totalInvested * minProfitRate * investorShare);

  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-700 mb-1">Total Invested Value</p>
        <p className="text-lg font-bold text-blue-800">Rs. {totalInvested.toLocaleString()}</p>
        <p className="text-xs text-blue-600">Across {poolCount} Investment Pools</p>
      </div>
      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
        <p className="text-xs text-green-700 mb-1">Investment Pool Status</p>
        <p className="text-lg font-bold text-green-800">{pools.length} Active</p>
        <p className="text-xs text-green-600">
          {pools.filter(p => Number(p.total) >= Number(p.target)).length} Fully Funded
        </p>
      </div>
    </div>
  );
}
