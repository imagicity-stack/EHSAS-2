import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_elden-alumni/artifacts/0ansi0ti_LOGO-2.png";

export const Navbar = ({ transparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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
      if (router.pathname !== "/") {
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
        transparent ? "bg-transparent" : "glass-header border-b border-[#8B1C3A]/10"
      }`}
      data-testid="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" data-testid="navbar-logo">
            <img 
              src={LOGO_URL} 
              alt="EHSAS Logo" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={(e) => scrollToSection(e, link.path)}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                  transparent ? "text-white/90 hover:text-white" : "text-[#2D2D2D] hover:text-[#8B1C3A]"
                }`}
                data-testid={`nav-link-${link.name.toLowerCase().replace(" ", "-")}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/register" data-testid="nav-join-btn">
              <Button className={`rounded-none text-sm tracking-wider px-8 py-5 font-medium transition-all duration-300 ${
                transparent 
                  ? "bg-[#C9A227] text-[#2D2D2D] hover:bg-[#D4B84A]" 
                  : "bg-[#8B1C3A] text-white hover:bg-[#6B0F2A]"
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
              <X className={transparent ? "text-white" : "text-[#2D2D2D]"} size={24} />
            ) : (
              <Menu className={transparent ? "text-white" : "text-[#2D2D2D]"} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-[#8B1C3A]/10 py-4" data-testid="mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={(e) => scrollToSection(e, link.path)}
                className="block px-4 py-3 text-[#2D2D2D] font-medium hover:bg-[#F5F0E6]"
              >
                {link.name}
              </Link>
            ))}
            <div className="px-4 pt-4">
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="bg-[#8B1C3A] text-white hover:bg-[#6B0F2A] rounded-none w-full">
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
