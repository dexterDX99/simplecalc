import React, { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Business, AccountBalanceWallet } from '@mui/icons-material';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Dummy data - Replace with your actual data fetching and state management
const userInvestments = [
  { id: 1, poolId: 1, amount: '10000', createdAt: '2024-03-01' },
  { id: 2, poolId: 2, amount: '5000', createdAt: '2024-03-15' },
];

const pools = [
  { id: 1, name: 'Pool A', endDate: '2024-06-01' },
  { id: 2, name: 'Pool B', endDate: '2024-07-15' },
];

const minProfitRate = 0.05; // 5%
const maxProfitRate = 0.1; // 10%
const investorShare = 1;


interface Investment {
  id: number;
  poolId: number;
  amount: string;
  createdAt: string;
}

interface Pool {
  id: number;
  name: string;
  endDate: string;
}

function MyInvestments() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Investments</h1>

      {userInvestments && userInvestments.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Investment History</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="space-y-4">
              {userInvestments.map((userInvestment: Investment) => {
                const investmentPool = pools && pools.find((p: Pool) => p.id === userInvestment.poolId);
                const investmentAmount = Number(userInvestment.amount);
                const minExpectedProfit = investmentAmount * minProfitRate * investorShare;
                const maxExpectedProfit = investmentAmount * maxProfitRate * investorShare;

                return investmentPool ? (
                  <div key={userInvestment.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <h3 className="font-medium text-gray-800">{investmentPool.name}</h3>
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
                        <p className="text-xs text-gray-500">Expected Profit (3 Months)</p>
                        <p className="text-sm font-medium text-green-600">
                          Rs. {minExpectedProfit.toLocaleString()} - {maxExpectedProfit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Maturity Date</p>
                        <p className="text-sm font-medium text-amber-600">{investmentPool.endDate}</p>
                      </div>
                      <div className="col-span-2 mt-1 pt-1 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Total Return (Capital + Profit)</p>
                        <p className="text-sm font-medium text-primary-600">
                          Rs. {(investmentAmount + minExpectedProfit).toLocaleString()} - {(investmentAmount + maxExpectedProfit).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function Companies() {
  return <h1>Companies</h1>;
}

function InvestmentPlans() {
  return <h1>Investment Plans</h1>;
}

function App() {
  const [value, setValue] = useState(0);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Companies />} />
          <Route path="/my-investments" element={<MyInvestments />} />
          <Route path="/investment-plans" element={<InvestmentPlans />} />
        </Routes>
        <BottomNavigation value={value} onChange={(event, newValue) => { setValue(newValue); }}>
          <BottomNavigationAction label="Companies" icon={<Home />} component={RouterLink} to="/home" />
          <BottomNavigationAction label="My Investments" icon={<AccountBalanceWallet />} component={RouterLink} to="/my-investments" />
          <BottomNavigationAction label="Investment Plans" icon={<Business />} component={RouterLink} to="/investment-plans" />
        </BottomNavigation>
      </div>
    </Router>
  );
}

// Dummy RouterLink - Replace with your actual RouterLink implementation
const RouterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <a href={to}>{children}</a>
);

export default App;