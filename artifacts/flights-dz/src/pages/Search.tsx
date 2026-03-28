import { useLocation } from "wouter";
import { format } from "date-fns";
import { Plane, Clock, Filter, SlidersHorizontal, ArrowRight, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FlightSearchForm } from "@/components/FlightSearchForm";
import { useSearchFlights } from "@workspace/api-client-react";
import { formatDZD, formatDuration, cn } from "@/lib/utils";
import type { Flight, SearchFlightsTripType } from "@workspace/api-client-react";

export default function Search() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const origin = searchParams.get("origin") || "";
  const destination = searchParams.get("destination") || "";
  const departureDate = searchParams.get("departureDate") || "";
  const returnDate = searchParams.get("returnDate") || undefined;
  const passengers = Number(searchParams.get("passengers")) || 1;
  const tripType = (searchParams.get("tripType") as SearchFlightsTripType) || "one-way";

  const { data: results, isLoading, isError } = useSearchFlights({
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    tripType
  }, {
    query: {
      enabled: !!(origin && destination && departureDate),
      retry: false
    }
  });

  const FlightCard = ({ flight }: { flight: Flight }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-xl transition-all duration-300 group">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        
        {/* Airline Info */}
        <div className="flex items-center gap-4 w-full md:w-48 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
             {/* Using generated logo or generic plane if no logo url from API */}
             {flight.airlineLogo ? (
               <img src={flight.airlineLogo} alt={flight.airline} className="w-8 h-8 object-contain" />
             ) : (
               <img src={`${import.meta.env.BASE_URL}images/dzair-logo.png`} alt="Dzair" className="w-8 h-8 object-contain" />
             )}
          </div>
          <div>
            <h4 className="font-bold text-foreground">{flight.airline}</h4>
            <p className="text-xs text-muted-foreground">{flight.flightNumber} • {flight.aircraft}</p>
          </div>
        </div>

        {/* Flight Timeline */}
        <div className="flex-1 w-full flex items-center justify-between px-4 relative">
          <div className="flight-timeline" />
          
          <div className="text-center z-10 bg-white px-2">
            <p className="text-2xl font-bold text-foreground">{format(new Date(flight.departureTime), "HH:mm")}</p>
            <p className="text-sm font-semibold text-primary">{flight.origin}</p>
          </div>

          <div className="text-center z-10 bg-white px-4 flex flex-col items-center">
            <span className="text-xs font-semibold text-muted-foreground mb-1 block">
              {formatDuration(flight.duration)}
            </span>
            <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center bg-white text-primary shadow-sm group-hover:scale-110 transition-transform">
              <Plane className="w-3 h-3" />
            </div>
            <span className="text-[10px] uppercase font-bold text-accent mt-1 tracking-wider">
              {flight.stops === 0 ? "Direct" : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
            </span>
          </div>

          <div className="text-center z-10 bg-white px-2">
            <p className="text-2xl font-bold text-foreground">{format(new Date(flight.arrivalTime), "HH:mm")}</p>
            <p className="text-sm font-semibold text-primary">{flight.destination}</p>
          </div>
        </div>

        {/* Price & Action */}
        <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col items-center justify-between md:justify-center md:items-end gap-3 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
          <div className="text-left md:text-right">
            <p className="text-xs text-muted-foreground mb-1">From</p>
            <p className="text-2xl font-display font-bold text-foreground">{formatDZD(flight.priceEconomy)}</p>
          </div>
          <button 
            onClick={() => setLocation(`/flights/${flight.id}?pax=${passengers}`)}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 hover:-translate-y-0.5 shadow-md hover:shadow-xl transition-all w-full md:w-auto text-center"
          >
            Select
          </button>
        </div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="bg-primary pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FlightSearchForm compact initialValues={{
            origin, destination, departureDate, returnDate, passengers, tripType
          }} />
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-border sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Filters
              </h3>
              <button className="text-sm text-muted-foreground hover:text-primary transition-colors">Reset</button>
            </div>

            <div className="space-y-8">
              {/* Stops */}
              <div>
                <h4 className="font-semibold mb-3 text-sm text-foreground">Stops</h4>
                <div className="space-y-3">
                  {["Direct", "1 Stop", "2+ Stops"].map(stop => (
                    <label key={stop} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                         <div className="w-3 h-3 bg-primary rounded-sm hidden group-has-[:checked]:block" />
                      </div>
                      <input type="checkbox" className="hidden" defaultChecked={stop === "Direct"} />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stop}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range (Visual only for mockup) */}
              <div>
                <h4 className="font-semibold mb-3 text-sm text-foreground">Price Range</h4>
                <div className="h-2 bg-secondary rounded-full relative mb-4">
                  <div className="absolute left-0 right-1/4 h-full bg-primary rounded-full"></div>
                  <div className="absolute left-0 w-4 h-4 bg-white border-2 border-primary rounded-full top-1/2 -translate-y-1/2 shadow"></div>
                  <div className="absolute right-1/4 w-4 h-4 bg-white border-2 border-primary rounded-full top-1/2 -translate-y-1/2 shadow translate-x-1/2"></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>{formatDZD(4000)}</span>
                  <span>{formatDZD(15000)}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isLoading ? "Searching flights..." : `${results?.outbound?.length || 0} Flights found`}
              </h2>
              {origin && destination && (
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  {origin} <ArrowRight className="w-3 h-3" /> {destination}
                  <span className="w-1 h-1 rounded-full bg-border inline-block mx-1"></span>
                  {departureDate && format(new Date(departureDate), "MMM dd, yyyy")}
                </p>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
              <select className="bg-secondary/50 border-none text-sm font-semibold py-2 px-4 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                <option>Lowest Price</option>
                <option>Shortest Duration</option>
                <option>Earliest Departure</option>
              </select>
            </div>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="font-medium text-lg">Finding the best flights for you...</p>
            </div>
          )}

          {isError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-8 rounded-2xl text-center">
              <h3 className="text-lg font-bold mb-2">Error searching flights</h3>
              <p>Please try changing your search parameters.</p>
            </div>
          )}

          {!isLoading && !isError && results?.outbound?.length === 0 && (
            <div className="bg-white border border-border p-12 rounded-3xl text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                <Plane className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No flights found</h3>
              <p className="text-muted-foreground max-w-md">We couldn't find any flights matching your criteria. Try adjusting your dates or airports.</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {results?.outbound?.map(flight => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
