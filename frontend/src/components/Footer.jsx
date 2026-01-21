import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section" data-testid="main-footer">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="font-heading text-3xl font-bold text-white mb-2">EHSAS</h3>
            <p className="font-accent italic text-[#C9A227] text-lg mb-4">
              Elden Heights School Alumni Society
            </p>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              A lifelong community of Eldenites across the world. EHSAS means "feeling" in Hindi — 
              because this platform is built on belonging, memories, and lifelong connection.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-[#C9A227] transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-[#C9A227] transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-[#C9A227] transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-[#C9A227] transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="footer-link text-sm" data-testid="footer-link-home">Home</Link>
              </li>
              <li>
                <Link to="/register" className="footer-link text-sm" data-testid="footer-link-register">Join EHSAS</Link>
              </li>
              <li>
                <Link to="/directory" className="footer-link text-sm" data-testid="footer-link-directory">Alumni Directory</Link>
              </li>
              <li>
                <a href="/#events" className="footer-link text-sm">Events & Reunions</a>
              </li>
              <li>
                <a href="/#giveback" className="footer-link text-sm">Give Back</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="footer-heading text-lg">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-[#C9A227] mt-0.5" />
                <div>
                  <p className="text-white/70 text-sm">ehsas@eldenheights.org</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-[#C9A227] mt-0.5" />
                <div>
                  <p className="text-white/70 text-sm">+91 98765 43210</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#C9A227] mt-0.5" />
                <div>
                  <p className="text-white/70 text-sm">
                    The Elden Heights School<br />
                    123 Heritage Lane<br />
                    New Delhi, India
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Admin Access */}
          <div>
            <h4 className="footer-heading text-lg">Administration</h4>
            <p className="text-white/70 text-sm mb-4">
              For alumni coordinators and school administration only.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#C9A227]/50 text-[#C9A227] text-sm font-medium hover:bg-[#C9A227]/10 transition-colors rounded-sm"
              data-testid="footer-admin-login"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © {currentYear} EHSAS - An official initiative of The Elden Heights School
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/50 text-sm hover:text-white/70 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/50 text-sm hover:text-white/70 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
