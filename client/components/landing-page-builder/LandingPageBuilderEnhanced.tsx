import React, { useState, useEffect } from "react";
import { ChevronLeft, Save, Eye, Share2, Smartphone, Tablet, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { LandingPage, LandingPageBlock } from "./types";
import {
  getLandingPagesFromLocalStorage,
  saveLandingPageToLocalStorage,
} from "./utils";
import { LandingPagePreview } from "./LandingPagePreview";
import { BlocksPanel } from "./BlocksPanel";
import { SectionsPanel } from "./SectionsPanel";
import { EnhancedSettingsPanel } from "./EnhancedSettingsPanel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LandingPageBuilderEnhancedProps {
  pageId?: string;
  onBack: () => void;
}

type DeviceType = "desktop" | "tablet" | "mobile";

interface DevicePreset {
  type: DeviceType;
  width: number;
  height?: number;
  label: string;
  icon: React.ReactNode;
}

const DEVICE_PRESETS: DevicePreset[] = [
  {
    type: "desktop",
    width: 1440,
    label: "Desktop",
    icon: <Monitor className="w-4 h-4" />,
  },
  {
    type: "tablet",
    width: 768,
    label: "Tablet",
    icon: <Tablet className="w-4 h-4" />,
  },
  {
    type: "mobile",
    width: 375,
    label: "Mobile",
    icon: <Smartphone className="w-4 h-4" />,
  },
];

