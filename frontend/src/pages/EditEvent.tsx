import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Upload,
  Sparkles,
  Loader2,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

import { toast } from "sonner";
import { eventService } from "@/services/api";

const categories = [
  "Conference",
  "Workshop",
  "Meetup",
  "Webinar",
  "Social",
  "Sports",
  "Music",
  "Art",
  "Food",
  "Other",
];

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    capacity: "",
    image: null as File | null,
  });

  /* ================= LOAD EVENT ================= */
  useEffect(() => {
    if (!id) return;

    const loadEvent = async () => {
      try {
        const event = await eventService.getEventById(id);

        const eventDate = new Date(event.date);
        const date = eventDate.toISOString().split("T")[0];
        const time = eventDate.toTimeString().slice(0, 5);

        setFormData({
          title: event.title,
          description: event.description,
          date,
          time,
          location: event.location,
          category: event.category,
          capacity: event.capacity.toString(),
          image: null,
        });

        setImagePreview(event.image);
      } catch {
        toast.error("Failed to load event");
        navigate("/dashboard");
      } finally {
        setIsFetching(false);
      }
    };

    loadEvent();
  }, [id, navigate]);

  /* ================= IMAGE ================= */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((p) => ({ ...p, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ================= AI DESCRIPTION ================= */
  const generateDescription = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter event title first");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await eventService.generateDescription({
        title: formData.title,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        capacity: formData.capacity
          ? parseInt(formData.capacity)
          : undefined,
        existingDescription: formData.description,
      });

      setFormData((p) => ({ ...p, description: result.description }));
      toast.success(
        result.isEnhanced
          ? "✨ Description enhanced with AI!"
          : "✨ Description generated with AI!"
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to generate description");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ================= TIME PICKER (SAME AS CREATE) ================= */
  const setTime = (hour: string, minute: string, period: "AM" | "PM") => {
    let h = parseInt(hour);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    setFormData((p) => ({
      ...p,
      time: `${h.toString().padStart(2, "0")}:${minute}`,
    }));
  };

  const getHour12 = () => {
    if (!formData.time) return "";
    const h = parseInt(formData.time.split(":")[0]);
    return ((h % 12) || 12).toString().padStart(2, "0");
  };

  const getMinute = () => {
    if (!formData.time) return "";
    return formData.time.split(":")[1];
  };

  const getPeriod = () => {
    if (!formData.time) return "";
    return parseInt(formData.time.split(":")[0]) >= 12 ? "PM" : "AM";
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);

      const dateTime = new Date(`${formData.date}T${formData.time}`);
      fd.append("date", dateTime.toISOString());

      fd.append("location", formData.location);
      fd.append("category", formData.category);
      fd.append("capacity", formData.capacity);

      if (formData.image) fd.append("image", formData.image);

      await eventService.updateEvent(id, fd);
      toast.success("Event updated successfully!");
      navigate(`/events/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update event");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Layout>
        <div className="container py-12 text-center text-muted-foreground">
          Loading event...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container max-w-3xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold">Edit Event</h1>
            <p className="text-muted-foreground mt-2">
              Update your event details
            </p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="bg-card rounded-2xl border p-6 space-y-6">
            {/* Image */}
            <div className="space-y-2">
              <Label>Event Image</Label>
              <label className="block cursor-pointer">
                <div className="aspect-video rounded-xl overflow-hidden border-2 border-dashed">
                  <img src={imagePreview} className="w-full h-full object-cover" />
                </div>
                <input type="file" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Event Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Description *</Label>
                <Button type="button" size="sm" variant="outline" onClick={generateDescription}>
                  <Sparkles className="w-4 h-4 mr-1" />
                  {formData.description ? "Enhance" : "Generate"}
                </Button>
              </div>
              <Textarea
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            {/* Schedule */}
            <div className="rounded-xl border p-4 bg-secondary/20 space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Event Schedule
              </h3>

              {/* Date */}
              <div className="space-y-2">
                <Label>Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-12 w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.date
                        ? format(new Date(formData.date), "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <CalendarComponent
                      mode="single"
                      selected={new Date(formData.date)}
                      onSelect={(d) =>
                        setFormData((p) => ({
                          ...p,
                          date: d ? d.toISOString().split("T")[0] : "",
                          time: p.time || "09:00",
                        }))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* CUSTOM TIME PICKER */}
              <div className="space-y-2">
                <Label>Time *</Label>

                <div className="flex items-center gap-3">
                  {/* Hour */}
                  <Select
                    value={getHour12()}
                    onValueChange={(h) =>
                      setTime(h, getMinute() || "00", getPeriod() || "AM")
                    }
                  >
                    <SelectTrigger className="h-12 w-24">
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const v = (i + 1).toString().padStart(2, "0");
                        return (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <span className="text-muted-foreground">:</span>

                  {/* Minute */}
                  <Select
                    value={getMinute()}
                    onValueChange={(m) =>
                      setTime(getHour12() || "12", m, getPeriod() || "AM")
                    }
                  >
                    <SelectTrigger className="h-12 w-24">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {["00", "15", "30", "45"].map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* AM/PM */}
                  <Select
                    value={getPeriod()}
                    onValueChange={(p: "AM" | "PM") =>
                      setTime(getHour12() || "12", getMinute() || "00", p)
                    }
                  >
                    <SelectTrigger className="h-12 w-24">
                      <SelectValue placeholder="AM/PM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Stored as: {formData.time}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            {/* Category + Capacity */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Capacity *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                  <Input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Updating..." : "Update Event"}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </Layout>
  );
}
