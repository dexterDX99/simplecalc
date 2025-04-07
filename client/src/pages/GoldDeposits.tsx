import { useLocation } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const queryString = location.includes('?') ? location.split('?')[1] : '';
  const params = new URLSearchParams(queryString);
  const amount = params.get('amount') ? parseFloat(params.get('amount')) : null;
  const weight = params.get('weight') ? parseFloat(params.get('weight')) : null;
  const purity = params.get('purity') ? parseFloat(params.get('purity')) : null;

  const { data: deposits = [] } = useQuery<GoldDeposit[]>({
    queryKey: ['gold-deposits'],
    queryFn: async () => {
      const response = await fetch('/api/gold-deposits');
      if (!response.ok) {
        throw new Error('Failed to fetch deposits');
      }
      return response.json();
    },
  });

  const saveDeposit = useMutation({
    mutationFn: async (deposit: Omit<GoldDeposit, 'id' | 'depositDate'>) => {
      const response = await fetch('/api/gold-deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deposit),
      });
      if (!response.ok) {
        throw new Error('Failed to save deposit');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gold-deposits'] });
      toast({
        title: "Success",
        description: "Gold deposit saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save deposit",
        variant: "destructive",
      });
    },
  });

  const handleConfirmDeposit = () => {
    if (amount && weight && purity) {
      saveDeposit.mutate({
        userId: 1, // TODO: Replace with actual user ID from auth
        weight,
        purity,
        value: amount,
      });
    }
  };

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
                <p className="text-base font-semibold">Rs. {parseFloat(amount.toString()).toLocaleString()}</p>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
              onClick={handleConfirmDeposit}
              disabled={saveDeposit.isPending}
            >
              {saveDeposit.isPending ? 'Saving...' : 'Confirm Deposit'}
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