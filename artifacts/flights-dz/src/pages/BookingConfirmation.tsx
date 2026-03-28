import { useRoute, Link } from "wouter";
import { useGetBookingById } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, Download, Printer, Plane, User } from "lucide-react";
import { format } from "date-fns";
import { formatDZD } from "@/lib/utils";
import { motion } from "framer-motion";

export default function BookingConfirmation() {
  const [, params] = useRoute("/bookings/confirmation/:id");
  const bookingId = params?.id || "";

  const { data: booking, isLoading } = useGetBookingById(bookingId);

  if (isLoading || !booking) return null; // In real app add nice loading state

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-24 px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl w-full bg-white rounded-[2rem] shadow-xl border border-border overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary pt-12 pb-8 px-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-primary-foreground/80">Your e-tickets have been sent to {booking.contactEmail}</p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-border gap-4">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Booking Reference</p>
                <p className="text-3xl font-display font-bold text-foreground tracking-widest">{booking.bookingReference}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-accent">{formatDZD(booking.totalAmount)}</p>
              </div>
            </div>

            {/* Flight Brief */}
            <div className="bg-secondary/30 rounded-2xl p-6 mb-8 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Flight Itinerary</h3>
                  <p className="text-sm text-muted-foreground">{booking.cabinClass.charAt(0).toUpperCase() + booking.cabinClass.slice(1)} Class</p>
                </div>
              </div>
              
              {booking.flight && (
                <div className="flex justify-between items-center px-4">
                  <div>
                    <p className="text-2xl font-bold">{format(new Date(booking.flight.departureTime), "HH:mm")}</p>
                    <p className="font-semibold text-primary">{booking.flight.origin}</p>
                  </div>
                  <div className="flex-1 px-4 flex flex-col items-center">
                    <p className="text-xs text-muted-foreground">{format(new Date(booking.flight.departureTime), "MMM dd, yyyy")}</p>
                    <div className="w-full h-px bg-border my-2 relative">
                       <Plane className="w-4 h-4 text-border absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{format(new Date(booking.flight.arrivalTime), "HH:mm")}</p>
                    <p className="font-semibold text-primary">{booking.flight.destination}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Passengers */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Passengers
              </h3>
              <div className="grid gap-3">
                {booking.passengers.map((p, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-semibold text-foreground">{p.firstName} {p.lastName}</p>
                      <p className="text-xs text-muted-foreground">Adult • {p.nationality}</p>
                    </div>
                    {p.seatNumber && (
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-bold">
                        Seat {p.seatNumber}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <button className="flex-1 py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                <Download className="w-5 h-5" /> Download E-Ticket
              </button>
              <button className="flex-1 py-4 bg-white text-foreground border-2 border-border rounded-xl font-bold flex items-center justify-center gap-2 hover:border-primary transition-colors">
                <Printer className="w-5 h-5" /> Print Receipt
              </button>
            </div>
            
            <div className="text-center mt-6">
              <Link href="/bookings" className="text-primary font-semibold hover:underline">
                View all my bookings
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
