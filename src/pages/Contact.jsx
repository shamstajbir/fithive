import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    club: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('email');

  // Fix Leaflet default icon issue
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  // Coordinates for Mirpur DOHS, Pallabi, Dhaka
  const position = [23.8223, 90.3654];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await base44.entities.Inquiry.create({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      club: formData.club,
      subject: formData.subject,
      message: formData.message,
      source: 'contact_page',
      status: 'new'
    });

    // Send email notification
    await base44.integrations.Core.SendEmail({
      from_name: 'FitHive',
      to: 'baizidikhan@gmail.com',
      subject: '📩 New Contact Form Submission - FitHive',
      body: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
        <p><strong>Preferred Club:</strong> ${formData.club || 'Not specified'}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
        <hr>
        <p><small>Source: Contact Page | Time: ${new Date().toLocaleString()}</small></p>
      `
    });
    
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', club: '', subject: '', message: '' });
    }, 3000);
  };

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
            <h1 className="text-5xl md:text-7xl font-black mb-6">Get in Touch</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-4">
              Have questions? We're here to help you start your fitness journey
            </p>
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Globe className="w-5 h-5" />
              <span className="text-lg font-bold">Available World Wide</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Methods */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Phone, title: 'Call Us', value: '+8801341869125', action: 'tel:+8801341869125', color: 'green' },
              { icon: Mail, title: 'Email Us', value: 'contact@geekssort.com', action: 'mailto:contact@geekssort.com', color: 'yellow' },
              { icon: MessageSquare, title: 'Live Chat', value: 'Chat with us', action: '#form', color: 'blue' },
            ].map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-full mb-4 flex items-center justify-center ${
                  method.color === 'green' ? 'bg-green-100 group-hover:bg-green-500' :
                  method.color === 'yellow' ? 'bg-yellow-100 group-hover:bg-yellow-400' :
                  'bg-blue-100 group-hover:bg-blue-500'
                } transition-colors`}>
                  <method.icon className={`w-7 h-7 ${
                    method.color === 'green' ? 'text-green-600 group-hover:text-white' :
                    method.color === 'yellow' ? 'text-yellow-600 group-hover:text-black' :
                    'text-blue-600 group-hover:text-white'
                  } transition-colors`} />
                </div>
                <h3 className="font-black text-xl mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm">{method.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24" id="form">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-black mb-8">Contact Information</h2>
              
              <div className="space-y-4 mb-12">
                {[
                  { icon: MapPin, title: 'Headquarters', value: 'Mirpur DOHS, Pallabi\nDhaka 1216, Bangladesh' },
                  { icon: Phone, title: 'Phone', value: '+8801341869125' },
                  { icon: Mail, title: 'Email', value: 'contact@geekssort.com' },
                  { icon: Clock, title: 'Office Hours', value: 'Mon-Fri: 09:00 - 18:00\nSat: 10:00 - 16:00' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-8 shadow-xl"
              >
                <h3 className="text-2xl font-black text-black mb-4">Visit a Club</h3>
                <p className="text-black/80 mb-6">
                  Schedule a free tour of any of our locations World Wide and experience FitHive firsthand.
                </p>
                <Button className="bg-black text-white hover:bg-gray-800 w-full py-6 text-lg font-bold">
                  Schedule a Visit →
                </Button>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Message Sent!</h3>
                  <p className="text-gray-600 text-lg">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-3xl font-black mb-8">Send us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Name *</label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full py-6"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2">Email *</label>
                        <Input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="w-full py-6"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Phone</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+880 XXX XXX XXX"
                          className="w-full py-6"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2">Preferred Club</label>
                        <select
                          value={formData.club}
                          onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 h-[52px]"
                        >
                          <option value="">Select a location</option>
                          <option value="dhaka">Dhaka</option>
                          <option value="chittagong">Chittagong</option>
                          <option value="sylhet">Sylhet</option>
                          <option value="other">Other Location</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Subject *</label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="What is this regarding?"
                        className="w-full py-6"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Message *</label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us how we can help you..."
                        className="w-full h-40 resize-none"
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-6 text-lg shadow-lg"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </Button>
                    </motion.div>

                    <p className="text-center text-sm text-gray-500">
                      We typically respond within 24 hours
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black mb-4">Visit Our Location</h2>
            <p className="text-xl text-gray-600">Find us at our headquarters in Dhaka</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <MapContainer
              center={position}
              zoom={15}
              style={{ height: '500px', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-black text-lg mb-2">FitHive Headquarters</h3>
                    <p className="text-sm text-gray-600">Mirpur DOHS, Pallabi</p>
                    <p className="text-sm text-gray-600">Dhaka 1216, Bangladesh</p>
                    <p className="text-sm font-bold mt-2">+8801341869125</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 grid md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <MapPin className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-black text-lg mb-2">Address</h3>
              <p className="text-gray-600 text-sm">Mirpur DOHS, Pallabi<br />Dhaka 1216, Bangladesh</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Phone className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-black text-lg mb-2">Phone</h3>
              <p className="text-gray-600 text-sm">+8801341869125</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Clock className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-black text-lg mb-2">Hours</h3>
              <p className="text-gray-600 text-sm">Mon-Fri: 09:00 - 18:00<br />Sat: 10:00 - 16:00</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}