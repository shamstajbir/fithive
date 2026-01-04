import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
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
            <h1 className="text-5xl md:text-7xl font-black mb-6">Privacy Policy</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              How we collect, use, and protect your information
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-gray-600 mb-8">
              <strong>Last Updated:</strong> January 1, 2025
            </p>

            <h2 className="text-3xl font-black mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-6">
              We collect information that you provide directly to us, including when you create an account, 
              purchase a membership, book classes, or contact us for support. This may include your name, 
              email address, phone number, payment information, and fitness preferences.
            </p>

            <h2 className="text-3xl font-black mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your membership and class bookings</li>
              <li>Send you updates, newsletters, and promotional materials</li>
              <li>Respond to your comments and questions</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>

            <h2 className="text-3xl font-black mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 mb-6">
              We do not sell your personal information. We may share your information with service providers 
              who assist us in operating our business, such as payment processors and email service providers. 
              These providers are bound by confidentiality agreements.
            </p>

            <h2 className="text-3xl font-black mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-6">
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-3xl font-black mb-4">5. Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2 className="text-3xl font-black mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-600 mb-6">
              We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, 
              and deliver personalized content. You can control cookies through your browser settings.
            </p>

            <h2 className="text-3xl font-black mb-4">7. Children's Privacy</h2>
            <p className="text-gray-600 mb-6">
              Our services are not directed to individuals under 18. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please 
              contact us immediately.
            </p>

            <h2 className="text-3xl font-black mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the "Last Updated" date.
            </p>

            <h2 className="text-3xl font-black mb-4">9. Contact Us</h2>
            <p className="text-gray-600 mb-2">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none text-gray-600 space-y-1">
              <li><strong>Email:</strong> contact@geekssort.com</li>
              <li><strong>Phone:</strong> +8801341869125</li>
              <li><strong>Address:</strong> Mirpur DOHS, Pallabi, Dhaka 1216, Bangladesh</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
}