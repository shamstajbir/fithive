import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BMRCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('1.2');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (w && h && a) {
      // Harris-Benedict equation
      let bmr;
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
      } else {
        bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
      }

      const tdee = bmr * parseFloat(activity);

      const newResult = {
        weight: w,
        height: h,
        age: a,
        gender,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        timestamp: new Date().toLocaleString()
      };

      setResult(newResult);
      setHistory([newResult, ...history.slice(0, 9)]);
    }
  };

  const activityLevels = {
    '1.2': 'Sedentary (little/no exercise)',
    '1.375': 'Lightly active (1-3 days/week)',
    '1.55': 'Moderately active (3-5 days/week)',
    '1.725': 'Very active (6-7 days/week)',
    '1.9': 'Super active (athlete)'
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          BMR & TDEE Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Weight (kg)</label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Height (cm)</label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Age</label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="30"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              {Object.entries(activityLevels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <Button onClick={calculate} className="w-full bg-purple-600 hover:bg-purple-700">
            Calculate Calories
          </Button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl"
          >
            <h4 className="font-bold text-lg mb-3">Your Results</h4>
            <div className="space-y-3">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-sm opacity-90">Basal Metabolic Rate (BMR)</div>
                <div className="text-3xl font-bold">{result.bmr} cal/day</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-sm opacity-90">Total Daily Energy Expenditure (TDEE)</div>
                <div className="text-3xl font-bold">{result.tdee} cal/day</div>
              </div>
            </div>
          </motion.div>
        )}

        {history.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-gray-600">History</h4>
              <Button onClick={() => setHistory([])} size="sm" variant="ghost">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {history.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-3 rounded-lg text-xs"
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">BMR:</span>
                    <span className="font-bold">{item.bmr} cal</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 text-purple-600">
                    <span>TDEE:</span>
                    <span className="font-bold">{item.tdee} cal</span>
                  </div>
                  <div className="text-gray-400 text-[10px] mt-1">{item.timestamp}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}