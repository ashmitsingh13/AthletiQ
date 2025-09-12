"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import ScrollingBanner from "@/components/ScrollingBanner";

export default function Footer() {
  return (
    <>
      <ScrollingBanner />
      <footer className="bg-white dark:bg-black text-black dark:text-white py-12 px-6 sm:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-extrabold tracking-wide text-blue-600 dark:text-blue-400">
                AthletiQ
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              AI-powered sports & fitness platform for posture correction, safe
              training, and smarter talent assessment.
              <br />
              <span className="font-medium text-blue-500">
                Train smarter, play harder.
              </span>
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="text-lg font-bold uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><Link href="/" className="hover:text-blue-500">Home</Link></li>
              <li><Link href="/tests" className="hover:text-blue-500">Tests</Link></li>
              <li><Link href="/workout" className="hover:text-blue-500">Workout</Link></li>
              <li><Link href="/features" className="hover:text-blue-500">Features</Link></li>
              <li><Link href="/about" className="hover:text-blue-500">About</Link></li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h4 className="text-lg font-bold uppercase mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><Link href="/faq" className="hover:text-blue-500">FAQs</Link></li>
              <li><Link href="/support" className="hover:text-blue-500">Support</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-500">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-500">Terms & Conditions</Link></li>
            </ul>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h4 className="text-lg font-bold uppercase mb-4">Follow Us</h4>
            <div className="flex flex-wrap gap-4">
              <Link href="https://facebook.com" target="_blank" className="hover:text-blue-500 transition-colors">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link href="https://instagram.com" target="_blank" className="hover:text-pink-500 transition-colors">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link href="https://twitter.com" target="_blank" className="hover:text-sky-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-10 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-500">AthletiQ</span> | All Rights Reserved
        </div>
      </footer>
    </>
  );
}
