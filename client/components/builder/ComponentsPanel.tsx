import React from "react";
import { useDrag } from "react-dnd";
import { DRAG_TYPES, ComponentType } from "@/types/builder";
import { cn } from "@/lib/utils";
import {
  Layout,
  Type,
  Image as ImageIcon,
  Square,
  Columns,
  Rows,
  Video,
  Minus,
  Sparkles,
  Grid,
  DollarSign,
  MessageSquareQuote,
  Users,
  HelpCircle,
  Megaphone,
  Mail,
  Box,
} from "lucide-react";

interface ComponentItemProps {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
}

const ComponentItem: React.FC<ComponentItemProps> = ({ type, label, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPES.COMPONENT,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 bg-white hover:border-valasys-orange hover:bg-orange-50 transition-all cursor-move shadow-sm group",
        isDragging && "opacity-50 border-valasys-orange scale-95",
      )}
    >
      <div className="text-gray-400 group-hover:text-valasys-orange transition-colors mb-2">
        {icon}
      </div>
      <span className="text-xs font-semibold text-center text-gray-700">{label}</span>
    </div>
  );
};

export const ComponentsPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      {/* Layout Category */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Layout className="w-3 h-3" /> Layout
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <ComponentItem type="section" label="Section" icon={<Layout className="w-5 h-5" />} />
          <ComponentItem type="row" label="Row" icon={<Rows className="w-5 h-5" />} />
          <ComponentItem type="column" label="Column" icon={<Columns className="w-5 h-5" />} />
        </div>
      </div>

      {/* Basic Category */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Box className="w-3 h-3" /> Basic
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <ComponentItem type="heading" label="Heading" icon={<Type className="w-5 h-5" />} />
          <ComponentItem type="paragraph" label="Paragraph" icon={<Type className="w-5 h-5" />} />
          <ComponentItem type="button" label="Button" icon={<Square className="w-5 h-5" />} />
          <ComponentItem type="image" label="Image" icon={<ImageIcon className="w-5 h-5" />} />
          <ComponentItem type="video" label="Video" icon={<Video className="w-5 h-5" />} />
          <ComponentItem type="divider" label="Divider" icon={<Minus className="w-5 h-5" />} />
        </div>
      </div>

      {/* Marketing Category */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> Marketing
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <ComponentItem type="hero" label="Hero Section" icon={<Sparkles className="w-5 h-5" />} />
          <ComponentItem type="feature-grid" label="Feature Grid" icon={<Grid className="w-5 h-5" />} />
          <ComponentItem type="pricing" label="Pricing Table" icon={<DollarSign className="w-5 h-5" />} />
          <ComponentItem type="testimonials" label="Testimonials" icon={<MessageSquareQuote className="w-5 h-5" />} />
          <ComponentItem type="logo-cloud" label="Logo Cloud" icon={<Users className="w-5 h-5" />} />
          <ComponentItem type="faq" label="FAQ Section" icon={<HelpCircle className="w-5 h-5" />} />
          <ComponentItem type="cta" label="CTA Section" icon={<Megaphone className="w-5 h-5" />} />
          <ComponentItem type="contact-form" label="Contact Form" icon={<Mail className="w-5 h-5" />} />
        </div>
      </div>
    </div>
  );
};
