import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_elden-alumni/artifacts/0ansi0ti_LOGO-2.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section" data-testid="main-footer">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <img 
              src={LOGO_URL} 
              alt="EHSAS Logo" 
              className="h-20 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-white/60 text-sm leading-relaxed">
              A lifelong community of Eldenites across the world. EHSAS means "feeling" in Hindi — 
              because this platform is built on belonging, memories, and lifelong connection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading text-base">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="footer-link text-sm hover-underline" data-testid="footer-link-home">Home</Link>
              </li>
              <li>
                <Link href="/register" className="footer-link text-sm hover-underline" data-testid="footer-link-register">Join EHSAS</Link>
              </li>
              <li>
                <Link href="/directory" className="footer-link text-sm hover-underline" data-testid="footer-link-directory">Alumni Directory</Link>
              </li>
              <li>
                <a href="/#events" className="footer-link text-sm hover-underline">Events & Reunions</a>
              </li>
              <li>
                <a href="/#giveback" className="footer-link text-sm hover-underline">Give Back</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="footer-heading text-base">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-[#C9A227] mt-1" />
                <div>
                  <p className="text-white/70 text-sm">ehsas@eldenheights.org</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#C9A227] mt-1" />
                <div>
                  <p className="text-white/70 text-sm">+91 98765 43210</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#C9A227] mt-1" />
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
            <h4 className="footer-heading text-base">Administration</h4>
            <p className="text-white/50 text-sm mb-6">
              For alumni coordinators and school administration only.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#C9A227]/50 text-[#C9A227] text-sm font-medium hover:bg-[#C9A227]/10 hover:border-[#C9A227] transition-all duration-300"
              data-testid="footer-admin-login"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © {currentYear} EHSAS — An official initiative of The Elden Heights School
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-white/40 text-sm hover:text-white/60 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/40 text-sm hover:text-white/60 transition-colors">
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
