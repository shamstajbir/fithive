import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState([]);
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(num.toString());
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num.toString() : display + num);
    }
  };

  const handleOperation = (op) => {
    const current = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(result.toString());
      setPreviousValue(result);
    }
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (prev, curr, op) => {
    switch (op) {
      case '+': return prev + curr;
      case '-': return prev - curr;
      case '×': return prev * curr;
      case '÷': return prev / curr;
      default: return curr;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      const calculation = `${previousValue} ${operation} ${current} = ${result}`;
      setHistory([calculation, ...history.slice(0, 9)]);
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const clearHistory = () => setHistory([]);

  const buttons = [
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Basic Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-900 text-white p-4 rounded-lg mb-4 text-right text-3xl font-mono">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {buttons.map((btn) => (
            <Button
              key={btn}
              onClick={() => {
                if (btn === '=') handleEquals();
                else if (['+', '-', '×', '÷'].includes(btn)) handleOperation(btn);
                else handleNumber(btn);
              }}
              className={`h-14 text-xl font-bold ${
                btn === '=' ? 'bg-green-600 hover:bg-green-700' :
                ['+', '-', '×', '÷'].includes(btn) ? 'bg-blue-600 hover:bg-blue-700' :
                'bg-gray-700 hover:bg-gray-800'
              }`}
            >
              {btn}
            </Button>
          ))}
        </div>
        <Button onClick={handleClear} variant="destructive" className="w-full mb-4">
          Clear (C)
        </Button>

        {history.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-gray-600">History</h4>
              <Button onClick={clearHistory} size="sm" variant="ghost">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {history.map((calc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-gray-600 bg-white p-2 rounded"
                >
                  {calc}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}