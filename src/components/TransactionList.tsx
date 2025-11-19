import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Transaction } from '../services/api';
import { 
  Home, Car, Utensils, Zap, Shield, Heart, Music, Scissors, MoreHorizontal, ChevronLeft, ChevronRight,
  ShoppingCart, ShoppingBag, Coffee, Smartphone, Laptop, Shirt, Gift, Plane, Hotel, 
  Briefcase, DollarSign, CreditCard, Building, Stethoscope, GraduationCap, Dumbbell, Fuel
} from 'lucide-react';
import { useState } from 'react';

const categoryConfig = {
  Housing: { color: 'bg-blue-100 text-blue-600', icon: Home },
  Home: { color: 'bg-blue-100 text-blue-600', icon: Home },
  Transportation: { color: 'bg-orange-100 text-orange-600', icon: Car },
  Food: { color: 'bg-green-100 text-green-600', icon: Utensils },
  'Food & Dining': { color: 'bg-green-100 text-green-600', icon: Utensils },
  'Food & Drink': { color: 'bg-red-100 text-red-600', icon: Utensils },
  Groceries: { color: 'bg-emerald-100 text-emerald-600', icon: ShoppingCart },
  'Restaurants': { color: 'bg-lime-100 text-lime-600', icon: Coffee },
  Utilities: { color: 'bg-yellow-100 text-yellow-600', icon: Zap },
  Insurance: { color: 'bg-purple-100 text-purple-600', icon: Shield },
  'Medical & Healthcare': { color: 'bg-red-100 text-red-600', icon: Heart },
  Healthcare: { color: 'bg-red-100 text-red-600', icon: Stethoscope },
  Personal: { color: 'bg-pink-100 text-pink-600', icon: Scissors },
  'Personal Care': { color: 'bg-pink-100 text-pink-600', icon: Scissors },
  'Recreation and Entertainment': { color: 'bg-indigo-100 text-indigo-600', icon: Music },
  Entertainment: { color: 'bg-indigo-100 text-indigo-600', icon: Music },
  Shopping: { color: 'bg-violet-100 text-violet-600', icon: ShoppingBag },
  'General Merchandise': { color: 'bg-violet-100 text-violet-600', icon: ShoppingBag },
  Clothing: { color: 'bg-fuchsia-100 text-fuchsia-600', icon: Shirt },
  Electronics: { color: 'bg-slate-100 text-slate-600', icon: Laptop },
  Technology: { color: 'bg-slate-100 text-slate-600', icon: Smartphone },
  Gas: { color: 'bg-amber-100 text-amber-600', icon: Fuel },
  'Gas & Fuel': { color: 'bg-amber-100 text-amber-600', icon: Fuel },
  Travel: { color: 'bg-sky-100 text-sky-600', icon: Plane },
  Vacation: { color: 'bg-cyan-100 text-cyan-600', icon: Hotel },
  Gifts: { color: 'bg-rose-100 text-rose-600', icon: Gift },
  'Gifts & Donations': { color: 'bg-rose-100 text-rose-600', icon: Gift },
  Business: { color: 'bg-neutral-100 text-neutral-600', icon: Briefcase },
  Income: { color: 'bg-green-200 text-green-700', icon: DollarSign },
  Payment: { color: 'bg-green-100 text-green-600', icon: DollarSign },
  'Credit Card Payment': { color: 'bg-green-100 text-green-600', icon: DollarSign },
  Bills: { color: 'bg-yellow-200 text-yellow-700', icon: Building },
  'Bills & Utilities': { color: 'bg-yellow-200 text-yellow-700', icon: Building },
  Education: { color: 'bg-teal-100 text-teal-600', icon: GraduationCap },
  Fitness: { color: 'bg-orange-200 text-orange-700', icon: Dumbbell },
  'Health & Fitness': { color: 'bg-orange-200 text-orange-700', icon: Dumbbell },
  Miscellaneous: { color: 'bg-gray-100 text-gray-600', icon: MoreHorizontal },
};

const sampleTransactions: Array<Transaction & { category: keyof typeof categoryConfig }> = [
  { id: 1, name: 'Rent Payment', category: 'Housing', date: '2025-10-26', amount: 1850 },
  { id: 2, name: 'Grocery Store', category: 'Food', date: '2025-10-25', amount: 156.42 },
  { id: 3, name: 'Auto Insurance', category: 'Insurance', date: '2025-10-25', amount: 325 },
  { id: 4, name: 'Gas Station', category: 'Transportation', date: '2025-10-24', amount: 45.8 },
  { id: 5, name: 'Electric Bill', category: 'Utilities', date: '2025-10-23', amount: 125 },
  { id: 6, name: 'Restaurant', category: 'Food', date: '2025-10-23', amount: 68.5 },
  { id: 7, name: 'Gym Membership', category: 'Personal', date: '2025-10-22', amount: 59.99 },
  { id: 8, name: 'Concert Tickets', category: 'Recreation and Entertainment', date: '2025-10-22', amount: 150 },
  { id: 9, name: 'Doctor Visit Copay', category: 'Medical & Healthcare', date: '2025-10-21', amount: 35 },
  { id: 10, name: 'Internet Bill', category: 'Utilities', date: '2025-10-20', amount: 89.99 },
  { id: 11, name: 'Haircut', category: 'Personal', date: '2025-10-20', amount: 45 },
  { id: 12, name: 'Uber Ride', category: 'Transportation', date: '2025-10-19', amount: 28.5 },
  { id: 13, name: 'Streaming Services', category: 'Recreation and Entertainment', date: '2025-10-18', amount: 24.99 },
  { id: 14, name: 'Coffee Shop', category: 'Food', date: '2025-10-18', amount: 12.8 },
];

interface TransactionListProps {
  transactions?: Transaction[];
  isLoading?: boolean;
}

export default function TransactionList({ transactions = [], isLoading = false }: TransactionListProps) {
  const usingLiveData = transactions.length > 0;
  const data = usingLiveData ? transactions : sampleTransactions;
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = data.slice(startIndex, endIndex);
  
  // Reset to page 1 when data changes
  useState(() => {
    setCurrentPage(1);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          {usingLiveData 
            ? `Showing ${startIndex + 1}-${Math.min(endIndex, data.length)} of ${data.length} transactions` 
            : 'Sample transactions'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && usingLiveData ? (
          <p className="text-sm text-muted-foreground">Refreshing transactions…</p>
        ) : (
          <>
            <div className="space-y-3">
              {currentTransactions.map((transaction) => {
              const displayName = transaction.name ?? transaction.description ?? transaction.merchant ?? 'Transaction';
              const categoryLabel = transaction.category ?? 'Miscellaneous';
              const displayAmount = Number(transaction.amount ?? 0);
              
              // If it's a positive amount, it's a payment - show green dollar sign
              const isPayment = displayAmount > 0;
              
              let categoryKey: keyof typeof categoryConfig;
              if (isPayment) {
                categoryKey = 'Payment';
              } else if (categoryLabel in categoryConfig) {
                categoryKey = categoryLabel as keyof typeof categoryConfig;
              } else {
                categoryKey = 'Miscellaneous';
              }
              
              const config = categoryConfig[categoryKey];
              const Icon = config.icon;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground">{displayName}</div>
                      <div className="text-xs text-muted-foreground">
                        {categoryLabel} • {transaction.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-foreground">
                    ${displayAmount.toFixed(2)}
                  </div>
                </div>
              );
            })}
            </div>
            
            {/* Pagination Controls */}
            {data.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
