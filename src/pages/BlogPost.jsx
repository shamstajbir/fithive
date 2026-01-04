import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Calendar, User, Share2, Facebook, Twitter, Linkedin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GymLoader from '@/components/GymLoader';

export default function BlogPost() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlog();
  }, []);

  const loadBlog = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const slug = urlParams.get('slug');
      
      if (!slug) {
        window.location.href = createPageUrl('Blogs');
        return;
      }

      const blogs = await base44.entities.Blog.filter({ slug, status: 'published' });
      
      if (blogs.length === 0) {
        window.location.href = createPageUrl('Blogs');
        return;
      }

      const blogPost = blogs[0];
      setBlog(blogPost);

      // Set SEO meta tags
      document.title = blogPost.meta_title || blogPost.title + ' - FitHive';
      
      if (blogPost.meta_description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = blogPost.meta_description;
      }

      if (blogPost.meta_keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.name = 'keywords';
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = blogPost.meta_keywords;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading blog:', error);
      window.location.href = createPageUrl('Blogs');
    }
  };

  const shareUrl = window.location.href;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <GymLoader message="Loading blog post..." />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link to={createPageUrl('Blogs')}>
            <Button variant="ghost" className="text-white hover:text-yellow-400 mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-full inline-block mb-6">
              {blog.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6">{blog.title}</h1>
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(blog.created_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {blog.image && (
        <section className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-[500px] object-cover"
            />
          </motion.div>
        </section>
      )}

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg max-w-none"
          >
            <div 
              dangerouslySetInnerHTML={{ __html: blog.content }}
              className="text-gray-700 leading-relaxed"
            />
          </motion.div>

          {/* Social Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">Share this article</h3>
              <div className="flex gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 text-center"
          >
            <h3 className="text-3xl font-black text-black mb-4">Ready to Transform Your Body?</h3>
            <p className="text-black/80 mb-6">Join FitHive today and start your fitness journey</p>
            <Link to={createPageUrl('Packages')}>
              <Button className="bg-black text-white hover:bg-gray-800 font-bold px-8 py-6 text-lg">
                View Our Packages →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}