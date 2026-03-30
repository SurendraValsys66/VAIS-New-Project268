import React from "react";
import { LandingPageBlock } from "@/components/landing-page-builder/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Copy, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturesSectionProps {
  block: LandingPageBlock;
  onUpdate: (block: LandingPageBlock) => void;
  onSelect?: (elementInfo: { type: string; id?: string } | null) => void;
  selectedFeatureId?: string | null;
  selectedHeaderElement?: string | null;
}

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface HeaderElement {
  id: string;
  type: "heading" | "description";
  text: string;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  block,
  onUpdate,
  onSelect,
  selectedHeaderElement,
}) => {
  const [selectedFeatureId, setSelectedFeatureId] = React.useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = React.useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = React.useState<{
    featureId: string;
    element: "icon" | "title" | "description";
  } | null>(null);
  const [editingFeatureId, setEditingFeatureId] = React.useState<string | null>(null);
  const [hoveredHeaderElement, setHoveredHeaderElement] = React.useState<"heading" | "description" | null>(null);
  const [localSelectedHeaderElement, setLocalSelectedHeaderElement] = React.useState<"heading" | "description" | null>(
    selectedHeaderElement as "heading" | "description" | null
  );
  const [isClickingControl, setIsClickingControl] = React.useState(false);

  const features: Feature[] = (block.properties.features || []) as Feature[];

  // Initialize header elements from block properties (backward compatible)
  const initializeHeaderElements = (): HeaderElement[] => {
    if (block.properties.headerElements) {
      return block.properties.headerElements as HeaderElement[];
    }
    // Backward compatibility: convert old heading/description to new format
    const elements: HeaderElement[] = [];
    if (block.properties.heading) {
      elements.push({
        id: `heading-${Date.now()}`,
        type: "heading",
        text: block.properties.heading,
      });
    }
    if (block.properties.description) {
      elements.push({
        id: `description-${Date.now()}`,
        type: "description",
        text: block.properties.description,
      });
    }
    return elements;
  };

  const [headerElements, setHeaderElements] = React.useState<HeaderElement[]>(
    initializeHeaderElements()
  );

  const handleCopyFeature = (featureId: string) => {
    const featureToCopy = features.find(f => f.id === featureId);
    if (!featureToCopy) return;

    // Create a duplicate feature with a new ID
    const newFeatureId = `feature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const duplicatedFeature: Feature = {
      ...featureToCopy,
      id: newFeatureId,
    };

    // Find the index and insert after it
    const featureIndex = features.findIndex(f => f.id === featureId);
    const updatedFeatures = [...features];
    updatedFeatures.splice(featureIndex + 1, 0, duplicatedFeature);

    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        features: updatedFeatures,
      },
    });

    setSelectedFeatureId(newFeatureId);
    onSelect?.(newFeatureId);
  };

  const handleDeleteFeature = (featureId: string) => {
    const updatedFeatures = features.filter(f => f.id !== featureId);
    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        features: updatedFeatures,
      },
    });
    setSelectedFeatureId(null);
  };

  const handleAddFeature = (featureId: string) => {
    // Add is the same as copy
    handleCopyFeature(featureId);
  };

  const handleUpdateFeature = (featureId: string, updates: Partial<Feature>) => {
    const updatedFeatures = features.map(f =>
      f.id === featureId ? { ...f, ...updates } : f
    );

    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        features: updatedFeatures,
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

  const renderControls = (featureId: string) => {
    if (selectedFeatureId !== featureId || editingFeatureId === featureId) {
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
            handleCopyFeature(featureId);
          }}
          className="h-6 w-6 flex items-center justify-center hover:bg-valasys-orange/10 rounded transition-colors cursor-pointer"
          title="Copy feature"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddFeature(featureId);
          }}
          className="h-6 w-6 flex items-center justify-center hover:bg-valasys-orange/10 rounded transition-colors cursor-pointer"
          title="Add feature"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDeleteFeature(featureId);
          }}
          className="h-6 w-6 flex items-center justify-center hover:bg-red-100 text-red-500 rounded transition-colors cursor-pointer"
          title="Delete feature"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };

  const handleCopyHeaderElement = (elementId: string) => {
    const element = headerElements.find(e => e.id === elementId);
    if (!element) return;

    // Create a duplicate with a new ID and insert after the original
    const newElement: HeaderElement = {
      ...element,
      id: `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const elementIndex = headerElements.findIndex(e => e.id === elementId);
    const updatedElements = [...headerElements];
    updatedElements.splice(elementIndex + 1, 0, newElement);

    setHeaderElements(updatedElements);
    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        headerElements: updatedElements,
      },
    });

    setLocalSelectedHeaderElement(newElement.id);
    onSelect?.({ type: newElement.type, id: newElement.id });
  };

  const handleAddHeaderElement = (elementId: string) => {
    // Add is the same as copy
    handleCopyHeaderElement(elementId);
  };

  const handleDeleteHeaderElement = (elementId: string) => {
    const updatedElements = headerElements.filter(e => e.id !== elementId);
    setHeaderElements(updatedElements);
    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        headerElements: updatedElements,
      },
    });
    setLocalSelectedHeaderElement(null);
    onSelect?.(null);
  };

  const handleUpdateHeaderElement = (elementId: string, newText: string) => {
    const updatedElements = headerElements.map(e =>
      e.id === elementId ? { ...e, text: newText } : e
    );
    setHeaderElements(updatedElements);
    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        headerElements: updatedElements,
      },
    });
  };

  const renderHeaderControls = (elementId: string) => {
    if (localSelectedHeaderElement !== elementId) {
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
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsClickingControl(true);
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopyHeaderElement(elementId);
            setIsClickingControl(false);
          }}
          className="h-6 w-6 flex items-center justify-center hover:bg-valasys-orange/10 rounded transition-colors cursor-pointer"
          title="Copy text"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsClickingControl(true);
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddHeaderElement(elementId);
            setIsClickingControl(false);
          }}
          className="h-6 w-6 flex items-center justify-center hover:bg-valasys-orange/10 rounded transition-colors cursor-pointer"
          title="Add/Duplicate"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsClickingControl(true);
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDeleteHeaderElement(elementId);
            setIsClickingControl(false);
          }}
          className="h-6 w-6 flex items-center justify-center hover:bg-red-100 text-red-500 rounded transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };

  const isSelected = (featureId: string) => selectedFeatureId === featureId;
  const isCardHovered = (featureId: string) => hoveredCardId === featureId;
  const isElementHovered = (featureId: string, element: "icon" | "title" | "description") =>
    hoveredElement?.featureId === featureId && hoveredElement?.element === element;

  return (
    <div className="relative w-full overflow-hidden bg-white p-8 rounded-3xl border border-gray-100">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          {headerElements.map((element) => {
            const isHeading = element.type === "heading";
            const TagName = isHeading ? "h2" : "p";

            return (
              <div key={element.id} className="relative">
                <TagName
                  className={cn(
                    isHeading
                      ? "text-3xl font-bold text-gray-900 cursor-text p-2 rounded transition-all outline-none"
                      : "text-gray-600 cursor-text p-2 rounded transition-all outline-none",
                    localSelectedHeaderElement === element.id
                      ? "border-2 border-solid border-valasys-orange"
                      : hoveredHeaderElement === element.id
                      ? "border-2 border-dashed border-valasys-orange bg-gray-50"
                      : "border-2 border-transparent hover:bg-gray-50"
                  )}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    handleUpdateHeaderElement(element.id, e.currentTarget.textContent || "");
                    if (!isClickingControl) {
                      setLocalSelectedHeaderElement(null);
                      onSelect?.(null);
                    }
                  }}
                  onFocus={(e) => {
                    setLocalSelectedHeaderElement(element.id);
                    onSelect?.({ type: element.type, id: element.id });
                  }}
                  onMouseEnter={() => setHoveredHeaderElement(element.id)}
                  onMouseLeave={() => setHoveredHeaderElement(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (localSelectedHeaderElement === element.id) return;
                    setLocalSelectedHeaderElement(element.id);
                    onSelect?.({ type: element.type, id: element.id });
                  }}
                >
                  {element.text || (isHeading ? "Why Choose Us" : "Discover the key features that make our product special")}
                </TagName>
                {renderHeaderControls(element.id)}
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div
          className="grid gap-8"
          style={{
            gridTemplateColumns: `repeat(${block.properties.columns || 4}, 1fr)`,
          }}
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className={cn(
                "relative group transition-all rounded-lg p-4",
                isSelected(feature.id)
                  ? "border-2 border-solid border-valasys-orange bg-valasys-orange/5 shadow-lg shadow-valasys-orange/20"
                  : isCardHovered(feature.id)
                  ? "border-2 border-dashed border-valasys-orange bg-gray-50"
                  : "border-2 border-transparent"
              )}
              onMouseEnter={() => setHoveredCardId(feature.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              onClick={(e) => {
                e.stopPropagation();
                const newSelectedId = selectedFeatureId === feature.id ? null : feature.id;
                setSelectedFeatureId(newSelectedId);
                setLocalSelectedHeaderElement(null);
                onSelect?.(newSelectedId ? { type: "feature", id: newSelectedId } : null);
              }}
            >
              {/* Icon */}
              <div
                className={cn(
                  "text-4xl mb-4 cursor-text p-2 rounded transition-all",
                  isElementHovered(feature.id, "icon")
                    ? "border-2 border-dashed border-valasys-orange bg-gray-50"
                    : "border-2 border-transparent"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSelected(feature.id)) {
                    setEditingFeatureId(feature.id);
                  }
                }}
                onMouseEnter={() => setHoveredElement({ featureId: feature.id, element: "icon" })}
                onMouseLeave={() => setHoveredElement(null)}
              >
                {isSelected(feature.id) && editingFeatureId === feature.id ? (
                  <Input
                    value={feature.icon}
                    onChange={(e) => handleUpdateFeature(feature.id, { icon: e.target.value })}
                    onFocus={() => setEditingFeatureId(feature.id)}
                    onBlur={() => setEditingFeatureId(null)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-auto w-12 border-0 bg-transparent p-0 text-center shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-4xl"
                    maxLength={2}
                    autoFocus
                  />
                ) : (
                  <span className={isSelected(feature.id) ? "opacity-70" : ""}>{feature.icon}</span>
                )}
              </div>

              {/* Title */}
              {isSelected(feature.id) && editingFeatureId === feature.id ? (
                <Input
                  value={feature.title}
                  onChange={(e) => handleUpdateFeature(feature.id, { title: e.target.value })}
                  onFocus={() => setEditingFeatureId(feature.id)}
                  onBlur={() => setEditingFeatureId(null)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Feature title"
                  className="font-semibold text-gray-900 mb-2 border border-valasys-orange/20 bg-white px-2 py-1 rounded shadow-none focus-visible:ring-1 focus-visible:ring-valasys-orange focus-visible:ring-offset-0"
                  autoFocus
                />
              ) : (
                <h3
                  className={cn(
                    "text-lg font-semibold text-gray-900 mb-2 cursor-text p-2 rounded transition-all",
                    isElementHovered(feature.id, "title")
                      ? "border-2 border-dashed border-valasys-orange bg-gray-50"
                      : "border-2 border-transparent"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSelected(feature.id)) {
                      setEditingFeatureId(feature.id);
                    }
                  }}
                  onMouseEnter={() => setHoveredElement({ featureId: feature.id, element: "title" })}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  {feature.title}
                </h3>
              )}

              {/* Description */}
              {isSelected(feature.id) && editingFeatureId === feature.id ? (
                <Textarea
                  value={feature.description}
                  onChange={(e) => handleUpdateFeature(feature.id, { description: e.target.value })}
                  onFocus={() => setEditingFeatureId(feature.id)}
                  onBlur={() => setEditingFeatureId(null)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Feature description"
                  className="text-sm text-gray-600 resize-none border border-valasys-orange/20 bg-white px-2 py-1 rounded shadow-none focus-visible:ring-1 focus-visible:ring-valasys-orange focus-visible:ring-offset-0"
                  rows={3}
                  autoFocus
                />
              ) : (
                <p
                  className={cn(
                    "text-sm text-gray-600 cursor-text p-2 rounded transition-all",
                    isElementHovered(feature.id, "description")
                      ? "border-2 border-dashed border-valasys-orange bg-gray-50"
                      : "border-2 border-transparent"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSelected(feature.id)) {
                      setEditingFeatureId(feature.id);
                    }
                  }}
                  onMouseEnter={() => setHoveredElement({ featureId: feature.id, element: "description" })}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  {feature.description}
                </p>
              )}

              {renderControls(feature.id)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
