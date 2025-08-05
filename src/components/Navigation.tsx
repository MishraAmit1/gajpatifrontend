import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import logo from "../../public/logo.png"
import QuoteModal from "./QuoteModal";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  // { name: "Plant Availability", href: "/plant-availability" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="backdrop-blur-sm bg-white/75 shadow-card border-b border-platinum/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Gajpati Industries Logo"
                className="h-10 w-auto" // Adjust height and width as needed
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 text-base font-medium transition-colors duration-200",
                    location.pathname === item.href
                      ? "text-egyptian-blue border-b-2 border-amber"
                      : "text-eerie-black hover:text-egyptian-blue hover:border-b-2 hover:border-amber/50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              variant="cta"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-platinum">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block px-3 py-2 text-base font-medium transition-colors duration-200",
                  location.pathname === item.href
                    ? "text-egyptian-blue bg-amber/10"
                    : "text-eerie-black hover:text-egyptian-blue hover:bg-platinum/50"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <Button
                variant="cta"
                size="lg"
                className="w-full"
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true); // Open modal on click
                }}
              >
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      <QuoteModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </nav>
  );
};