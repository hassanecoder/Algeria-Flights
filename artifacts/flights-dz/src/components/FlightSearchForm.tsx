import { useState } from "react";
import { useLocation } from "wouter";
import { MapPin, Calendar, Users, Search, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useListAirports } from "@workspace/api-client-react";

interface SearchFormProps {
  compact?: boolean;
  initialValues?: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: number;
    tripType?: "one-way" | "round-trip";
  };
}

export function FlightSearchForm({ compact = false, initialValues }: SearchFormProps) {
  const [, setLocation] = useLocation();
  const { data: airports, isLoading: isLoadingAirports } = useListAirports();

  const [tripType, setTripType] = useState<"one-way" | "round-trip">(initialValues?.tripType || "one-way");
  const [origin, setOrigin] = useState(initialValues?.origin || "");
  const [destination, setDestination] = useState(initialValues?.destination || "");
  
  // Set default date to tomorrow if not provided
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  
  const [departureDate, setDepartureDate] = useState(initialValues?.departureDate || defaultDateStr);
  const [returnDate, setReturnDate] = useState(initialValues?.returnDate || "");
  const [passengers, setPassengers] = useState(initialValues?.passengers || 1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate) return;

    const params = new URLSearchParams();
    params.set("origin", origin);
    params.set("destination", destination);
    params.set("departureDate", departureDate);
    if (tripType === "round-trip" && returnDate) params.set("returnDate", returnDate);
    params.set("passengers", passengers.toString());
    params.set("tripType", tripType);

    setLocation(`/search?${params.toString()}`);
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <form onSubmit={handleSearch} className={cn(
      "w-full transition-all duration-500",
      compact ? "bg-white p-4 rounded-2xl shadow-sm border border-border" : "glass-panel p-6 sm:p-8 rounded-3xl relative z-10"
    )}>
      
      {/* Trip Type Selector */}
      <div className="flex gap-2 mb-6">
        {(["round-trip", "one-way"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTripType(type)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
              tripType === type 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "bg-white/50 hover:bg-white text-muted-foreground hover:text-foreground"
            )}
          >
            {type === "one-way" ? "One Way" : "Round Trip"}
          </button>
        ))}
      </div>

      <div className={cn(
        "grid gap-4 items-end",
        compact ? "grid-cols-1 md:grid-cols-6 lg:grid-cols-12" : "grid-cols-1 lg:grid-cols-12"
      )}>
        
        {/* Origin & Destination */}
        <div className={cn("relative flex flex-col md:flex-row gap-4", compact ? "md:col-span-3 lg:col-span-5" : "lg:col-span-5")}>
          <div className="flex-1 relative">
            <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider ml-1">From</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-4 bg-white/80 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none text-foreground font-medium text-lg cursor-pointer disabled:opacity-50"
                disabled={isLoadingAirports}
              >
                <option value="" disabled>Select origin</option>
                {airports?.map(a => (
                  <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <button
            type="button"
            onClick={handleSwap}
            className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1 z-10 w-10 h-10 bg-white border border-border rounded-full items-center justify-center text-primary shadow-md hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 relative">
            <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider ml-1">To</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
              </div>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-4 bg-white/80 border-2 border-transparent focus:border-accent/20 rounded-2xl outline-none focus:ring-4 focus:ring-accent/10 transition-all appearance-none text-foreground font-medium text-lg cursor-pointer disabled:opacity-50"
                disabled={isLoadingAirports}
              >
                <option value="" disabled>Select destination</option>
                {airports?.map(a => (
                  <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className={cn("grid grid-cols-2 gap-4", compact ? "md:col-span-2 lg:col-span-4" : "lg:col-span-4")}>
          <div className="relative">
            <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider ml-1">Depart</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-white/80 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all text-foreground font-medium text-base"
              />
            </div>
          </div>

          <div className={cn("relative", tripType === "one-way" && "opacity-50 pointer-events-none")}>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider ml-1">Return</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="date"
                required={tripType === "round-trip"}
                min={departureDate || new Date().toISOString().split('T')[0]}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                disabled={tripType === "one-way"}
                className="w-full pl-11 pr-4 py-4 bg-white/80 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all text-foreground font-medium text-base"
              />
            </div>
          </div>
        </div>

        {/* Passengers */}
        <div className={cn("relative", compact ? "md:col-span-1 lg:col-span-2" : "lg:col-span-2")}>
          <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider ml-1">Travelers</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full pl-11 pr-4 py-4 bg-white/80 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none text-foreground font-medium text-lg cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className={cn(compact ? "md:col-span-6 lg:col-span-1" : "lg:col-span-1")}>
          <button
            type="submit"
            className="w-full h-[60px] bg-accent hover:bg-accent/90 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-accent/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <Search className="w-6 h-6" />
            {compact && <span className="ml-2 font-bold md:hidden">Search Flights</span>}
          </button>
        </div>
      </div>
    </form>
  );
}
