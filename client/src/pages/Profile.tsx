
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLocation } from 'wouter';
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { toast } = useToast();

  const handleReset = async () => {
    setIsResetting(true);
    setResetSuccess(false);

    try {
      window.localStorage.clear();
      const res = await fetch('/api/users/1/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to reset application data');
      }
      
      setResetSuccess(true);
      toast({
        title: "Reset Successful",
        description: "All investment data has been reset successfully.",
        variant: "success",
      });
      
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
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-white text-xl font-bold">
                T
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Teslatech Enterprises</h2>
                <p className="text-sm text-gray-500">User ID: 1</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Account Information */}
              <div className="border-t border-gray-100 pt-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="account-info">
                    <AccordionTrigger className="text-md font-medium text-gray-700">
                      Account Information
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Your basic account details and verification status.
                      </p>
                      <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Account Type</span>
                    <span className="font-medium">Investor</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Joined</span>
                    <span className="font-medium">April 2025</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium text-green-600">Active</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">KYC Status</span>
                    <span className="font-medium text-amber-600">Pending</span>
                  </li>
                </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Shariah Compliance */}
                  <AccordionItem value="shariah-compliance">
                    <AccordionTrigger className="text-md font-medium text-gray-700">
                      Shariah Compliance
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Our commitment to Islamic financial principles and ethical investment practices.
                      </p>
                      <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Mudarabah-based profit sharing model</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Interest-free investments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Transparent profit distribution</span>
                  </li>
                </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Gold Investment Info */}
                  <AccordionItem value="gold-investment">
                    <AccordionTrigger className="text-md font-medium text-gray-700">
                      Gold Investment Info
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Details about our gold investment model and profit-sharing structure.
                      </p>
                      <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Investment Model</span>
                    <span className="font-medium">Mudarabah</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Profit Share Ratio</span>
                    <span className="font-medium">60:40</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Minimum Investment</span>
                    <span className="font-medium">Rs. 5,000</span>
                  </li>
                </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
