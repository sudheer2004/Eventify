import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Users, Sparkles, Shield } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/EventCard";
import { eventService } from "@/services/api";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Calendar,
    title: "Easy Event Creation",
    description: "Create and manage events in minutes with our intuitive interface.",
  },
  {
    icon: Users,
    title: "Smart RSVP System",
    description: "Manage capacity and attendees with real-time updates and notifications.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Suggestions",
    description: "Get smart recommendations for event descriptions and categories.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with real-time concurrency handling.",
  },
];

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
}

export default function Index() {
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();
      const events = response.events || [];
      
      // Get first 3 events as featured
      const featured = events.slice(0, 3).map((event: Event) => ({
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
      }));
      
      setFeaturedEvents(featured);
    } catch (error) {
      console.error("Failed to fetch featured events:", error);
      setFeaturedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Event background"
            className="w-full h-full object-cover"
          />
          {/* Reduced overlay - using gradient with less opacity */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/50 to-transparent" />
          {/* Additional subtle dark overlay for better contrast */}
          <div className="absolute inset-0 bg-slate-950/20" />
        </div>

        {/* Content */}
        <div className="container relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white drop-shadow-2xl">
                Discover Amazing Events Near You
              </span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight drop-shadow-2xl">
              Create Moments,
              <br />
              <span className="text-gradient drop-shadow-lg">Build Memories</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl drop-shadow-lg">
              The ultimate platform to discover, create, and manage events. 
              Connect with your community and make every moment count.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/events">
                  Explore Events
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero" size="xl" asChild>
                <Link to="/events/create">
                  Create Your Event
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-8 mt-12 pt-8 border-t border-border/30"
            >
              <div>
                <p className="font-display text-3xl font-bold text-foreground drop-shadow-lg">10K+</p>
                <p className="text-sm text-muted-foreground drop-shadow-md">Active Events</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-foreground drop-shadow-lg">50K+</p>
                <p className="text-sm text-muted-foreground drop-shadow-md">Happy Users</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-foreground drop-shadow-lg">100+</p>
                <p className="text-sm text-muted-foreground drop-shadow-md">Cities</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you create, manage, and grow your events effortlessly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50 hover-lift"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured Events
              </h2>
              <p className="text-muted-foreground">
                Don't miss out on these popular upcoming events
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/events">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No events available yet</p>
              <Button variant="outline" asChild>
                <Link to="/events/create">
                  Create the First Event
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          )}

          {featuredEvents.length > 0 && (
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link to="/events">
                  View All Events
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Create Your Event?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Join thousands of organizers who trust Eventify to bring their events to life.
            </p>
            <Button variant="secondary" size="xl" asChild>
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}