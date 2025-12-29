import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Upload,
  X,
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
import { eventService, authService } from "@/services/api";
import { categories } from "@/data/mockEvents";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    category: "",
  });

  /* ================= AUTH CHECK ================= */
  useState(() => {
    if (!authService.isAuthenticated()) {
      toast.error("Please login to create events");
      navigate("/login");
    }
  });

  /* ================= HELPERS ================= */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  /* ================= IMAGE ================= */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  /* ================= AI DESCRIPTION ================= */
  const generateDescription = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter an event title first");
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

      setFormData((prev) => ({
        ...prev,
        description: result.description,
      }));

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

  /* ================= TIME PICKER LOGIC ================= */
  const setTime = (hour: string, minute: string, period: "AM" | "PM") => {
    let h = parseInt(hour);

    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    const formatted = `${h.toString().padStart(2, "0")}:${minute}`;
    setFormData((prev) => ({ ...prev, time: formatted }));
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

    if (!imageFile) {
      toast.error("Please upload an event image");
      return;
    }

    setIsLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      fd.append("image", imageFile);

      const res = await eventService.createEvent(fd);
      toast.success("Event created successfully!");
      navigate(`/events/${res.event._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Create New Event
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to create your event
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl border p-6 space-y-6"
          >
            {/* Image */}
            <div className="space-y-2">
              <Label>Event Image *</Label>
              {imagePreview ? (
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-background rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed cursor-pointer bg-secondary/30">
                  <Upload className="w-10 h-10 mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload image
                  </span>
                  <input type="file" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Event Title *</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="h-12"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Description *</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={generateDescription}
                  disabled={isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  {formData.description ? "Enhance" : "Generate"}
                </Button>
              </div>
              <Textarea
                rows={6}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
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
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.date
                        ? format(new Date(formData.date), "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <CalendarComponent
                      mode="single"
                      selected={
                        formData.date
                          ? new Date(formData.date)
                          : undefined
                      }
                      onSelect={(d) =>
                        setFormData((p) => ({
                          ...p,
                          date: d ? d.toISOString().split("T")[0] : "",
                        }))
                      }
                      disabled={(d) => d < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Custom Time Picker */}
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
                      {Array.from({ length: 60 }, (_, i) => {
                        const v = i.toString().padStart(2, "0");
                        return (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        );
                      })}
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
                  Stored as: {formData.time || "Not set"}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="h-12 pl-10"
                  required
                />
              </div>
            </div>

            {/* Capacity + Category */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Capacity *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                  <Input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="h-12 pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </Layout>
  );
}
