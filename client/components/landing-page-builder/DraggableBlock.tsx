import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { LandingPageBlock } from "./types";
import { Trash2, ChevronUp, ChevronDown, GripVertical, Copy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HeaderBlockPreview,
  HeroBlockPreview,
  FeaturesBlockPreview,
  TestimonialsBlockPreview,
  AboutBlockPreview,
  ContactFormBlockPreview,
  FooterBlockPreview,
  SpacerBlockPreview,
  PricingBlockPreview,
  FaqBlockPreview,
  SignupBlockPreview,
  PricingFooterBlockPreview,
} from "./BlockPreviews";
import {
  SectionBlockPreview,
  RowBlockPreview,
  ColumnBlockPreview,
} from "./LayoutBlockPreviews";

interface DraggableBlockProps {
  block: LandingPageBlock;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (props: Record<string, any>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyBlock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(JSON.stringify(block, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy block:", error);
    }
  };
  const [{ isDragging }] = useDrag(
    () => ({
      type: "DRAGGABLE_BLOCK",
      item: { id: block.id, index, type: block.type },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [block.id, index, block.type]
  );

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: ["DRAGGABLE_BLOCK"],
      drop: () => {
        // Handle block reordering in parent
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [block.id]
  );

  const getBlockPreview = (block: LandingPageBlock) => {
    const blockProps = {
      block,
      isSelected,
      onSelect,
      onUpdate,
    };

    switch (block.type) {
      case "header":
        return <HeaderBlockPreview {...blockProps} />;
      case "hero":
        return <HeroBlockPreview {...blockProps} />;
      case "features":
        return <FeaturesBlockPreview {...blockProps} />;
      case "testimonials":
        return <TestimonialsBlockPreview {...blockProps} />;
      case "about":
        return <AboutBlockPreview {...blockProps} />;
      case "contact-form":
        return <ContactFormBlockPreview {...blockProps} />;
      case "footer":
        return <FooterBlockPreview {...blockProps} />;
      case "section-spacer":
        return <SpacerBlockPreview {...blockProps} />;
      case "pricing":
        return <PricingBlockPreview {...blockProps} />;
      case "faq":
        return <FaqBlockPreview {...blockProps} />;
      case "signup":
        return <SignupBlockPreview {...blockProps} />;
      case "pricing-footer":
        return <PricingFooterBlockPreview {...blockProps} />;
      case "section":
        return <SectionBlockPreview {...blockProps} />;
      case "row":
        return <RowBlockPreview {...blockProps} />;
      case "column":
        return <ColumnBlockPreview {...blockProps} />;
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <div
      ref={dropRef}
      className={`relative group transition-all rounded cursor-pointer ${
        isDragging ? "opacity-50" : "opacity-100"
      } ${isSelected ? "ring-2 ring-valasys-orange shadow-lg" : ""} ${
        isOver ? "ring-2 ring-blue-400 bg-blue-50" : ""
      }`}
      onClick={(e) => {
        if (e.target === dragHandleRef.current) return;
        onSelect();
      }}
    >
      {/* Drag Handle */}
      <div
        ref={dragHandleRef}
        className="absolute -left-6 top-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity z-30"
        title="Drag to reorder"
      >
        <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
      </div>

      {/* Block Content */}
      <div className="relative">{getBlockPreview(block)}</div>

      {/* Controls */}
      {isSelected && (
        <div className="absolute top-2 right-2 flex gap-2 bg-white rounded-lg shadow-lg p-1 z-20">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-gray-100"
            title={copied ? "Copied!" : "Copy block"}
            onClick={handleCopyBlock}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
            title="Duplicate block"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-gray-100"
            title="Move up"
            onClick={(e) => {
              e.stopPropagation();
              if (canMoveUp) onMoveUp();
            }}
            disabled={!canMoveUp}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-gray-100"
            title="Move down"
            onClick={(e) => {
              e.stopPropagation();
              if (canMoveDown) onMoveDown();
            }}
            disabled={!canMoveDown}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            title="Delete block"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
