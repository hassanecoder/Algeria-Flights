import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FlightSearchForm } from "@/components/FlightSearchForm";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, CreditCard, ChevronRight } from "lucide-react";

export default function Home() {
  const popularDestinations = [
    { city: "Algiers", code: "ALG", image: "https://images.unsplash.com/photo-1621640986064-db0937a6a438?w=800&q=80", price: "4,500" },
    { city: "Oran", code: "ORN", image: "https://images.unsplash.com/photo-1616422285623-1493b8e5c25e?w=800&q=80", price: "5,200" },
    { city: "Constantine", code: "CZL", image: "https://images.unsplash.com/photo-1596417772648-52219e26ec03?w=800&q=80", price: "4,800" },
    { city: "Tlemcen", code: "TLM", image: "https://images.unsplash.com/photo-1579294576135-231aef71a25d?w=800&q=80", price: "6,100" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-algeria.png`}
            alt="Algiers Mediterranean Coast" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-background/95 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-sm font-semibold mb-6 shadow-xl">
              Algeria's Premium Airline Booking
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Discover the Magic <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#FFB75E] to-accent">of the Mediterranean</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow-md">
              Book domestic and international flights with instant confirmation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <FlightSearchForm />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Booking</h3>
              <p className="text-muted-foreground leading-relaxed">Your data is protected with enterprise-grade security. Pay safely in DZD.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-accent flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-sm">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Confirmation</h3>
              <p className="text-muted-foreground leading-relaxed">Get your e-tickets immediately after booking. No waiting, no stress.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Payments</h3>
              <p className="text-muted-foreground leading-relaxed">Accepting local and international cards, plus CIB & Edahabia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Destinations</h2>
              <p className="text-muted-foreground text-lg">Explore the most beautiful cities in Algeria</p>
            </div>
            <button className="hidden md:flex items-center text-primary font-semibold hover:text-primary/80 transition-colors">
              View all routes <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest, i) => (
              <motion.div 
                key={dest.code}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <img src={dest.image} alt={dest.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/80 font-medium text-sm mb-1">{dest.code}</p>
                      <h3 className="text-white text-2xl font-bold">{dest.city}</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                      <span className="text-white text-sm font-bold">From {dest.price}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
