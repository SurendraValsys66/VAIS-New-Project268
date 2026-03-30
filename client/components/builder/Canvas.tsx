import React from "react";
import { useDrop } from "react-dnd";
import { DRAG_TYPES, ComponentType, BuilderComponent, PreviewDevice } from "@/types/builder";
import { cn } from "@/lib/utils";
import { useLayout } from "@/hooks/useLayout";
import { ComponentRenderer } from "./Renderer";
import { ComponentsPanel } from "./ComponentsPanel";
import { ElementStylePanel } from "./ElementStylePanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ArrowLeft, Copy, Eye, Save, Monitor, Tablet, Smartphone } from "lucide-react";
import { templateLayoutMap } from "@/components/predefine-email-templates/templates";
import { useToast } from "@/hooks/use-toast";

interface BuilderCanvasProps {
  onBack?: () => void;
  templateId?: string;
  initialLayout?: BuilderComponent[];
}

const DEFAULT_LAYOUT: BuilderComponent[] = [];

const PREVIEW_DEVICE_PRESETS: Record<PreviewDevice, { label: string; width: number | null; icon: React.ComponentType<{ className?: string }> }> = {
  desktop: { label: "Desktop", width: null, icon: Monitor },
  tablet: { label: "Tablet", width: 768, icon: Tablet },
  mobile: { label: "Mobile", width: 390, icon: Smartphone },
};

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ onBack, templateId, initialLayout }) => {
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);
  const [previewDevice, setPreviewDevice] = React.useState<PreviewDevice>("desktop");
  const [selectedComponentId, setSelectedComponentId] = React.useState<string | null>(null);
  const [pendingScrollComponentId, setPendingScrollComponentId] = React.useState<string | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = React.useState(false);
  const [videoDialogUrl, setVideoDialogUrl] = React.useState("");
  const [videoDialogFileName, setVideoDialogFileName] = React.useState("");
  const videoFileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const layoutConfig = initialLayout
    ? initialLayout
    : templateId
      ? templateLayoutMap[templateId] || DEFAULT_LAYOUT
      : DEFAULT_LAYOUT;

  const { layout, addComponent, moveComponent, updateComponent, removeComponent, duplicateComponent } = useLayout(
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
  const currentPreviewPreset = PREVIEW_DEVICE_PRESETS[previewDevice];

  React.useEffect(() => {
    if (!pendingScrollComponentId) return;

    const animationFrame = window.requestAnimationFrame(() => {
      const element = document.querySelector(`[data-builder-component-id="${pendingScrollComponentId}"]`);

      if (element instanceof HTMLElement) {
        element.scrollIntoView({ behavior: "smooth", block: "end" });
        setPendingScrollComponentId(null);
      }
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [layout, pendingScrollComponentId]);

  const handleComponentAdded = (newId: string) => {
    setSelectedComponentId(newId);
    setPendingScrollComponentId(newId);
  };

  const handleOpenVideoDialog = (component: BuilderComponent) => {
    setSelectedComponentId(component.id);
    setVideoDialogUrl(component.videoUrl || component.props?.videoUrl || component.props?.src || "");
    setIsVideoDialogOpen(true);
  };

  const handleSaveVideoDialog = () => {
    if (!selectedComponentId) {
      toast({
        title: "Error",
        description: "No component selected",
        variant: "destructive",
      });
      return;
    }

    const trimmedUrl = videoDialogUrl.trim();

    if (!trimmedUrl) {
      toast({
        title: "Error",
        description: "Please enter a video URL or upload a file",
        variant: "destructive",
      });
      return;
    }

    console.log("Saving video:", { selectedComponentId, trimmedUrl, length: trimmedUrl.length });

    updateComponent(selectedComponentId, {
      videoUrl: trimmedUrl,
    });

    toast({
      title: "Success",
      description: "Video added successfully",
    });

    setIsVideoDialogOpen(false);
    setVideoDialogUrl("");
    setVideoDialogFileName("");
  };

  const handleVideoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    // Validate file type
    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "application/octet-stream"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid video file (MP4, WebM, OGG, MOV, etc.)",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Failed to read the video file. Please try again.",
        variant: "destructive",
      });
      event.target.value = "";
    };

    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result;
      if (typeof result === "string") {
        console.log("File loaded as data URL, size:", result.length);
        setVideoDialogUrl(result);
        setVideoDialogFileName(file.name);
        toast({
          title: "File loaded",
          description: `${file.name} ready to add`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to convert file",
          variant: "destructive",
        });
      }
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

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
        addComponent(item.type, null, layout.length, handleComponentAdded);
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
        <header className="sticky top-0 z-40 flex min-h-14 flex-wrap items-center justify-between gap-4 border-b bg-white px-6 py-3">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-sm font-bold text-gray-900 tracking-tight">
                {templateId === "online-marketing-conference"
                  ? "Online Marketing Conference"
                  : "New Page"}
              </div>
              <div className="text-xs text-gray-500">
                {currentPreviewPreset.label}
                {currentPreviewPreset.width ? ` (${currentPreviewPreset.width}px)` : " (Full width)"}
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full font-black uppercase tracking-wider">
              Preview
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-1">
              {Object.entries(PREVIEW_DEVICE_PRESETS).map(([device, preset]) => {
                const Icon = preset.icon;

                return (
                  <button
                    key={device}
                    onClick={() => setPreviewDevice(device as PreviewDevice)}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                      previewDevice === device
                        ? "bg-valasys-orange text-white shadow-sm"
                        : "text-gray-600 hover:bg-white"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setIsPreviewMode(false)}
              className="text-sm font-medium px-4 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Back to Editor
            </button>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-4 sm:p-8">
          <div className="flex justify-center">
            <div
              className="min-h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200"
              style={{
                width: currentPreviewPreset.width ? `${currentPreviewPreset.width}px` : "100%",
                maxWidth: "100%",
              }}
            >
              <div className="space-y-4">
                {layout.map((comp) => (
                  <ComponentRenderer
                    key={comp.id}
                    component={comp}
                    onUpdate={() => {}}
                    onRemove={() => {}}
                    onMove={() => {}}
                    onAdd={() => {}}
                    onDuplicate={() => {}}
                    onSelect={() => {}}
                    isSelected={false}
                    previewDevice={previewDevice}
                  />
                ))}
              </div>
            </div>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLayout}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(true)}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="gap-2 bg-valasys-orange hover:bg-valasys-orange/90 text-white"
              >
                <Save className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Publish</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Main Content - Three Panel Layout */}
      <div className="flex min-h-0 flex-1 overflow-hidden bg-gray-50">
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
                {layout.map((comp, index) => (
                  <ComponentRenderer
                    key={comp.id}
                    component={comp}
                    onUpdate={updateComponent}
                    onRemove={removeComponent}
                    onMove={moveComponent}
                    onAdd={(type, parentId, idx) => {
                      addComponent(type, parentId, idx, handleComponentAdded);
                    }}
                    onDuplicate={duplicateComponent}
                    onSelect={setSelectedComponentId}
                    onOpenVideoDialog={handleOpenVideoDialog}
                    isSelected={selectedComponentId === comp.id}
                    parentId={null}
                    parentIndex={index}
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
        <div className="w-80 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden">
          <ElementStylePanel
            component={selectedComponent}
            onUpdate={(updates) => {
              if (selectedComponentId) {
                // Handle features header element updates
                if (selectedComponent?.type === "features" && selectedComponent?.selectedHeaderElement && updates.headerElementText !== undefined) {
                  const { headerElementText, ...otherUpdates } = updates as any;
                  const headerElements = selectedComponent.headerElements || [];
                  const updatedHeaderElements = headerElements.map((element: any) =>
                    element.id === selectedComponent.selectedHeaderElement
                      ? { ...element, text: headerElementText }
                      : element
                  );

                  updateComponent(selectedComponentId, {
                    ...otherUpdates,
                    headerElements: updatedHeaderElements,
                  });
                }
                // Handle feature-grid feature content updates
                else if (selectedComponent?.type === "feature-grid" && selectedComponent?.selectedFeatureId) {
                  const { featureIcon, featureTitle, featureDescription, ...otherUpdates } = updates as any;

                  if (featureIcon !== undefined || featureTitle !== undefined || featureDescription !== undefined) {
                    const features = selectedComponent.features || [];
                    const updatedFeatures = features.map(feature =>
                      feature.id === selectedComponent.selectedFeatureId
                        ? {
                            ...feature,
                            ...(featureIcon !== undefined && { icon: featureIcon }),
                            ...(featureTitle !== undefined && { title: featureTitle }),
                            ...(featureDescription !== undefined && { description: featureDescription }),
                          }
                        : feature
                    );

                    updateComponent(selectedComponentId, {
                      ...otherUpdates,
                      features: updatedFeatures,
                    });
                  } else {
                    updateComponent(selectedComponentId, updates);
                  }
                } else if (selectedComponent?.type === "feature-grid" && selectedComponent?.selectedHeaderElement) {
                  // Handle feature-grid heading/description updates
                  const { featureGridHeading, featureGridDescription, ...otherUpdates } = updates as any;

                  if (featureGridHeading !== undefined || featureGridDescription !== undefined) {
                    updateComponent(selectedComponentId, {
                      ...otherUpdates,
                      ...(featureGridHeading !== undefined && { featureGridHeading }),
                      ...(featureGridDescription !== undefined && { featureGridDescription }),
                    });
                  } else {
                    updateComponent(selectedComponentId, updates);
                  }
                } else {
                  updateComponent(selectedComponentId, updates);
                }
              }
            }}
            onClose={() => setSelectedComponentId(null)}
          />
        </div>
      </div>
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Video</DialogTitle>
            <DialogDescription>
              Paste a direct video file URL to make the video block playable.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Upload Video</label>
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => videoFileInputRef.current?.click()}
                className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-valasys-orange hover:bg-orange-50 transition-colors"
              >
                Choose video file
              </button>
              {videoDialogFileName && (
                <p className="text-xs text-gray-500 truncate">Selected file: {videoDialogFileName}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider text-gray-400">
                <span className="bg-white px-2">Or paste URL</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Video URL</label>
              <Input
                value={videoDialogUrl}
                onChange={(e) => {
                  setVideoDialogUrl(e.target.value);
                  setVideoDialogFileName("");
                }}
                placeholder="https://example.com/video.mp4"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && videoDialogUrl.trim()) {
                    handleSaveVideoDialog();
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsVideoDialogOpen(false);
                setVideoDialogUrl("");
                setVideoDialogFileName("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveVideoDialog} disabled={!videoDialogUrl.trim()}>
              Add Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
