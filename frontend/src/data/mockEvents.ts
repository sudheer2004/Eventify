import { Event } from "@/components/events/EventCard";

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Innovators Summit 2025",
    description: "Join industry leaders and innovators for a day of inspiring talks, networking, and hands-on workshops exploring the future of technology.",
    date: "Jan 15, 2025",
    time: "9:00 AM",
    location: "San Francisco Convention Center",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    capacity: 500,
    attendees: 423,
    category: "Technology",
    organizer: {
      name: "Tech Events Co",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
    }
  },
  {
    id: "2",
    title: "Sunset Yoga & Meditation Retreat",
    description: "Reconnect with yourself through guided yoga sessions, meditation practices, and mindfulness workshops in a serene outdoor setting.",
    date: "Jan 20, 2025",
    time: "5:00 PM",
    location: "Malibu Beach Resort",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
    capacity: 50,
    attendees: 48,
    category: "Wellness",
    organizer: {
      name: "Zen Studio",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
    }
  },
  {
    id: "3",
    title: "Indie Music Festival",
    description: "Experience three days of incredible indie music featuring emerging artists from around the world. Food trucks, art installations, and good vibes guaranteed.",
    date: "Feb 1-3, 2025",
    time: "12:00 PM",
    location: "Austin Music Park",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    capacity: 2000,
    attendees: 1567,
    category: "Music",
    organizer: {
      name: "Indie Collective",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
    }
  },
  {
    id: "4",
    title: "Startup Pitch Night",
    description: "Watch 10 innovative startups pitch their ideas to a panel of investors. Network with founders, investors, and fellow entrepreneurs.",
    date: "Jan 25, 2025",
    time: "6:30 PM",
    location: "WeWork Downtown LA",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
    capacity: 150,
    attendees: 150,
    category: "Business",
    organizer: {
      name: "Startup Hub",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80"
    }
  },
  {
    id: "5",
    title: "Gourmet Food & Wine Tasting",
    description: "Savor exquisite dishes from renowned chefs paired with premium wines from local vineyards. An evening of culinary excellence.",
    date: "Feb 14, 2025",
    time: "7:00 PM",
    location: "Napa Valley Estates",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    capacity: 80,
    attendees: 65,
    category: "Food & Drink",
    organizer: {
      name: "Culinary Arts Society",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&q=80"
    }
  },
  {
    id: "6",
    title: "AI & Machine Learning Workshop",
    description: "Hands-on workshop covering the latest in AI and ML. Build real projects, learn from experts, and take your skills to the next level.",
    date: "Feb 8, 2025",
    time: "10:00 AM",
    location: "Google Campus, Mountain View",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    capacity: 100,
    attendees: 89,
    category: "Technology",
    organizer: {
      name: "AI Academy",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80"
    }
  }
];

export const categories = [
  "All",
  "Technology",
  "Music",
  "Business",
  "Wellness",
  "Food & Drink",
  "Art",
  "Sports"
];
