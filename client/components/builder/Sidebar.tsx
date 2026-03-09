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

interface SidebarItemProps {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ type, label, icon }) => {
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
        "flex items-center gap-3 p-3 mb-2 rounded-lg border bg-white cursor-move hover:border-blue-500 hover:text-blue-500 transition-colors shadow-sm group",
        isDragging && "opacity-50 border-blue-500",
      )}
    >
      <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
        {icon}
      </div>
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <div className="w-72 border-r bg-gray-50 p-4 overflow-y-auto custom-scrollbar">
      <div className="space-y-8">
        {/* Layout Category */}
        <div>
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Layout className="w-3 h-3" /> Layout
          </h2>
          <div className="grid grid-cols-1 gap-2">
            <SidebarItem type="section" label="Section" icon={<Layout className="w-4 h-4" />} />
            <SidebarItem type="row" label="Row" icon={<Rows className="w-4 h-4" />} />
            <SidebarItem type="column" label="Column" icon={<Columns className="w-4 h-4" />} />
          </div>
        </div>

        {/* Basic Category */}
        <div>
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Box className="w-3 h-3" /> Basic Components
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <SidebarItem type="heading" label="Heading" icon={<Type className="w-4 h-4" />} />
            <SidebarItem type="paragraph" label="Paragraph" icon={<Type className="w-4 h-4" />} />
            <SidebarItem type="button" label="Button" icon={<Square className="w-4 h-4" />} />
            <SidebarItem type="image" label="Image" icon={<ImageIcon className="w-4 h-4" />} />
            <SidebarItem type="video" label="Video" icon={<Video className="w-4 h-4" />} />
            <SidebarItem type="divider" label="Divider" icon={<Minus className="w-4 h-4" />} />
          </div>
        </div>

        {/* Marketing Category */}
        <div>
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Marketing Components
          </h2>
          <div className="grid grid-cols-1 gap-2">
            <SidebarItem type="hero" label="Hero Section" icon={<Sparkles className="w-4 h-4" />} />
            <SidebarItem type="feature-grid" label="Feature Grid" icon={<Grid className="w-4 h-4" />} />
            <SidebarItem type="pricing" label="Pricing Table" icon={<DollarSign className="w-4 h-4" />} />
            <SidebarItem type="testimonials" label="Testimonials" icon={<MessageSquareQuote className="w-4 h-4" />} />
            <SidebarItem type="logo-cloud" label="Logo Cloud" icon={<Users className="w-4 h-4" />} />
            <SidebarItem type="faq" label="FAQ Section" icon={<HelpCircle className="w-4 h-4" />} />
            <SidebarItem type="cta" label="CTA Section" icon={<Megaphone className="w-4 h-4" />} />
            <SidebarItem type="contact-form" label="Contact Form" icon={<Mail className="w-4 h-4" />} />
          </div>
        </div>
      </div>
    </div>
  );
};
