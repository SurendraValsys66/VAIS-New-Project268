import React from "react";
import { LandingPageBlock } from "@/components/landing-page-builder/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Copy, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialsSectionProps {
  block: LandingPageBlock;
  onUpdate: (block: LandingPageBlock) => void;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatarUrl?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  block,
  onUpdate,
}) => {
  const [selectedTestimonialId, setSelectedTestimonialId] = React.useState<string | null>(null);
  const [hoveredTestimonialId, setHoveredTestimonialId] = React.useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = React.useState<string | null>(null);

  const testimonials: Testimonial[] = (block.properties.testimonials || []) as Testimonial[];

  const handleCopyTestimonial = (testimonialId: string) => {
    const testimonialToCopy = testimonials.find(t => t.id === testimonialId);
    if (!testimonialToCopy) return;

    // Create a duplicate testimonial with a new ID
    const newTestimonialId = `testimonial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const duplicatedTestimonial: Testimonial = {
      ...testimonialToCopy,
      id: newTestimonialId,
    };

    // Find the index and insert after it
    const testimonialIndex = testimonials.findIndex(t => t.id === testimonialId);
    const updatedTestimonials = [...testimonials];
    updatedTestimonials.splice(testimonialIndex + 1, 0, duplicatedTestimonial);

    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        testimonials: updatedTestimonials,
      },
    });

    setSelectedTestimonialId(newTestimonialId);
  };

  const handleDeleteTestimonial = (testimonialId: string) => {
    // Don't allow deleting if it's the only testimonial
    if (testimonials.length === 1) return;

    const updatedTestimonials = testimonials.filter(t => t.id !== testimonialId);
    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        testimonials: updatedTestimonials,
      },
    });
    setSelectedTestimonialId(null);
  };

  const handleAddTestimonial = (testimonialId: string) => {
    // Add is the same as copy
    handleCopyTestimonial(testimonialId);
  };

  const handleUpdateTestimonial = (testimonialId: string, updates: Partial<Testimonial>) => {
    const updatedTestimonials = testimonials.map(t =>
      t.id === testimonialId ? { ...t, ...updates } : t
    );

    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        testimonials: updatedTestimonials,
      },
    });
  };

  const handleUpdateBlock = (updates: Record<string, any>) => {
    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        ...updates,
      },
    });
  };

  const renderControls = (testimonialId: string) => {
    if (selectedTestimonialId !== testimonialId || editingTestimonialId === testimonialId) {
      return null;
    }

    return (
      <div
        className="absolute top-1 right-1 flex items-center gap-1 bg-white rounded-md shadow-lg border border-valasys-orange/20 z-[100] pointer-events-auto"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopyTestimonial(testimonialId);
          }}
          className="h-6 w-6 flex items-center justify-center hover:bg-valasys-orange/10 rounded transition-colors cursor-pointer"
          title="Duplicate testimonial"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddTestimonial(testimonialId);
          }}
          className="h-6 w-6 flex items-center justify-center hover:bg-valasys-orange/10 rounded transition-colors cursor-pointer"
          title="Duplicate testimonial"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDeleteTestimonial(testimonialId);
          }}
          className="h-6 w-6 flex items-center justify-center hover:bg-red-100 text-red-500 rounded transition-colors cursor-pointer"
          title="Delete testimonial"
          disabled={testimonials.length === 1}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };

  const isSelected = (testimonialId: string) => selectedTestimonialId === testimonialId;
  const isHovered = (testimonialId: string) => hoveredTestimonialId === testimonialId;

  return (
    <div className="relative w-full overflow-hidden bg-white p-8 rounded-3xl border border-gray-100">
      <div className="space-y-8">
        {/* Header */}
        <h2
          className="text-3xl font-bold text-center text-gray-900 cursor-text hover:bg-gray-50 p-2 rounded"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            handleUpdateBlock({ heading: e.currentTarget.textContent });
          }}
        >
          {block.properties.heading || "What Our Customers Say"}
        </h2>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={cn(
                "relative group transition-all rounded-lg p-6 cursor-pointer",
                isSelected(testimonial.id)
                  ? "border-2 border-solid border-valasys-orange bg-valasys-orange/5"
                  : isHovered(testimonial.id)
                  ? "border-2 border-dashed border-valasys-orange/50 bg-gray-50"
                  : "border-2 border-gray-200 hover:bg-gray-50 bg-white"
              )}
              onMouseEnter={() => setHoveredTestimonialId(testimonial.id)}
              onMouseLeave={() => setHoveredTestimonialId(null)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTestimonialId(selectedTestimonialId === testimonial.id ? null : testimonial.id);
              }}
            >
              {/* Quote */}
              {isSelected(testimonial.id) ? (
                <Textarea
                  value={testimonial.quote}
                  onChange={(e) => handleUpdateTestimonial(testimonial.id, { quote: e.target.value })}
                  onFocus={() => setEditingTestimonialId(testimonial.id)}
                  onBlur={() => setEditingTestimonialId(null)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Testimonial quote"
                  className="text-gray-600 mb-4 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={3}
                />
              ) : (
                <p className="text-gray-600 mb-4">{testimonial.quote}</p>
              )}

              {/* Author Info */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {testimonial.avatarUrl ? (
                    <img
                      src={testimonial.avatarUrl}
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-sm font-bold">
                      {testimonial.author.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  {/* Author Name */}
                  {isSelected(testimonial.id) ? (
                    <Input
                      value={testimonial.author}
                      onChange={(e) => handleUpdateTestimonial(testimonial.id, { author: e.target.value })}
                      onFocus={() => setEditingTestimonialId(testimonial.id)}
                      onBlur={() => setEditingTestimonialId(null)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Author name"
                      className="font-semibold text-gray-900 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.author}</p>
                  )}

                  {/* Role */}
                  {isSelected(testimonial.id) ? (
                    <Input
                      value={testimonial.role}
                      onChange={(e) => handleUpdateTestimonial(testimonial.id, { role: e.target.value })}
                      onFocus={() => setEditingTestimonialId(testimonial.id)}
                      onBlur={() => setEditingTestimonialId(null)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Author role"
                      className="text-sm text-gray-600 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  )}
                </div>
              </div>

              {renderControls(testimonial.id)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
