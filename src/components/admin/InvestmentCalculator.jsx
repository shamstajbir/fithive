import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InvestmentCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);

    if (p && r && t) {
      const amount = p * Math.pow(1 + r, t);
      const interest = amount - p;
      const newResult = {
        principal: p,
        rate: rate + '%',
        years: t,
        totalAmount: amount.toFixed(2),
        totalInterest: interest.toFixed(2),
        timestamp: new Date().toLocaleString()
      };
      setResult(newResult);
      setHistory([newResult, ...history.slice(0, 9)]);
    }
  };

  const clearHistory = () => setHistory([]);

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Investment Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">
              Principal Amount (€)
            </label>
            <Input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="10000"
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">
              Annual Interest Rate (%)
            </label>
            <Input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="5"
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">
              Investment Period (Years)
            </label>
            <Input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="10"
              className="w-full"
            />
          </div>
          <Button
            onClick={calculate}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Calculate Returns
          </Button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-xl"
          >
            <h4 className="font-bold text-lg mb-3">Investment Results</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Principal:</span>
                <span className="font-bold">€{result.principal}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Interest:</span>
                <span className="font-bold">€{result.totalInterest}</span>
              </div>
              <div className="flex justify-between border-t border-white/20 pt-2">
                <span>Final Amount:</span>
                <span className="font-bold text-xl">€{result.totalAmount}</span>
              </div>
            </div>
          </motion.div>
        )}

        {history.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-gray-600">Calculation History</h4>
              <Button onClick={clearHistory} size="sm" variant="ghost">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {history.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-3 rounded-lg text-xs space-y-1"
                >
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal:</span>
                    <span className="font-bold">€{item.principal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-bold">{item.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Years:</span>
                    <span className="font-bold">{item.years}</span>
                  </div>
                  <div className="flex justify-between text-green-600 border-t pt-1">
                    <span>Final:</span>
                    <span className="font-bold">€{item.totalAmount}</span>
                  </div>
                  <div className="text-gray-400 text-[10px]">{item.timestamp}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}