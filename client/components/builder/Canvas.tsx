import React from "react";
import { useDrop } from "react-dnd";
import { DRAG_TYPES, ComponentType } from "@/types/builder";
import { cn } from "@/lib/utils";
import { useLayout } from "@/hooks/useLayout";
import { ComponentRenderer } from "./Renderer";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BuilderCanvasProps {
  onBack?: () => void;
}

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ onBack }) => {
  const { layout, addComponent, moveComponent, updateComponent, removeComponent } = useLayout([
    {
      id: "root-hero-1",
      type: "hero",
      props: {},
      height: 600,
    },
    {
      id: "root-logo-cloud-1",
      type: "logo-cloud",
      props: {},
    },
    {
      id: "root-section-1",
      type: "section",
      props: {},
      children: [
        {
          id: "root-row-1",
          type: "row",
          props: {},
          children: [
            {
              id: "root-col-1",
              type: "column",
              width: 12,
              children: [
                { id: "root-feature-grid-1", type: "feature-grid", props: {} },
              ],
            },
          ],
        },
      ],
    },
  ]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DRAG_TYPES.COMPONENT,
    canDrop: (item: any) => {
      // Root only accepts sections or reordering root components
      return item.type === "section";
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

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-white px-6 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Button>
            )}
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900 tracking-tight">New Page</span>
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-black uppercase tracking-wider">
                Editing
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400 mr-2">Auto-saved 2 min ago</div>
            <button className="text-sm font-medium px-4 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              Preview
            </button>
            <button className="text-sm font-medium px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
              Publish
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-area">
          <div
            ref={drop}
            className={cn(
              "max-w-5xl mx-auto min-h-full transition-all duration-200 ease-in-out p-6 rounded-xl",
              isOver && canDrop && "bg-blue-50/50 ring-2 ring-blue-500 ring-dashed",
              layout.length === 0 && "bg-white border-2 border-dashed border-gray-300 flex items-center justify-center h-full",
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
      </div>
    </div>
  );
};
