import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, Clock, MapPin, Users, Share2, Heart, 
  ArrowLeft, CheckCircle, Edit, Trash2
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { eventService, authService } from "@/services/api";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRsvped, setIsRsvped] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  
  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    setIsLoading(true);
    try {
      const data = await eventService.getEventById(id!);
      setEvent(data);
      
      // Check if current user has RSVPed and is organizer
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setIsRsvped(data.attendees.some((a: any) => a._id === currentUser.id));
        setIsOrganizer(data.organizer._id === currentUser.id);
      }
    } catch (error: any) {
      toast.error("Failed to load event");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRsvp = async () => {
    if (!authService.isAuthenticated()) {
      toast.error("Please login to RSVP");
      navigate("/login");
      return;
    }

    try {
      if (isRsvped) {
        await eventService.cancelRsvp(id!);
        toast.info("You've cancelled your RSVP.");
        setIsRsvped(false);
      } else {
        await eventService.rsvpEvent(id!);
        toast.success("You're in! See you at the event.");
        setIsRsvped(true);
      }
      loadEvent(); // Reload to update attendee count
    } catch (error: any) {
      const message = error.response?.data?.message || "RSVP failed";
      toast.error(message);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      await eventService.deleteEvent(id!);
      toast.success("Event deleted successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-secondary rounded-xl"></div>
            <div className="h-10 bg-secondary rounded w-3/4"></div>
            <div className="h-40 bg-secondary rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!event) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const spotsLeft = event.capacity - event.attendees.length;
  const isFull = spotsLeft <= 0;
  const progressPercent = (event.attendees.length / event.capacity) * 100;

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Image */}
        <div className="relative h-[40vh] md:h-[50vh]">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Button variant="secondary" size="sm" asChild className="gap-2">
              <Link to="/events">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </Button>
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            {isOrganizer && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => navigate(`/events/edit/${id}`)}
                  title="Edit Event"
                >
                  <Edit className="w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleDelete}
                  title="Delete Event"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </>
            )}
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current text-destructive" : ""}`} />
            </Button>
            <Button variant="secondary" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <Badge className="mb-4">{event.category}</Badge>
              
              {isOrganizer && (
                <Badge variant="outline" className="mb-4 ml-2 bg-primary/10 text-primary border-primary">
                  You're the organizer
                </Badge>
              )}
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {event.title}
              </h1>

              {/* Event Meta */}
              <div className="flex flex-wrap gap-4 mb-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{event.location}</span>
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-secondary/50">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.organizer.name}`}
                  alt={event.organizer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-muted-foreground">Organized by</p>
                  <p className="font-semibold text-foreground">{event.organizer.name}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  About This Event
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {/* Location Map Placeholder */}
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Location
                </h2>
                <div className="aspect-video rounded-xl bg-secondary/50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="sticky top-24 bg-card rounded-2xl border border-border/50 p-6">
                {/* Organizer Actions */}
                {isOrganizer && (
                  <div className="mb-6 pb-6 border-b border-border/50">
                    <p className="text-sm text-muted-foreground mb-3">Manage Event</p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => navigate(`/events/edit/${id}`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Event
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={handleDelete}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Event
                      </Button>
                    </div>
                  </div>
                )}

                {/* Capacity */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Capacity</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {event.attendees.length} / {event.capacity}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        isFull ? "bg-destructive" : "gradient-primary"
                      }`}
                    />
                  </div>
                  
                  <p className={`text-sm mt-2 ${isFull ? "text-destructive" : "text-muted-foreground"}`}>
                    {isFull ? "No spots left" : `${spotsLeft} spots remaining`}
                  </p>
                </div>

                {/* RSVP Button - Don't show if organizer */}
                {!isOrganizer && (
                  <>
                    <Button
                      variant={isRsvped ? "success" : "hero"}
                      size="lg"
                      className="w-full mb-4"
                      onClick={handleRsvp}
                      disabled={isFull && !isRsvped}
                    >
                      {isRsvped ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          You're Going!
                        </>
                      ) : isFull ? (
                        "Event Full"
                      ) : (
                        "RSVP Now"
                      )}
                    </Button>

                    {isRsvped && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground"
                        onClick={handleRsvp}
                      >
                        Cancel RSVP
                      </Button>
                    )}
                  </>
                )}

                {/* Quick Info */}
                <div className="mt-6 pt-6 border-t border-border/50 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium text-foreground">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground text-sm">{event.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}