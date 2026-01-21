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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent ? "bg-transparent" : "glass-header border-b border-[#0D1B2A]/5"
      }`}
      data-testid="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="navbar-logo">
            <div className="flex flex-col">
              <span className={`font-heading text-2xl font-bold tracking-tight ${transparent ? "text-white" : "text-[#0D1B2A]"}`}>
                EHSAS
              </span>
              <span className={`text-[10px] font-medium tracking-[0.2em] uppercase ${transparent ? "text-white/70" : "text-[#778DA9]"}`}>
                Alumni Society
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => scrollToSection(e, link.path)}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                  transparent ? "text-white/90 hover:text-white" : "text-[#0D1B2A] hover:text-[#6B0F1A]"
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
              <Button className={`rounded-none text-sm tracking-wider px-8 py-5 font-medium transition-all duration-300 ${
                transparent 
                  ? "bg-white text-[#0D1B2A] hover:bg-white/90" 
                  : "bg-[#0D1B2A] text-white hover:bg-[#1B263B]"
              }`}>
                Join EHSAS
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-btn"
          >
            {isOpen ? (
              <X className={transparent ? "text-white" : "text-[#0D1B2A]"} size={24} />
            ) : (
              <Menu className={transparent ? "text-white" : "text-[#0D1B2A]"} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-[#0D1B2A]/5 py-4" data-testid="mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => scrollToSection(e, link.path)}
                className="block px-4 py-3 text-[#0D1B2A] font-medium hover:bg-[#FAFAF8]"
              >
                {link.name}
              </Link>
            ))}
            <div className="px-4 pt-4">
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button className="bg-[#0D1B2A] text-white hover:bg-[#1B263B] rounded-none w-full">
                  Join EHSAS
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
