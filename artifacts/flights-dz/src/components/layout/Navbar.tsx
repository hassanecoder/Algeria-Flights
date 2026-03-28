import { Link, useLocation } from "wouter";
import { Plane, CalendarDays, User, Globe, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Search Flights" },
    { href: "/bookings", label: "My Bookings" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled || location !== "/"
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border/50 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Plane className="w-6 h-6 text-white stroke-[2.5px] -rotate-45" />
          </div>
          <span className={cn(
            "text-2xl font-display font-bold tracking-tight transition-colors duration-300",
            (scrolled || location !== "/") ? "text-primary" : "text-white drop-shadow-md"
          )}>
            Dzair Flights
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-semibold transition-colors duration-200 relative group",
                location === link.href 
                  ? ((scrolled || location !== "/") ? "text-accent" : "text-white")
                  : ((scrolled || location !== "/") ? "text-muted-foreground hover:text-primary" : "text-white/80 hover:text-white")
              )}
            >
              {link.label}
              {location === link.href && (
                <motion.div
                  layoutId="nav-indicator"
                  className={cn(
                    "absolute -bottom-2 left-0 right-0 h-0.5 rounded-full",
                    (scrolled || location !== "/") ? "bg-accent" : "bg-white"
                  )}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors",
            (scrolled || location !== "/") ? "text-muted-foreground hover:text-primary" : "text-white/90 hover:text-white"
          )}>
            <Globe className="w-4 h-4" />
            <span>EN | DZD</span>
          </button>
          
          <button className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200">
            Sign In
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className={cn("w-6 h-6", (scrolled || location !== "/") ? "text-primary" : "text-white")} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-b border-border p-4 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "p-3 rounded-lg text-sm font-semibold",
                  location === link.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
