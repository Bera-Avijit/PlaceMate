import React from "react";
import { Mail, Linkedin, Twitter, Github, MapPin, Phone } from "lucide-react";

const FooterSection = () => (
  <footer className="bg-black border-t border-white/8">
    {/* Main Footer Content */}
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-white tracking-tight">PlaceMate</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            AI-powered placement preparation for students and early-career professionals. Master interviews, land offers, succeed.
          </p>
          <div className="pt-4 flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Product Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#features" className="text-slate-400 hover:text-amber-400 transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">
                Pricing Plans
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">
                Roadmap
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">
                Updates & Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Company Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#about" className="text-slate-400 hover:text-amber-400 transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">
                Press & Media
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest">Support</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Mail size={16} className="text-amber-500 mt-1 flex-shrink-0" />
              <a href="mailto:placemate.support@gmail.com" className="text-slate-400 hover:text-amber-400 transition-colors">
                placemate.support@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="text-amber-500 mt-1 flex-shrink-0" />
              <a href="tel:+919876543210" className="text-slate-400 hover:text-amber-400 transition-colors">
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-amber-500 mt-1 flex-shrink-0" />
              <span className="text-slate-400">
                HIT, Haldia, India
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/8" />

      {/* Bottom Section */}
      <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Legal Links */}
        <div className="flex flex-wrap gap-4 md:gap-6 text-xs">
          <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">
            Cookie Policy
          </a>
          <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">
            Compliance
          </a>
        </div>

        {/* Copyright */}
        <div className="text-right">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} PlaceMate AI. All rights reserved. | v1.0.0
          </p>
        </div>
      </div>
    </div>

    {/* Minimal top bar */}
    <div className="bg-gradient-to-r from-amber-500/5 to-transparent border-t border-amber-500/10 px-6 lg:px-10 py-4">
      <p className="text-xs text-slate-500 text-center max-w-4xl mx-auto">
        PlaceMate is a product of PlaceMate AI Inc. We're committed to ethical AI and transparent practices in placement preparation.
      </p>
    </div>
  </footer>
);

export default FooterSection;
