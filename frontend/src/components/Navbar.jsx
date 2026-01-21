import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = ({ transparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/#about" },
    { name: "Spotlight", path: "/#spotlight" },
    { name: "Events", path: "/#events" },
    { name: "Give Back", path: "/#giveback" },
    { name: "Directory", path: "/directory" },
  ];

  const scrollToSection = (e, path) => {
    if (path.startsWith("/#")) {
      e.preventDefault();
      const sectionId = path.replace("/#", "");
      if (location.pathname !== "/") {
        window.location.href = path;
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent ? "bg-transparent" : "glass-header border-b border-[#1A2A4A]/10"
      }`}
      data-testid="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="navbar-logo">
            <div className="flex flex-col">
              <span className={`font-heading text-2xl font-bold tracking-tight ${transparent ? "text-white" : "text-[#1A2A4A]"}`}>
                EHSAS
              </span>
              <span className={`text-xs font-medium tracking-widest uppercase ${transparent ? "text-[#C9A227]" : "text-[#C9A227]"}`}>
                Est. Alumni Society
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => scrollToSection(e, link.path)}
                className={`nav-link text-sm font-medium ${
                  transparent ? "text-white/90 hover:text-white" : "text-[#1A2A4A]"
                }`}
                data-testid={`nav-link-${link.name.toLowerCase().replace(" ", "-")}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/register" data-testid="nav-join-btn">
              <Button className="btn-gold rounded-sm">Join EHSAS</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-btn"
          >
            {isOpen ? (
              <X className={transparent ? "text-white" : "text-[#1A2A4A]"} size={24} />
            ) : (
              <Menu className={transparent ? "text-white" : "text-[#1A2A4A]"} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-[#1A2A4A]/10 py-4" data-testid="mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => scrollToSection(e, link.path)}
                className="block px-4 py-3 text-[#1A2A4A] font-medium hover:bg-[#F9F7F1]"
              >
                {link.name}
              </Link>
            ))}
            <div className="px-4 pt-4">
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button className="btn-gold rounded-sm w-full">Join EHSAS</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
