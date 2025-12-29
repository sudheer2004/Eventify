import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { eventService } from "@/services/api";
import { categories } from "@/data/mockEvents";
import { toast } from "sonner";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  capacity: number;
  attendees: string[];
  category: string;
  organizer: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all events once on mount
  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();
      console.log('Fetched events:', response.events); // Debug log
      setAllEvents(response.events || []);
    } catch (error: any) {
      console.error("Failed to fetch events:", error);
      toast.error(error.response?.data?.message || "Failed to load events");
      setAllEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering with debugging
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = 
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Fixed category matching - exact match required
    const matchesCategory = 
      selectedCategory === "All" || 
      event.category === selectedCategory;
    
    // Debug log for first event
    if (allEvents.indexOf(event) === 0) {
      console.log('Filter check:', {
        eventCategory: event.category,
        selectedCategory: selectedCategory,
        matchesCategory: matchesCategory,
        matchesSearch: matchesSearch
      });
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Discover Events
            </h1>
            <p className="text-muted-foreground">
              Find and join events that match your interests
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-card border-border/50"
                />
              </div>
              
              {/* Filter Button (Mobile) */}
              <Button variant="outline" className="lg:hidden h-12">
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => {
                    console.log('Selected category:', category); // Debug log
                    setSelectedCategory(category);
                  }}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                "Loading events..."
              ) : (
                <>
                  Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
                  {selectedCategory !== "All" && ` in ${selectedCategory}`}
                </>
              )}
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Events Grid */}
              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event, index) => (
                    <EventCard 
                      key={event._id} 
                      event={{
                        id: event._id,
                        title: event.title,
                        description: event.description,
                        date: event.date,
                        time: event.time,
                        location: event.location,
                        image: event.image,
                        capacity: event.capacity,
                        attendees: event.attendees.length,
                        category: event.category,
                        organizer: event.organizer.name,
                      }} 
                      index={index} 
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No events found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}