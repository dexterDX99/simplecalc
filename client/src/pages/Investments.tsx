
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import InvestmentPoolCard from '../components/InvestmentPoolCard';
import StatsOverview from '../components/StatsOverview';
import InvestmentDetails from '../components/InvestmentDetails';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// @ts-ignore - Import types directly from shared schema
import type { Pool, Investment } from '../../shared/schema';

export default function Investments() {
  const [expandedPoolId, setExpandedPoolId] = useState<number | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const poolId = params.get('poolId');
    return poolId ? Number(poolId) : null;
  });
  const [investment, setInvestment] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('investment') || '';
  });
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const { data: pools = [] } = useQuery<Pool[]>({
    queryKey: ['/api/pools'],
  });

  const { data: userInvestments = [] } = useQuery<Investment[]>({
    queryKey: ['/api/users/1/investments'],
  });

  const handleToggleExpand = (poolId: number) => {
    setExpandedPoolId(expandedPoolId === poolId ? null : poolId);
    setInvestment('');
    setWarningMessage('');
  };

  const handleInvestmentChange = (value: string) => {
    setInvestment(value);
    setWarningMessage('');
  };

  const handleInvest = async (pool: Pool) => {
    if (!investment || Number(investment) <= 0) {
      setWarningMessage('Please enter a valid investment amount');
      return;
    }

    const amount = Number(investment);
    if (amount < 5000) {
      setWarningMessage('Minimum investment amount is Rs. 5,000');
      return;
    }

    if (amount % 5000 !== 0 || amount > 500000) {
      setWarningMessage('Investment amount must be in increments of Rs. 5,000 (from 5,000 to 500,000)');
      return;
    }

    const calculatedSlots = Math.floor(amount / 5000);
    if (calculatedSlots > 100) {
      setWarningMessage('Maximum investment amount is Rs. 500,000 (100 slots)');
      return;
    }

    if (pool.slots < calculatedSlots) {
      setWarningMessage(`Not enough slots available. Required: ${calculatedSlots} slots`);
      return;
    }

    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1,
          poolId: pool.id,
          amount: investment,
        }),
      });

      if (!res.ok) throw new Error('Failed to make investment');

      setInvestment('');
      setExpandedPoolId(null);
      window.location.reload();
    } catch (error) {
      console.error('Investment error:', error);
      setWarningMessage('Failed to make investment. Please try again.');
    }
  };

  // Calculate investment totals
  const totalInvested = userInvestments.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const totalBulbsShare = Math.floor((totalInvested / 1500000) * 12500);
  const totalExpectedProfit = Math.floor((totalInvested / 1500000) * 825000);
  const monthlyProfit = Math.floor(totalExpectedProfit / 3);
  const totalReturn = totalInvested + totalExpectedProfit;

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Investments</h1>
      <StatsOverview poolCount={pools ? pools.length : 0} availableSlots={pools?.[0]?.slots || 0} />

      <Tabs defaultValue="pools" className="w-full mt-6">
        <TabsList className="w-full bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="pools" 
            className="flex-1 rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all"
          >
            Investment Pools
          </TabsTrigger>
          <TabsTrigger 
            value="investments"
            className="flex-1 rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all"
          >
            My Investments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="mt-4">
          <div className="space-y-4">
            {pools && pools.map((pool: Pool) => (
              <InvestmentPoolCard
                key={pool.id}
                pool={pool}
                expanded={expandedPoolId === pool.id}
                investment={investment}
                warningMessage={warningMessage}
                onToggleExpand={() => handleToggleExpand(pool.id)}
                onInvestmentChange={handleInvestmentChange}
                onInvest={() => handleInvest(pool)}
                onViewBusinessDetails={() => setShowDetails(!showDetails)}
              />
            ))}
            {showDetails && <div className="mt-4"><InvestmentDetails /></div>}
          </div>
        </TabsContent>

        <TabsContent value="investments" className="mt-4">
          {userInvestments && userInvestments.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md p-4">
              <Accordion type="single" collapsible className="space-y-4">
                {userInvestments.map((userInvestment: Investment) => {
                  const investmentPool = pools && pools.find((p: Pool) => p.id === userInvestment.poolId);
                  const investmentAmount = Number(userInvestment.amount);
                  const bulbsShare = Math.floor((investmentAmount / 1500000) * 12500);
                  const totalProfit = Math.floor((investmentAmount / 1500000) * 825000);
                  const monthlyProfit = Math.floor(totalProfit / 6);
                  const investmentDuration = "6 months";

                  return investmentPool ? (
                    <AccordionItem key={userInvestment.id} value={`investment-${userInvestment.id}`} className="border-b border-gray-100 last:border-0">
                      <AccordionTrigger className="hover:no-underline">
                        <h3 className="font-medium text-gray-800 text-left">Investment #{userInvestments.indexOf(userInvestment) + 1}: {investmentPool.name}</h3>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Amount Invested</p>
                          <p className="text-sm font-medium">Rs. {investmentAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Investment Date</p>
                          <p className="text-sm font-medium">{new Date(userInvestment.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Investment Duration</p>
                          <p className="text-sm font-medium">{investmentDuration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="text-sm font-medium text-green-600">{investmentPool.startDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">End Date</p>
                          <p className="text-sm font-medium text-amber-600">{investmentPool.endDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Expected Total Profit (6 Months)</p>
                          <p className="text-sm font-medium text-green-600">
                            Rs. {totalProfit.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Monthly Profit</p>
                          <p className="text-sm font-medium text-amber-600">
                            Rs. {monthlyProfit.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Maturity Date</p>
                          <p className="text-sm font-medium text-amber-600">{investmentPool.endDate}</p>
                        </div>
                        <div className="col-span-2 mt-1 pt-1 border-t border-gray-100">
                          <p className="text-xs text-gray-500">Total Return (Capital + Profit)</p>
                          <p className="text-sm font-medium text-primary-600">
                            Rs. {(investmentAmount + totalProfit).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : null;
                })}
              </Accordion>

              <div className="mt-6 pt-4 border-t-2 border-green-100">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Investment Summary</h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Total Invested Capital</p>
                      <p className="text-base font-semibold text-gray-800">Rs. {totalInvested.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Number of Investments</p>
                      <p className="text-base font-semibold text-gray-800">{userInvestments.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Expected Profit</p>
                      <p className="text-base font-semibold text-green-600">
                        Rs. {totalExpectedProfit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Monthly Profit (Estimated)</p>
                      <p className="text-base font-semibold text-amber-600">
                        Rs. {monthlyProfit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-700">Total Return (Capital + Profit)</p>
                      <p className="text-lg font-bold text-primary-600">
                        Rs. {totalReturn.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              You haven't made any investments yet.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
