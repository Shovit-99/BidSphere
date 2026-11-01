import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#14171A] text-[#7C828D] pt-16 pb-10 border-t border-[#2A2E38]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D95A2B]">
                <svg viewBox="0 0 40 40" className="w-5 h-5 fill-[#D95A2B]">
                  <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" fill="none" stroke="#D95A2B" strokeWidth="3" />
                  <polygon points="20,9 31,16 31,24 20,31 9,24 9,16" fill="#D95A2B" opacity="0.9" />
                </svg>
              </div>
              <span className="text-white font-serif font-black text-xl tracking-tight">
                BID<span className="text-[#D95A2B]">SPHERE</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed max-w-sm text-[#7C828D]">
              International Heritage Auction House &amp; Editorial Marketplace. Physical microscopic provenance verification, sub-15ms live streaming, and guaranteed escrow settlements.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#globe" onClick={(e) => e.preventDefault()} className="p-2 rounded-full bg-white/5 hover:bg-[#D95A2B] text-slate-300 hover:text-white transition-colors">
                <Globe size={15} />
              </a>
              <a href="#share" onClick={(e) => e.preventDefault()} className="p-2 rounded-full bg-white/5 hover:bg-[#D95A2B] text-slate-300 hover:text-white transition-colors">
                <Share2 size={15} />
              </a>
              <a href="#contact" onClick={(e) => e.preventDefault()} className="p-2 rounded-full bg-white/5 hover:bg-[#D95A2B] text-slate-300 hover:text-white transition-colors">
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h5 className="font-serif font-bold text-white text-sm mb-4">The Catalog</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/auctions" className="hover:text-[#D95A2B] transition-colors">Browse All Lots</Link></li>
              <li><Link to="/auctions?category=Luxury%20Watches" className="hover:text-[#D95A2B] transition-colors">Haute Horlogerie</Link></li>
              <li><Link to="/auctions?category=Heritage%20%26%20Classic%20Cars" className="hover:text-[#D95A2B] transition-colors">Supercars &amp; Classics</Link></li>
              <li><Link to="/auctions?category=Modern%20%26%20Fine%20Art" className="hover:text-[#D95A2B] transition-colors">Fine Art Canvases</Link></li>
              <li><a href="#how-it-works" className="hover:text-[#D95A2B] transition-colors">How Bidding Works</a></li>
            </ul>
          </div>

          {/* Member Portal */}
          <div>
            <h5 className="font-serif font-bold text-white text-sm mb-4">Membership</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/login" className="hover:text-[#D95A2B] transition-colors">Collector Sign In</Link></li>
              <li><Link to="/register" className="hover:text-[#D95A2B] transition-colors">Consignor Application</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#D95A2B] transition-colors">Collector Dashboard</Link></li>
              <li><Link to="/dashboard/won" className="hover:text-[#D95A2B] transition-colors">Escrow Settlements</Link></li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h5 className="font-serif font-bold text-white text-sm mb-4">Provenance &amp; Trust</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><a href="#authenticity" onClick={(e) => e.preventDefault()} className="hover:text-[#D95A2B] transition-colors">Title &amp; Authenticity</a></li>
              <li><a href="#anti-snipe" onClick={(e) => e.preventDefault()} className="hover:text-[#D95A2B] transition-colors">Anti-Snipe Rules</a></li>
              <li><a href="#escrow" onClick={(e) => e.preventDefault()} className="hover:text-[#D95A2B] transition-colors">Escrow Protection</a></li>
              <li><a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#D95A2B] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Hairline Divider & Bottom Bar */}
        <div className="pt-8 border-t border-[#2A2E38] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-[#7C828D]">
            © {new Date().getFullYear()} BidSphere International Auctioneers. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[#7C828D]">
            <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse" />
            <span>STOMP Encrypted Telemetry Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
