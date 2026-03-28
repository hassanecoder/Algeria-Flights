import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useListBookings, useCancelBooking } from "@workspace/api-client-react";
import { format } from "date-fns";
import { formatDZD, cn } from "@/lib/utils";
import { Plane, AlertCircle, Loader2, Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListBookingsQueryKey } from "@workspace/api-client-react";

export default function MyBookings() {
  const { data: bookings, isLoading } = useListBookings();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  const queryClient = useQueryClient();

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      cancelBooking(
        { bookingId: id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
          }
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="bg-primary pt-32 pb-16 text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Bookings</h1>
          <p className="text-white/80 text-lg">Manage your upcoming and past flights.</p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : bookings?.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-border shadow-sm">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No bookings yet</h2>
            <p className="text-muted-foreground mb-8">You haven't made any flight bookings. Start exploring Algeria today!</p>
            <a href="/" className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
              Search Flights
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings?.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col md:flex-row gap-6 items-center justify-between hover:shadow-md transition-shadow">
                
                <div className="w-full md:w-auto flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Plane className="w-8 h-8 text-primary -rotate-45" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ref: {booking.bookingReference}</span>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase",
                        booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                        booking.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                        "bg-orange-100 text-orange-700"
                      )}>
                        {booking.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-foreground mb-1">
                      {booking.flight?.originCity} to {booking.flight?.destinationCity}
                    </h3>
                    {booking.flight && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {format(new Date(booking.flight.departureTime), "MMM dd, yyyy")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col md:items-end gap-3 border-t md:border-t-0 border-border pt-4 md:pt-0">
                  <div className="flex justify-between md:flex-col md:items-end w-full">
                     <span className="text-sm text-muted-foreground font-semibold md:hidden">Total</span>
                     <p className="text-2xl font-bold text-foreground">{formatDZD(booking.totalAmount)}</p>
                  </div>
                  
                  {booking.status === "confirmed" && (
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      disabled={isCancelling}
                      className="px-6 py-2 text-sm font-bold text-destructive bg-destructive/10 hover:bg-destructive hover:text-white rounded-lg transition-colors w-full md:w-auto disabled:opacity-50"
                    >
                      {isCancelling ? "Cancelling..." : "Cancel Booking"}
                    </button>
                  )}
                  {booking.status === "cancelled" && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <AlertCircle className="w-4 h-4" /> Cancelled
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
