import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  capacity: number;
  attendees: number;
  category: string;
  organizer: {
    name: string;
    avatar: string;
  };
}

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const spotsLeft = event.capacity - event.attendees;
  const isFull = spotsLeft <= 0;
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/events/${event.id}`}>
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden hover-lift">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            
            {/* Category Badge */}
            <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-foreground border-0">
              {event.category}
            </Badge>

            {/* Capacity Badge */}
            {isFull ? (
              <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground border-0">
                Sold Out
              </Badge>
            ) : isAlmostFull ? (
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground border-0">
                {spotsLeft} spots left
              </Badge>
            ) : null}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {event.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{event.date}</span>
                <Clock className="w-4 h-4 text-primary ml-2" />
                <span>{event.time}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="line-clamp-1">{event.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>{event.attendees} / {event.capacity} attending</span>
              </div>
            </div>

            {/* Organizer & Action */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <img
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-muted-foreground">
                  {event.organizer.name}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
