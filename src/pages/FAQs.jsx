import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What are your membership options?',
    answer: 'We offer Starter and Elite packages with 3, 6, and 12-month durations. Starter packages allow you to customize with add-ons, while Elite includes everything.',
  },
  {
    question: 'Can I cancel my membership anytime?',
    answer: 'Yes! All our memberships have no commitment, and you can cancel anytime without penalties.',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'We offer free gym tours at all our locations. Contact us or schedule a visit through our website to experience FitHive firsthand.',
  },
  {
    question: 'What amenities are included?',
    answer: 'All memberships include access to state-of-the-art equipment, locker rooms, showers, and our mobile app. Elite members get additional perks like sauna, pool access, and priority booking.',
  },
  {
    question: 'Are personal training sessions included?',
    answer: 'Personal training is available as an add-on for Starter packages or included in Elite packages. We offer both individual and small group sessions.',
  },
  {
    question: 'What are your operating hours?',
    answer: 'Most of our clubs operate with morning and evening sessions. Specific hours vary by location - check the Clubs page for details.',
  },
  {
    question: 'Can I access all club locations?',
    answer: 'Yes! Your membership gives you access to all FitHive locations across Bangladesh.',
  },
  {
    question: 'Do you have parking facilities?',
    answer: 'Yes, all our locations offer free parking for members.',
  },
  {
    question: 'What classes do you offer?',
    answer: 'We offer Yoga, Aerobics, Zumba, HIIT, and more. Check our Class Schedule page for the full timetable. Some classes are included in all memberships, while Zumba and HIIT are for premium members only.',
  },
  {
    question: 'How do I sign up?',
    answer: 'You can sign up online through our Packages page, visit any of our clubs, or contact us directly. Our team will guide you through the process.',
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-black text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">FAQs</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Find answers to common questions about FitHive
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-bold pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-6 h-6 text-yellow-400 flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 p-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl text-center"
          >
            <h3 className="text-3xl font-black text-black mb-4">Still have questions?</h3>
            <p className="text-black/80 mb-6">
              Our team is here to help! Reach out and we'll get back to you as soon as possible.
            </p>
            <a
              href="/Contact"
              className="inline-block px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}