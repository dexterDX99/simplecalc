
import { useLocation } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";

interface GoldDeposit {
  id: number;
  userId: number;
  weight: number;
  purity: number;
  value: number;
  depositDate: string;
}

export default function GoldDeposits() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const amount = params.get('amount');
  const weight = params.get('weight');
  const purity = params.get('purity');

  const { data: deposits = [] } = useQuery<GoldDeposit[]>({
    queryKey: ['/api/gold-deposits'],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gold Deposits</h1>
      
      {amount && weight && purity && (
        <Card className="mb-6 border-green-100">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-green-700 mb-4">New Jewelry Deposit</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Jewelry Weight</p>
                <p className="text-base font-semibold">{weight} grams</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purity</p>
                <p className="text-base font-semibold">{purity}K</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Value</p>
                <p className="text-base font-semibold">Rs. {parseFloat(amount).toLocaleString()}</p>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
            >
              Confirm Deposit
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {deposits.map((deposit) => (
          <Card key={deposit.id} className="border-green-100">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Deposit Date</p>
                  <p className="text-base font-semibold">
                    {new Date(deposit.depositDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="text-base font-semibold">{deposit.weight} grams</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purity</p>
                  <p className="text-base font-semibold">{deposit.purity}K</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Value</p>
                  <p className="text-base font-semibold text-green-600">
                    Rs. {deposit.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {deposits.length === 0 && !amount && (
          <div className="text-center py-8 text-gray-500">
            No gold deposits found. Use the jewelry calculator to deposit your gold.
          </div>
        )}
      </div>
    </div>
  );
}
