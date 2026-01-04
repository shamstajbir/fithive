import React from 'react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
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
            <h1 className="text-5xl md:text-7xl font-black mb-6">Terms of Service</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Please read these terms carefully before using our services
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
              <strong>Effective Date:</strong> January 1, 2025
            </p>

            <h2 className="text-3xl font-black mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6">
              By accessing and using FitHive's facilities and services, you accept and agree to be bound by 
              these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-3xl font-black mb-4">2. Membership</h2>
            <p className="text-gray-600 mb-4">
              Membership grants you access to FitHive facilities and services according to your chosen plan:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Memberships are personal and non-transferable</li>
              <li>You must be 18 years or older to purchase a membership</li>
              <li>All information provided must be accurate and up-to-date</li>
              <li>Valid membership ID must be presented upon entry</li>
              <li>Memberships may be canceled at any time with no penalty</li>
            </ul>

            <h2 className="text-3xl font-black mb-4">3. Payment Terms</h2>
            <p className="text-gray-600 mb-6">
              Membership fees are charged monthly based on your selected plan. Payment is due on the same date 
              each month. Failed payments may result in suspension of membership privileges. Refunds are not 
              provided for partial months.
            </p>

            <h2 className="text-3xl font-black mb-4">4. Facility Rules</h2>
            <p className="text-gray-600 mb-4">Members must:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Respect other members and staff</li>
              <li>Use equipment properly and safely</li>
              <li>Maintain appropriate hygiene and attire</li>
              <li>Clean equipment after use</li>
              <li>Follow posted safety guidelines</li>
              <li>Not engage in disruptive or dangerous behavior</li>
            </ul>

            <h2 className="text-3xl font-black mb-4">5. Health and Safety</h2>
            <p className="text-gray-600 mb-6">
              You acknowledge that physical exercise involves inherent risks. You agree to consult with a 
              physician before beginning any exercise program. FitHive is not liable for injuries sustained 
              while using our facilities, except in cases of our negligence.
            </p>

            <h2 className="text-3xl font-black mb-4">6. Class Reservations</h2>
            <p className="text-gray-600 mb-6">
              Classes must be reserved in advance through our app or website. Late cancellations (less than 2 
              hours before class start) may result in loss of booking privileges. Premium classes (Zumba, HIIT) 
              are available only to Elite members.
            </p>

            <h2 className="text-3xl font-black mb-4">7. Termination</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to terminate or suspend membership for violation of these terms, non-payment, 
              or behavior that threatens the safety or experience of others. You may cancel your membership at 
              any time through your account settings.
            </p>

            <h2 className="text-3xl font-black mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              FitHive is not liable for lost or stolen personal property. We are not responsible for injuries 
              resulting from member negligence or failure to follow safety guidelines. Our total liability is 
              limited to the amount paid for your membership.
            </p>

            <h2 className="text-3xl font-black mb-4">9. Changes to Terms</h2>
            <p className="text-gray-600 mb-6">
              We may modify these terms at any time. Continued use of our services after changes constitutes 
              acceptance of the new terms. We will notify members of significant changes via email.
            </p>

            <h2 className="text-3xl font-black mb-4">10. Contact Information</h2>
            <p className="text-gray-600 mb-2">
              For questions about these Terms of Service:
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