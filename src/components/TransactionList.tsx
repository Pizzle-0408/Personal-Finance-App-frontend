import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Transaction } from '../services/api';
import { Home, Car, Utensils, Zap, Shield, Heart, Music, Scissors, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const categoryConfig = {
  Housing: { color: 'bg-blue-100 text-blue-600', icon: Home },
  Transportation: { color: 'bg-orange-100 text-orange-600', icon: Car },
  Food: { color: 'bg-green-100 text-green-600', icon: Utensils },
  Utilities: { color: 'bg-yellow-100 text-yellow-600', icon: Zap },
  Insurance: { color: 'bg-purple-100 text-purple-600', icon: Shield },
  'Medical & Healthcare': { color: 'bg-red-100 text-red-600', icon: Heart },
  Personal: { color: 'bg-pink-100 text-pink-600', icon: Scissors },
  'Recreation and Entertainment': { color: 'bg-indigo-100 text-indigo-600', icon: Music },
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
              const categoryLabel = transaction.category ?? 'Miscellaneous';
              const categoryKey =
                categoryLabel in categoryConfig
                  ? (categoryLabel as keyof typeof categoryConfig)
                  : 'Miscellaneous';
              const config = categoryConfig[categoryKey];
              const Icon = config.icon;
              const displayAmount = Number(transaction.amount ?? 0);
              const displayName = transaction.name ?? transaction.description ?? transaction.merchant ?? 'Transaction';

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