export const LandingPageBuilderEnhanced: React.FC<LandingPageBuilderEnhancedProps> = ({
  pageId,
  onBack,
}) => {
  const [page, setPage] = useState<LandingPage | null>(null);
  const [pageName, setPageName] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSectionsPanelOpen, setIsSectionsPanelOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<DeviceType>("desktop");
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  useEffect(() => {
    if (pageId) {
      const pages = getLandingPagesFromLocalStorage();
      const foundPage = pages.find((p) => p.id === pageId);
      if (foundPage) {
        setPage(foundPage);
        setPageName(foundPage.name);
      }
    } else {
      const newPage: LandingPage = {
        id: `lp-${Date.now()}`,
        name: "Untitled Landing Page",
        description: "A new landing page",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        blocks: [],
      };
      setPage(newPage);
      setPageName(newPage.name);
    }
  }, [pageId]);

  const handleAddBlock = (block: LandingPageBlock) => {
    if (!page) return;
    setPage({
      ...page,
      blocks: [...page.blocks, block],
    });
  };

  const handleUpdateBlock = (blockId: string, properties: Record<string, any>) => {
    if (!page) return;
    const updatedBlocks = page.blocks.map((block) =>
      block.id === blockId ? { ...block, properties } : block
    );
    setPage({
      ...page,
      blocks: updatedBlocks,
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!page) return;
    setPage({
      ...page,
      blocks: page.blocks.filter((block) => block.id !== blockId),
    });
    setSelectedBlockId(null);
  };

  const handleMoveBlock = (blockId: string, direction: "up" | "down") => {
    if (!page) return;
    const index = page.blocks.findIndex((b) => b.id === blockId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === page.blocks.length - 1)
    ) {
      return;
    }
    const newBlocks = [...page.blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ];
    setPage({
      ...page,
      blocks: newBlocks,
    });
  };

  const handleDuplicateBlock = (block: LandingPageBlock, position: number) => {
    if (!page) return;

    // Deep copy the block including all properties and children
    const duplicatedBlock: LandingPageBlock = JSON.parse(JSON.stringify({
      ...block,
      id: `${block.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    const newBlocks = [...page.blocks];
    newBlocks.splice(position, 0, duplicatedBlock);

    setPage({
      ...page,
      blocks: newBlocks,
    });
    setSelectedBlockId(duplicatedBlock.id);
  };

  const handleSelectTemplate = (blocks: LandingPageBlock[]) => {
    if (!page) return;
    setPage({
      ...page,
      blocks: [...page.blocks, ...blocks],
    });
    setIsSectionsPanelOpen(false);
  };

  const handleSave = async () => {
    if (!page) return;
    setIsSaving(true);
    try {
      const updatedPage = {
        ...page,
        name: pageName,
        updatedAt: new Date().toISOString(),
      };
      saveLandingPageToLocalStorage(updatedPage);
      setPage(updatedPage);
      setTimeout(() => {
        setIsSaving(false);
      }, 500);
    } catch (error) {
      console.error("Error saving landing page:", error);
      setIsSaving(false);
    }
  };

  const handlePublish = () => {
    // Placeholder for publish functionality
    alert(`Landing page "${pageName}" published successfully!`);
    setShowPublishDialog(false);
  };

  const handleExport = () => {
    if (!page) return;
    const dataStr = JSON.stringify(page, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${pageName.toLowerCase().replace(/\s+/g, "-")}.json`;
    link.click();
  };

  if (!page) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const selectedBlock = page.blocks.find((b) => b.id === selectedBlockId) || null;
  const currentDevicePreset = DEVICE_PRESETS.find((d) => d.type === currentDevice);

  return (
    <div className="flex h-screen bg-gray-100 flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-gray-600 hover:text-gray-900"
            onClick={onBack}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="h-8 w-px bg-gray-200" />
          <Input
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            placeholder="Landing Page Title"
            className="max-w-sm text-sm font-semibold border-0 focus-visible:ring-0 px-0"
          />
        </div>

        {/* Device Preview Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mx-4">
          {DEVICE_PRESETS.map((preset) => (
            <Button
              key={preset.type}
              size="sm"
              variant={currentDevice === preset.type ? "default" : "ghost"}
              className="gap-1 h-8 px-2"
              onClick={() => setCurrentDevice(preset.type)}
              title={preset.label}
            >
              {preset.icon}
              <span className="hidden sm:inline text-xs">{preset.label}</span>
            </Button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-valasys-orange hover:bg-orange-600 gap-2"
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isSaving ? "Saving..." : "Save"}</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 gap-2" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Publish</TooltipContent>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowPublishDialog(true)}>
                Publish Now
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Blocks Panel */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-hidden flex flex-col flex-shrink-0">
          <BlocksPanel
            onAddBlock={handleAddBlock}
            onOpenSectionsPanel={() => setIsSectionsPanelOpen(true)}
          />
        </div>

        {/* Conditional Sections Panel */}
        {isSectionsPanelOpen && (
          <div className="w-80 bg-white border-r border-gray-200 overflow-hidden flex flex-col flex-shrink-0">
            <SectionsPanel
              onSelectTemplate={handleSelectTemplate}
              onBack={() => setIsSectionsPanelOpen(false)}
            />
          </div>
        )}

        {/* Center Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div
            className="mx-auto bg-white rounded-lg shadow-md transition-all"
            style={{
              width: `${currentDevicePreset?.width}px`,
              maxWidth: "100%",
            }}
          >
            <LandingPagePreview
              page={page}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onUpdateBlock={handleUpdateBlock}
              onDeleteBlock={handleDeleteBlock}
              onMoveBlock={handleMoveBlock}
              onDuplicateBlock={handleDuplicateBlock}
            />
          </div>
        </div>

        {/* Right Sidebar - Settings Panel */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-hidden flex flex-col flex-shrink-0">
          <EnhancedSettingsPanel
            block={selectedBlock}
            onBlockUpdate={(updatedBlock) =>
              handleUpdateBlock(updatedBlock.id, updatedBlock.properties)
            }
            onBlockDelete={() => {
              if (selectedBlockId) {
                handleDeleteBlock(selectedBlockId);
              }
            }}
          />
        </div>
      </div>

      {/* Full Page Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Page Preview - {pageName}</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <LandingPagePreview
              page={page}
              selectedBlockId={null}
              onSelectBlock={() => {}}
              onUpdateBlock={() => {}}
              onDeleteBlock={() => {}}
              onMoveBlock={() => {}}
              onDuplicateBlock={() => {}}
            />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Landing Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Page Name: <span className="font-semibold">{pageName}</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Total Blocks: <span className="font-semibold">{page.blocks.length}</span>
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Your landing page will be published and made available online.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handlePublish}
                className="bg-green-600 hover:bg-green-700"
              >
                Publish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
