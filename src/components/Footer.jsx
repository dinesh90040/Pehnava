
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-amber-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/pehenava-logo.jpeg" 
                alt="Pehenava Logo" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover the finest ethnic wear with cutting-edge VR/AR technology. Experience tradition meets innovation at Pehenava.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="p-2 bg-gradient-to-r from-amber-600 to-rose-600 rounded-full hover:from-amber-700 hover:to-rose-700 transition-all duration-200"
              >
                <Instagram className="h-4 w-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="p-2 bg-gradient-to-r from-amber-600 to-rose-600 rounded-full hover:from-amber-700 hover:to-rose-700 transition-all duration-200"
              >
                <Facebook className="h-4 w-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="p-2 bg-gradient-to-r from-amber-600 to-rose-600 rounded-full hover:from-amber-700 hover:to-rose-700 transition-all duration-200"
              >
                <Twitter className="h-4 w-4" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <span className="text-lg font-semibold font-playfair gradient-text">Quick Links</span>
            <div className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Marketplace', path: '/marketplace' },
                { name: 'VR Trials', path: '/vr-trials' },
                { name: 'Apply as Model', path: '/apply-model' },
                { name: 'Personal Stylist', path: '/personal-stylist' }
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <span className="text-lg font-semibold font-playfair gradient-text">Categories</span>
            <div className="space-y-3">
              {['Sarees', 'Lehengas', 'Salwar Suits', 'Kurtis', 'Accessories'].map((category) => (
                <Link
                  key={category}
                  to="/marketplace"
                  className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <span className="text-lg font-semibold font-playfair gradient-text">Contact Us</span>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-amber-400" />
                <span className="text-gray-300 text-sm">hello@pehenava.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-amber-400" />
                <span className="text-gray-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-amber-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Fashion Street<br />
                  Mumbai, Maharashtra 400001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Pehenava. All rights reserved. Made with ❤️ for ethnic fashion lovers.
            </p>
            <div className="flex space-x-6">
              <Link to="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
