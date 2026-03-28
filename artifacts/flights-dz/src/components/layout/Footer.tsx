import { Plane, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Plane className="w-6 h-6 text-white stroke-[2.5px] -rotate-45" />
              </div>
              <span className="text-2xl font-display font-bold text-white">
                Dzair Flights
              </span>
            </div>
            <p className="text-primary-foreground/70 max-w-sm text-sm leading-relaxed mb-6">
              Your premium gateway to Algeria. Book domestic and international flights with ease, enjoying top-tier service and competitive prices in DZD.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-lg text-white mb-6">Explore</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Domestic Flights</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">International Routes</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Special Offers</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Destinations Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg text-white mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Manage Booking</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Baggage Info</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Dzair Flights. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
