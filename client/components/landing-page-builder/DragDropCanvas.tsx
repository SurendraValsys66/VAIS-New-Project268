import React, { useCallback, useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { LandingPage, LandingPageBlock, DragItem } from "./types";
import { DraggableBlock } from "./DraggableBlock";
import { Copy, Plus, Trash2 } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface DragDropCanvasProps {
  page: LandingPage;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onAddBlock: (block: LandingPageBlock, parentId?: string) => void;
  onUpdateBlock: (blockId: string, properties: Record<string, any>) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock?: (block: LandingPageBlock, position: number) => void;
  onMoveBlock: (blockId: string, direction: "up" | "down") => void;
}

export const DragDropCanvas: React.FC<DragDropCanvasProps> = ({
  page,
  selectedBlockId,
  onSelectBlock,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlock,
}) => {
  const [copied, setCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isCanvasSelected, setIsCanvasSelected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to deselect canvas
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsCanvasSelected(false);
      }
    };

    if (isCanvasSelected) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isCanvasSelected]);

  const handleCopyBlocks = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(page.blocks, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy blocks:", error);
    }
  };

  const handleClearAllBlocks = () => {
    if (window.confirm("Are you sure you want to delete all blocks?")) {
      page.blocks.forEach((block) => onDeleteBlock(block.id));
    }
  };

  const handleAddNewBlock = () => {
    // This will open the sidebar or show a menu to add blocks
    // For now, we'll just deselect
    setIsCanvasSelected(false);
  };

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: ["BLOCK_ITEM"],
      drop: (item: DragItem) => {
        // Handle drop of new block from sidebar
        if (item.sourceId === "sidebar") {
          // The new block will be handled by the parent component
          return { parentId: undefined };
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  const renderBlock = (block: LandingPageBlock, index: number) => {
    const isSelected = selectedBlockId === block.id;

    return (
      <DraggableBlock
        key={block.id}
        block={block}
        index={index}
        isSelected={isSelected}
        onSelect={() => onSelectBlock(block.id)}
        onUpdate={(props) => onUpdateBlock(block.id, props)}
        onDelete={() => onDeleteBlock(block.id)}
        onDuplicate={() => {
          onDuplicateBlock?.(block, index + 1);
        }}
        onMoveUp={() => onMoveBlock(block.id, "up")}
        onMoveDown={() => onMoveBlock(block.id, "down")}
        canMoveUp={index > 0}
        canMoveDown={index < page.blocks.length - 1}
      />
    );
  };

  if (page.blocks.length === 0) {
    return (
      <div ref={containerRef} className="relative">
        <div
          ref={dropRef}
          className={`w-full bg-white rounded-lg px-8 py-6 flex flex-col items-center justify-center min-h-32 transition-all ${
            isCanvasSelected
              ? "border-2 border-valasys-orange shadow-md bg-orange-50"
              : isHovering || isOver
                ? "border-2 border-dashed border-valasys-orange"
                : "border-2 border-gray-200"
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => setIsCanvasSelected(true)}
        >
          <p className="text-gray-500 text-center text-sm">
            Drag blocks from the sidebar to start building
          </p>
        </div>

        {/* Controls when canvas is selected */}
        {isCanvasSelected && (
          <div className="absolute top-3 right-3 flex gap-2 bg-white rounded-lg shadow-lg p-2 z-20">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyBlocks();
                  }}
                  title={copied ? "Copied!" : "Copy"}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? "Copied!" : "Copy"}</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => setIsCanvasSelected(true)}
    >
      <div
        ref={dropRef}
        className={`w-full space-y-4 transition-all rounded-lg border-2 ${
          isCanvasSelected
            ? "border-valasys-orange bg-orange-50 p-4"
            : isHovering || isOver
              ? "border-dashed border-valasys-orange"
              : "border-transparent"
        } ${isOver ? "bg-orange-50 p-4" : ""}`}
      >
        {page.blocks.map((block, index) => renderBlock(block, index))}
      </div>

      {/* Controls when canvas is selected */}
      {isCanvasSelected && (
        <div className="absolute top-3 right-3 flex gap-2 bg-white rounded-lg shadow-lg p-2 z-20">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyBlocks();
                }}
                title={copied ? "Copied!" : "Copy"}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copied!" : "Copy"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAllBlocks();
                }}
                title="Clear all blocks"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear all blocks</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
