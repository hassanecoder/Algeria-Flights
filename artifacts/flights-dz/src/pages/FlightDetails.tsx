import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useGetFlightById, useCreateBooking } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader2, ArrowRight, CheckCircle2, AlertCircle, Plane, Clock, ShieldCheck, Armchair } from "lucide-react";
import { format } from "date-fns";
import { formatDZD, formatDuration, cn } from "@/lib/utils";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Frontend schema matching the OpenAPI schema
const passengerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  nationality: z.string().min(2, "Nationality is required"),
  gender: z.enum(["male", "female"]),
  passportNumber: z.string().optional(),
  seatNumber: z.string().optional(),
});

const bookingSchema = z.object({
  cabinClass: z.enum(["economy", "business"]),
  contactEmail: z.string().email("Invalid email"),
  contactPhone: z.string().min(8, "Phone number required"),
  passengers: z.array(passengerSchema),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function FlightDetails() {
  const [, params] = useRoute("/flights/:id");
  const flightId = params?.id || "";
  const [location, setLocation] = useLocation();
  
  const searchParams = new URLSearchParams(window.location.search);
  const paxCount = Number(searchParams.get("pax")) || 1;

  const { data: flight, isLoading, isError } = useGetFlightById(flightId);
  const { mutate: createBooking, isPending: isBooking } = useCreateBooking();

  const [cabinClass, setCabinClass] = useState<"economy" | "business">("economy");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const { register, handleSubmit, control, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      cabinClass: "economy",
      contactEmail: "",
      contactPhone: "",
      passengers: Array(paxCount).fill({ firstName: "", lastName: "", nationality: "", gender: "male" }),
    }
  });

  const { fields } = useFieldArray({ control, name: "passengers" });

  const toggleSeat = (seatNum: string) => {
    if (selectedSeats.includes(seatNum)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatNum));
    } else {
      if (selectedSeats.length < paxCount) {
        setSelectedSeats(prev => [...prev, seatNum]);
      }
    }
  };

  const onSubmit = (data: BookingFormValues) => {
    if (!flight) return;

    // Assign seats to passengers if selected
    const passengersWithSeats = data.passengers.map((p, i) => ({
      ...p,
      seatNumber: selectedSeats[i] || undefined
    }));

    const totalAmount = paxCount * (cabinClass === "economy" ? flight.priceEconomy : flight.priceBusiness);

    createBooking({
      data: {
        flightId: flight.id,
        cabinClass,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        passengers: passengersWithSeats,
        totalAmount
      }
    }, {
      onSuccess: (res) => {
        setLocation(`/bookings/confirmation/${res.id}`);
      }
    });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );

  if (isError || !flight) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Flight Not Found</h2>
        <button onClick={() => setLocation("/")} className="mt-4 text-primary hover:underline">Return Home</button>
      </div>
    </div>
  );

  const pricePerPax = cabinClass === "economy" ? flight.priceEconomy : flight.priceBusiness;
  const totalAmount = pricePerPax * paxCount;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-primary pt-28 pb-20 text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 flex items-center gap-4">
              {flight.originCity} <ArrowRight className="w-8 h-8 opacity-70" /> {flight.destinationCity}
            </h1>
            <p className="text-white/80 text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" /> 
              {format(new Date(flight.departureTime), "EEEE, MMMM dd, yyyy")}
              <span className="mx-2">•</span>
              <Plane className="w-5 h-5" />
              {flight.airline} {flight.flightNumber}
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-white/70 mb-1 text-sm uppercase tracking-wider font-bold">Total Price</p>
            <p className="text-4xl font-bold text-accent">{formatDZD(totalAmount)}</p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Flight Summary Card */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
                <Plane className="w-6 h-6 text-primary" /> Flight Itinerary
              </h2>
              
              <div className="flex justify-between items-center bg-secondary/30 p-6 rounded-2xl">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">{format(new Date(flight.departureTime), "HH:mm")}</p>
                  <p className="text-lg font-semibold text-primary">{flight.origin}</p>
                  <p className="text-sm text-muted-foreground">{flight.originCity}</p>
                </div>

                <div className="flex-1 px-8 flex flex-col items-center relative">
                  <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {formatDuration(flight.duration)}
                  </p>
                  <div className="w-full h-0.5 bg-border relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-primary rounded-full flex items-center justify-center">
                      <Plane className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-accent uppercase tracking-wider mt-2">
                    {flight.stops === 0 ? "Direct" : `${flight.stops} Stop`}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">{format(new Date(flight.arrivalTime), "HH:mm")}</p>
                  <p className="text-lg font-semibold text-primary">{flight.destination}</p>
                  <p className="text-sm text-muted-foreground">{flight.destinationCity}</p>
                </div>
              </div>
            </section>

            {/* Cabin Class Selection */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Armchair className="w-6 h-6 text-primary" /> Cabin Class
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setCabinClass("economy")}
                  className={cn(
                    "cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200",
                    cabinClass === "economy" ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-foreground">Economy</h3>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", cabinClass === "economy" ? "border-primary" : "border-muted-foreground")}>
                      {cabinClass === "economy" && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary mb-2">{formatDZD(flight.priceEconomy)} <span className="text-sm text-muted-foreground font-normal">/pax</span></p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 1 Cabin Bag (10kg)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 1 Checked Bag (23kg)</li>
                  </ul>
                </div>

                <div 
                  onClick={() => setCabinClass("business")}
                  className={cn(
                    "cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200",
                    cabinClass === "business" ? "border-accent bg-accent/5 shadow-md" : "border-border hover:border-accent/50"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-foreground">Business</h3>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", cabinClass === "business" ? "border-accent" : "border-muted-foreground")}>
                      {cabinClass === "business" && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-accent mb-2">{formatDZD(flight.priceBusiness)} <span className="text-sm text-muted-foreground font-normal">/pax</span></p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 2 Cabin Bags</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 2 Checked Bags (32kg)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Lounge Access</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Seat Selection (Visual Mockup for functionality) */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Select Seats</h2>
                <p className="text-sm font-semibold text-primary">{selectedSeats.length} / {paxCount} Selected</p>
              </div>
              
              <div className="bg-secondary/20 rounded-2xl p-8 flex justify-center overflow-x-auto">
                <div className="bg-white p-4 rounded-full shadow-inner border border-border inline-block min-w-[300px]">
                  {/* Fake Seat Grid */}
                  <div className="flex flex-col gap-3">
                    {["1", "2", "3", "4", "5", "6"].map(row => (
                      <div key={row} className="flex gap-8 items-center justify-center">
                        <div className="flex gap-2">
                          {["A", "B", "C"].map(col => {
                            const seatId = `${row}${col}`;
                            const isSelected = selectedSeats.includes(seatId);
                            // Mocking some occupied seats
                            const isOccupied = seatId === "2B" || seatId === "3A" || seatId === "5C";
                            
                            return (
                              <button
                                key={seatId}
                                type="button"
                                disabled={isOccupied}
                                onClick={() => toggleSeat(seatId)}
                                className={cn(
                                  "w-10 h-10 rounded-t-xl rounded-b-md flex items-center justify-center text-xs font-bold transition-all",
                                  isOccupied ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" :
                                  isSelected ? "bg-accent text-white shadow-md -translate-y-1" :
                                  "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                )}
                              >
                                {seatId}
                              </button>
                            );
                          })}
                        </div>
                        <div className="w-6 text-center text-xs font-bold text-muted-foreground">{row}</div>
                        <div className="flex gap-2">
                          {["D", "E", "F"].map(col => {
                            const seatId = `${row}${col}`;
                            const isSelected = selectedSeats.includes(seatId);
                            const isOccupied = seatId === "1D" || seatId === "4E" || seatId === "6F";
                            
                            return (
                              <button
                                key={seatId}
                                type="button"
                                disabled={isOccupied}
                                onClick={() => toggleSeat(seatId)}
                                className={cn(
                                  "w-10 h-10 rounded-t-xl rounded-b-md flex items-center justify-center text-xs font-bold transition-all",
                                  isOccupied ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" :
                                  isSelected ? "bg-accent text-white shadow-md -translate-y-1" :
                                  "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                )}
                              >
                                {seatId}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Passenger Details */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Passenger Details</h2>
              
              {fields.map((field, index) => (
                <div key={field.id} className={cn("mb-8 pb-8", index !== fields.length - 1 && "border-b border-border")}>
                  <h3 className="font-bold text-lg mb-4 text-primary">Passenger {index + 1} {selectedSeats[index] && <span className="ml-2 text-sm bg-accent/10 text-accent px-2 py-1 rounded">Seat {selectedSeats[index]}</span>}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">First Name</label>
                      <input {...register(`passengers.${index}.firstName`)} className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors" placeholder="e.g. Karim" />
                      {errors.passengers?.[index]?.firstName && <p className="text-destructive text-xs mt-1">{errors.passengers[index]?.firstName?.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Last Name</label>
                      <input {...register(`passengers.${index}.lastName`)} className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors" placeholder="e.g. Benali" />
                      {errors.passengers?.[index]?.lastName && <p className="text-destructive text-xs mt-1">{errors.passengers[index]?.lastName?.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Nationality</label>
                      <input {...register(`passengers.${index}.nationality`)} className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors" placeholder="e.g. Algerian" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Gender</label>
                      <select {...register(`passengers.${index}.gender`)} className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors bg-white">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Passport Number (Optional)</label>
                      <input {...register(`passengers.${index}.passportNumber`)} className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors" placeholder="Required for international flights" />
                    </div>
                  </div>
                </div>
              ))}
            </section>

          </div>

          {/* Right Column - Summary & Contact */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Contact Details */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-border sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-foreground">Contact Details</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Email</label>
                  <input {...register("contactEmail")} type="email" className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors" placeholder="booking@example.com" />
                  {errors.contactEmail && <p className="text-destructive text-xs mt-1">{errors.contactEmail.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Phone Number</label>
                  <input {...register("contactPhone")} type="tel" className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors" placeholder="+213 555 000 000" />
                  {errors.contactPhone && <p className="text-destructive text-xs mt-1">{errors.contactPhone.message}</p>}
                </div>
              </div>

              <div className="border-t border-border pt-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">Price Summary</h3>
                <div className="space-y-3 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Ticket ({paxCount}x)</span>
                    <span className="font-semibold">{formatDZD(pricePerPax * paxCount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span className="font-semibold">{formatDZD(1500 * paxCount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary pt-3 border-t border-border mt-3">
                    <span>Total</span>
                    <span>{formatDZD(totalAmount + (1500 * paxCount))}</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isBooking}
                className="w-full py-4 bg-accent text-white rounded-xl font-bold text-lg hover:bg-accent/90 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isBooking ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {isBooking ? "Processing..." : "Confirm & Book"}
              </button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By booking, you agree to our Terms & Conditions.
              </p>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
