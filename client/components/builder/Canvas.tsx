import React from "react";
import { useDrop } from "react-dnd";
import { DRAG_TYPES, ComponentType, BuilderComponent } from "@/types/builder";
import { cn } from "@/lib/utils";
import { useLayout } from "@/hooks/useLayout";
import { ComponentRenderer } from "./Renderer";
import { ComponentsPanel } from "./ComponentsPanel";
import { ElementStylePanel } from "./ElementStylePanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Eye, Save } from "lucide-react";
import { templateLayoutMap } from "@/components/predefine-email-templates/templates";
import { useToast } from "@/hooks/use-toast";

interface BuilderCanvasProps {
  onBack?: () => void;
  templateId?: string;
  initialLayout?: BuilderComponent[];
}

const DEFAULT_LAYOUT: BuilderComponent[] = [];

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ onBack, templateId, initialLayout }) => {
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);
  const [selectedComponentId, setSelectedComponentId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const layoutConfig = initialLayout
    ? initialLayout
    : templateId
      ? templateLayoutMap[templateId] || DEFAULT_LAYOUT
      : DEFAULT_LAYOUT;

  const { layout, addComponent, moveComponent, updateComponent, removeComponent } = useLayout(
    layoutConfig,
  );

  // Helper function to find a component by ID in the entire tree
  const findComponentById = (id: string, components = layout): BuilderComponent | null => {
    for (const comp of components) {
      if (comp.id === id) return comp;
      if (comp.children) {
        const found = findComponentById(id, comp.children);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedComponent = selectedComponentId ? findComponentById(selectedComponentId) : null;

  const handleCopyLayout = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(layout, null, 2));
      toast({
        title: "Copied",
        description: "Editor layout copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy the editor layout.",
      });
    }
  };

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DRAG_TYPES.COMPONENT,
    canDrop: () => {
      // Root accepts all component types
      return true;
    },
    drop: (item: any, monitor) => {
      if (monitor.didDrop()) return;

      if (item.id) {
        // Reordering
        moveComponent(item.id, null, layout.length);
      } else {
        // Adding new
        addComponent(item.type, null, layout.length);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // If in preview mode, show full page preview without editor UI
  if (isPreviewMode) {
    return (
      <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-white">
        <header className="h-14 border-b bg-white px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-900 tracking-tight">
              {templateId === "online-marketing-conference"
                ? "Online Marketing Conference"
                : "New Page"}
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full font-black uppercase tracking-wider">
              Preview
            </span>
          </div>
          <button
            onClick={() => setIsPreviewMode(false)}
            className="text-sm font-medium px-4 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Back to Editor
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white p-8">
          <div className="w-full max-w-5xl mx-auto min-h-full rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            {layout.map((comp) => (
              <ComponentRenderer
                key={comp.id}
                component={comp}
                onUpdate={() => {}}
                onRemove={() => {}}
                onMove={() => {}}
                onAdd={() => {}}
                onSelect={() => {}}
                isSelected={false}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-gray-50">
      {/* Top Header */}
      <div className="sticky top-0 z-40 flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white p-4">
        <div className="flex items-center gap-4 flex-1">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <div className="flex-1 max-w-md">
            <div className="text-sm text-gray-600 mb-1">Landing Page</div>
            <div className="text-lg font-semibold text-gray-900">
              {templateId === "online-marketing-conference"
                ? "Online Marketing Conference"
                : "New Page"}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
              Unsaved changes
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLayout}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(true)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button
            className="gap-2 bg-valasys-orange hover:bg-valasys-orange/90 text-white"
          >
            <Save className="w-4 h-4" />
            Publish
          </Button>
        </div>
      </div>

      {/* Main Content - Three Panel Layout */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left Sidebar - Components Panel */}
        <div className="flex w-72 flex-shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white">
          <ComponentsPanel />
        </div>

        {/* Center - Editor Canvas */}
        <div className="min-w-0 flex-1 overflow-auto bg-gray-50 p-8">
          <div
            ref={drop}
            className={cn(
              "w-full max-w-5xl mx-auto min-h-full transition-all duration-200 ease-in-out rounded-xl border border-gray-200 bg-white p-6",
              isOver && canDrop && "ring-2 ring-valasys-orange ring-dashed bg-orange-50",
              layout.length === 0 && "border-2 border-dashed border-gray-300 flex items-center justify-center",
            )}
          >
            {layout.length > 0 ? (
              <div className="space-y-4">
                {layout.map((comp) => (
                  <ComponentRenderer
                    key={comp.id}
                    component={comp}
                    onUpdate={updateComponent}
                    onRemove={removeComponent}
                    onMove={moveComponent}
                    onAdd={addComponent}
                    onSelect={setSelectedComponentId}
                    isSelected={selectedComponentId === comp.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-4 text-gray-400">
                  <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Start building your page</p>
                  <p className="text-xs">Drag and drop components from the sidebar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Styling Panel */}
        <ElementStylePanel
          component={selectedComponent}
          onUpdate={(updates) => {
            if (selectedComponentId) {
              updateComponent(selectedComponentId, updates);
            }
          }}
          onClose={() => setSelectedComponentId(null)}
        />
      </div>
    </div>
  );
};
