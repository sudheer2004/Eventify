import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plus, Calendar, Users, Ticket, 
  Edit, Trash2, MoreVertical 
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { eventService, authService } from "@/services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [myCreatedEvents, setMyCreatedEvents] = useState<any[]>([]);
  const [myAttendingEvents, setMyAttendingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    eventsCreated: 0,
    eventsAttending: 0,
    totalAttendees: 0
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }
    loadUserEvents();
  }, [navigate]);

  const loadUserEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventService.getUserEvents();
      setMyCreatedEvents(data.created || []);
      setMyAttendingEvents(data.attending || []);
      
      // Calculate stats
      const totalAttendees = data.created.reduce((sum: number, event: any) => 
        sum + event.attendees.length, 0
      );
      
      setStats({
        eventsCreated: data.created.length,
        eventsAttending: data.attending.length,
        totalAttendees
      });
    } catch (error: any) {
      toast.error("Failed to load events");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await eventService.deleteEvent(id);
      toast.success("Event deleted successfully");
      loadUserEvents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  const handleCancelRsvp = async (id: string) => {
    try {
      await eventService.cancelRsvp(id);
      toast.success("RSVP cancelled successfully");
      loadUserEvents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel RSVP");
    }
  };

  const statsConfig = [
    { label: "Events Created", value: stats.eventsCreated, icon: Calendar, color: "text-primary" },
    { label: "Events Attending", value: stats.eventsAttending, icon: Ticket, color: "text-accent" },
    { label: "Total Attendees", value: stats.totalAttendees, icon: Users, color: "text-success" },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-20 bg-secondary rounded-xl"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-secondary rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                My Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your events and RSVPs
              </p>
            </div>
            <Button variant="hero" asChild>
              <Link to="/events/create">
                <Plus className="w-5 h-5" />
                Create Event
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            {statsConfig.map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-2xl border border-border/50 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <p className="font-display text-3xl font-bold text-foreground">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="created" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="created" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  My Events
                </TabsTrigger>
                <TabsTrigger value="attending" className="gap-2">
                  <Ticket className="w-4 h-4" />
                  Attending
                </TabsTrigger>
              </TabsList>

              <TabsContent value="created">
                {myCreatedEvents.length > 0 ? (
                  <div className="space-y-4">
                    {myCreatedEvents.map((event, index) => (
                      <EventListItem
                        key={event._id}
                        event={event}
                        index={index}
                        onDelete={handleDeleteEvent}
                        showActions
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No events created yet"
                    description="Create your first event and start building your community"
                    action={
                      <Button variant="hero" asChild>
                        <Link to="/events/create">
                          <Plus className="w-5 h-5" />
                          Create Event
                        </Link>
                      </Button>
                    }
                  />
                )}
              </TabsContent>

              <TabsContent value="attending">
                {myAttendingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {myAttendingEvents.map((event, index) => (
                      <EventListItem
                        key={event._id}
                        event={event}
                        index={index}
                        onCancelRsvp={handleCancelRsvp}
                        isAttending
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Not attending any events"
                    description="Browse events and RSVP to start building your calendar"
                    action={
                      <Button variant="hero" asChild>
                        <Link to="/events">
                          Browse Events
                        </Link>
                      </Button>
                    }
                  />
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

function EventListItem({ 
  event, 
  index, 
  onDelete, 
  onCancelRsvp,
  showActions = false,
  isAttending = false
}: any) {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or dropdown
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="menuitem"]')) {
      return;
    }
    navigate(`/events/${event._id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/events/edit/${event._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={handleCardClick}
      className="bg-card rounded-xl border border-border/50 p-4 flex flex-col md:flex-row gap-4 cursor-pointer hover:border-primary/50 transition-colors"
    >
      {/* Image */}
      <div className="w-full md:w-48 aspect-video md:aspect-square rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Badge className={isAttending ? "mb-2 bg-success/10 text-success border-0" : "mb-2"}>
              {isAttending ? "Attending" : event.category}
            </Badge>
            <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
              {event.title}
            </h3>
            {!isAttending && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {event.description}
              </p>
            )}
          </div>
          
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(event._id);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {event.attendees.length} {isAttending ? "attending" : `/ ${event.capacity}`}
          </span>
        </div>

        {!isAttending && (
          <div className="mt-4">
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full gradient-primary rounded-full"
                style={{ width: `${(event.attendees.length / event.capacity) * 100}%` }}
              />
            </div>
          </div>
        )}

        {isAttending && (
          <div className="flex items-center gap-2 mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onCancelRsvp(event._id);
              }}
            >
              Cancel RSVP
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="text-center py-16 bg-secondary/30 rounded-2xl">
      <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
        <Calendar className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {action}
    </div>
  );
}