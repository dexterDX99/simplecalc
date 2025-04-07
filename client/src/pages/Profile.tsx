import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { toast } = useToast();

  const handleReset = async () => {
    setIsResetting(true);
    setResetSuccess(false);

    try {
      // Clear all existing investments from local storage
      window.localStorage.clear();
      
      // Call the API to reset backend data
      const res = await fetch('/api/users/1/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to reset application data');
      }
      
      // Show success state
      setResetSuccess(true);
      
      // Show notification
      toast({
        title: "Reset Successful",
        description: "All investment data has been reset successfully.",
        variant: "success",
      });
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error resetting application:', error);
      toast({
        title: "Reset Failed",
        description: "There was a problem resetting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h1>
      
      <div className="grid gap-6">
        {/* User Information Card */}
        <Card className="bg-white shadow-md border border-gray-100">
          <CardContent className="p-5">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-white text-xl font-bold">
                T
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Teslatech Enterprises</h2>
                <p className="text-sm text-gray-500">User ID: 1</p>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <h3 className="text-md font-medium text-gray-700 mb-2">Account Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Account Type</p>
                  <p className="font-medium">Investor</p>
                </div>
                <div>
                  <p className="text-gray-500">Joined</p>
                  <p className="font-medium">April 2025</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
                <div>
                  <p className="text-gray-500">KYC Status</p>
                  <p className="font-medium text-amber-600">Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testing Controls */}
        <Card className="bg-white shadow-md border border-gray-100">
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Testing Controls</h3>
            <p className="text-sm text-gray-500 mb-4">
              Use these controls for testing purposes. Resetting will clear all local data and refresh the application.
            </p>
            
            <Button
              onClick={handleReset}
              disabled={isResetting}
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isResetting ? 'Resetting...' : 'Reset Parameters'}
            </Button>
            
            {resetSuccess && (
              <p className="mt-3 text-sm text-green-600">
                Reset successful! Refreshing application...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}