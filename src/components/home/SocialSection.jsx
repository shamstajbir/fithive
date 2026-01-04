import React from 'react';
import { motion } from 'framer-motion';

const socials = [
  {
    name: 'Instagram',
    short: 'IG',
    url: 'https://www.instagram.com/phiveclubs/',
    images: [
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=400&q=80&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&q=80&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=400&q=80&fit=crop',
    ],
  },
  {
    name: 'Facebook',
    short: 'FB',
    url: 'https://www.facebook.com/phiveclubs/',
    images: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&q=80&fit=crop',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=400&q=80&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&q=80&fit=crop',
    ],
  },
  {
    name: 'YouTube',
    short: 'YT',
    url: 'https://www.youtube.com/',
    images: [
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=400&q=80&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&q=80&fit=crop',
      'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=400&q=80&fit=crop',
    ],
  },
  {
    name: 'TikTok',
    short: 'TK',
    url: 'https://www.tiktok.com/',
    images: [
      'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400&h=400&q=80&fit=crop',
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=400&q=80&fit=crop',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&q=80&fit=crop',
    ],
  },
];

export default function SocialSection() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-light text-center mb-16"
        >
          Keep up with all the latest on our socials!
        </motion.h2>

        {/* Social Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg"
            >
              {/* Stacked Images */}
              <div className="absolute inset-0">
                {social.images.map((img, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={img}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                    style={{ 
                      opacity: imgIndex === 0 ? 1 : 0,
                      zIndex: imgIndex 
                    }}
                  />
                ))}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-4xl md:text-5xl font-black mb-2">{social.short}</span>
                <div className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}