import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ChevronLeft, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const faqs = [
  {
    question: 'What are your membership packages?',
    answer: 'We offer flexible Starter packages starting from €35/month and all-inclusive Elite packages from €75/month. You can customize your Starter package with add-ons or enjoy all amenities with Elite. Visit our Packages page for detailed pricing.'
  },
  {
    question: 'What are your operating hours?',
    answer: 'Our clubs are open Mon-Fri: 5:00 AM - 11:00 PM, Sat-Sun: 7:00 AM - 9:00 PM. Some locations offer 24/7 access for Elite members. Check specific club timings on our Clubs page.'
  },
  {
    question: 'Do you offer personal training?',
    answer: 'Yes! Personal training sessions are available as an add-on (€50/month for 4 sessions) or included free with Elite membership. Our certified trainers create customized workout plans tailored to your goals.'
  },
  {
    question: 'Can I try before joining?',
    answer: 'Absolutely! Schedule a free club tour and trial session. Visit our Contact page or call us at +8801341869125 to book your visit. Experience FitHive firsthand!'
  },
  {
    question: 'What classes do you offer?',
    answer: 'We offer diverse classes including HIIT, Yoga, Spinning, Boxing, Pilates, Zumba, and more. Classes are unlimited with Elite membership or available as an add-on (€15/month) for Starter members. Check our Class Schedule page.'
  }
];

export default function ChatWidget({ currentPageName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('menu'); // menu, faq, contact, success
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // Auto-open logic for specific pages after 60 seconds
  useEffect(() => {
    const autoOpenPages = ['Packages', 'ClassSchedule', 'Contact'];
    
    if (autoOpenPages.includes(currentPageName) && !hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setView('contact-cta');
        setHasAutoOpened(true);
      }, 25000); // 25 seconds

      return () => clearTimeout(timer);
    }
  }, [currentPageName, hasAutoOpened]);

  const handleFaqClick = (faq) => {
    setSelectedFaq(faq);
    setView('faq');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await base44.entities.Inquiry.create({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      message: formData.message,
      source: 'chat_widget',
      status: 'new'
    });

    // Send email notification
    await base44.integrations.Core.SendEmail({
      from_name: 'FitHive',
      to: 'baizidikhan@gmail.com',
      subject: '🔔 New Chat Widget Inquiry - FitHive',
      body: `
        <h2>New Inquiry from Chat Widget</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
        <hr>
        <p><small>Source: Chat Widget | Time: ${new Date().toLocaleString()}</small></p>
      `
    });
    
    setView('success');
    setTimeout(() => {
      setIsOpen(false);
      setView('menu');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  const resetWidget = () => {
    setView('menu');
    setSelectedFaq(null);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-yellow-400 rounded-full shadow-2xl flex items-center justify-center hover:bg-yellow-500 transition-colors"
          >
            <MessageCircle className="w-8 h-8 text-black" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {view !== 'menu' && view !== 'contact-cta' && (
                  <button onClick={resetWidget} className="text-black hover:opacity-70">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h3 className="font-bold text-black">FitHive Support</h3>
                  <p className="text-xs text-black/70">We're here to help!</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-black hover:opacity-70">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[500px] overflow-y-auto">
              {/* Menu View */}
              {view === 'menu' && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-6">How can we assist you today?</p>
                  
                  <div>
                    <h4 className="font-bold text-sm text-gray-500 mb-3">QUICK ANSWERS</h4>
                    <div className="space-y-2">
                      {faqs.map((faq, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ x: 5 }}
                          onClick={() => handleFaqClick(faq)}
                          className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all text-sm"
                        >
                          {faq.question}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => setView('contact')}
                      className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
                    >
                      Contact Us Directly
                    </Button>
                  </div>
                </div>
              )}

              {/* FAQ Answer View */}
              {view === 'faq' && selectedFaq && (
                <div className="space-y-4">
                  <h4 className="font-bold text-lg">{selectedFaq.question}</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedFaq.answer}</p>
                  <Button
                    onClick={resetWidget}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Questions
                  </Button>
                </div>
              )}

              {/* Contact Form View */}
              {view === 'contact' && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">Please fill out the form below and we'll get back to you shortly.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">How can we help? *</label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your inquiry..."
                        className="h-24 resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Inquiry
                    </Button>
                  </form>
                </div>
              )}

              {/* Auto-Open CTA View */}
              {view === 'contact-cta' && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-8 h-8 text-black" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                    <p className="text-gray-600">We noticed you're interested in our services. Let us assist you! Share your details and we'll reach out shortly.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">What are you interested in?</label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Membership packages, class schedule, personal training..."
                        className="h-20 resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                      Get in Touch
                    </Button>
                  </form>
                </div>
              )}

              {/* Success View */}
              {view === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">Thank You!</h3>
                  <p className="text-gray-600 mb-2">
                    Your inquiry has been received successfully.
                  </p>
                  <p className="text-sm text-gray-500">
                    Our team will contact you within 24 hours.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}