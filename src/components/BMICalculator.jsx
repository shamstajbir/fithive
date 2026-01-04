import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BMICalculator({ isOpen, onClose }) {
  const [heightUnit, setHeightUnit] = useState('cm'); // 'cm' or 'ft'
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [showResult, setShowResult] = useState(false);

  const calculateBMI = () => {
    let heightInMeters = 0;

    if (heightUnit === 'cm') {
      if (!heightCm || !weight) return;
      heightInMeters = parseFloat(heightCm) / 100;
    } else {
      if (!heightFt || !weight) return;
      const totalInches = (parseFloat(heightFt) * 12) + (parseFloat(heightIn) || 0);
      heightInMeters = totalInches * 0.0254;
    }

    const weightInKg = parseFloat(weight);
    const calculatedBmi = weightInKg / (heightInMeters * heightInMeters);
    const roundedBmi = calculatedBmi.toFixed(1);

    setBmi(roundedBmi);

    // Determine category
    if (calculatedBmi < 18.5) {
      setCategory('Underweight');
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
      setCategory('Normal weight');
    } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }

    setShowResult(true);
  };

  const reset = () => {
    setWeight('');
    setHeightCm('');
    setHeightFt('');
    setHeightIn('');
    setBmi(null);
    setCategory('');
    setShowResult(false);
  };

  const getBMIColor = (value) => {
    if (value < 18.5) return 'text-blue-600';
    if (value >= 18.5 && value < 25) return 'text-green-600';
    if (value >= 25 && value < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBMIMessage = (cat) => {
    const messages = {
      'Underweight': 'You may need to gain some weight. Consider consulting with a nutritionist.',
      'Normal weight': 'Great! You have a healthy weight. Keep up the good work!',
      'Overweight': 'Consider adopting a healthier lifestyle with regular exercise and balanced diet.',
      'Obese': 'We recommend consulting with a healthcare professional for personalized guidance.',
    };
    return messages[cat] || '';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-3xl font-black">BMI Calculator</h2>
          </div>

          {!showResult ? (
            <>
              {/* Height Unit Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setHeightUnit('cm')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    heightUnit === 'cm'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Centimeters
                </button>
                <button
                  onClick={() => setHeightUnit('ft')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    heightUnit === 'ft'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Feet & Inches
                </button>
              </div>

              {/* Height Input */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Height</label>
                {heightUnit === 'cm' ? (
                  <Input
                    type="number"
                    placeholder="Enter height in cm"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Feet"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Inches"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                )}
              </div>

              {/* Weight Input */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Weight (kg)</label>
                <Input
                  type="number"
                  placeholder="Enter weight in kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* BMI Scale Reference */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-500 mb-2">BMI Categories:</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-600 font-semibold">Underweight</span>
                    <span className="text-gray-600">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600 font-semibold">Normal</span>
                    <span className="text-gray-600">18.5 - 24.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600 font-semibold">Overweight</span>
                    <span className="text-gray-600">25 - 29.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600 font-semibold">Obese</span>
                    <span className="text-gray-600">≥ 30</span>
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              <Button
                onClick={calculateBMI}
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-6"
              >
                Calculate BMI
              </Button>
            </>
          ) : (
            <>
              {/* Result */}
              <div className="text-center mb-6">
                <div className={`text-6xl font-black mb-2 ${getBMIColor(bmi)}`}>
                  {bmi}
                </div>
                <div className="text-2xl font-bold text-gray-700 mb-4">{category}</div>
                <p className="text-gray-600 leading-relaxed">
                  {getBMIMessage(category)}
                </p>
              </div>

              {/* Visual BMI Scale */}
              <div className="mb-6">
                <div className="h-3 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full relative">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full border-2 border-white shadow-lg"
                    style={{
                      left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>15</span>
                  <span>20</span>
                  <span>25</span>
                  <span>30</span>
                  <span>35</span>
                  <span>40</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={reset}
                  variant="outline"
                  className="flex-1 font-bold py-6"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-6"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}