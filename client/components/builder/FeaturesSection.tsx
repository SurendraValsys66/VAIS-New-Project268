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
}

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  block,
  onUpdate,
}) => {
  const [selectedFeatureId, setSelectedFeatureId] = React.useState<string | null>(null);
  const [hoveredFeatureId, setHoveredFeatureId] = React.useState<string | null>(null);
  const [editingFeatureId, setEditingFeatureId] = React.useState<string | null>(null);

  const features: Feature[] = (block.properties.features || []) as Feature[];

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
  };

  const handleDeleteFeature = (featureId: string) => {
    // Don't allow deleting if it's the only feature
    if (features.length === 1) return;

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
          title="Duplicate feature"
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
          title="Duplicate feature"
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
          disabled={features.length === 1}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };

  const isSelected = (featureId: string) => selectedFeatureId === featureId;
  const isHovered = (featureId: string) => hoveredFeatureId === featureId;

  return (
    <div className="relative w-full overflow-hidden bg-white p-8 rounded-3xl border border-gray-100">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2
            className="text-3xl font-bold text-gray-900 cursor-text hover:bg-gray-50 p-2 rounded"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              handleUpdateBlock({ heading: e.currentTarget.textContent });
            }}
          >
            {block.properties.heading || "Why Choose Us"}
          </h2>
          <p
            className="text-gray-600 cursor-text hover:bg-gray-50 p-2 rounded"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              handleUpdateBlock({ description: e.currentTarget.textContent });
            }}
          >
            {block.properties.description || "Discover the key features that make our product special"}
          </p>
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
                "relative group transition-all rounded-lg p-4 cursor-pointer",
                isSelected(feature.id)
                  ? "border-2 border-solid border-valasys-orange bg-valasys-orange/5"
                  : isHovered(feature.id)
                  ? "border-2 border-dashed border-valasys-orange/50 bg-gray-50"
                  : "border-2 border-transparent hover:bg-gray-50"
              )}
              onMouseEnter={() => setHoveredFeatureId(feature.id)}
              onMouseLeave={() => setHoveredFeatureId(null)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFeatureId(selectedFeatureId === feature.id ? null : feature.id);
              }}
            >
              {/* Icon */}
              <div className="text-4xl mb-4">
                {isSelected(feature.id) ? (
                  <Input
                    value={feature.icon}
                    onChange={(e) => handleUpdateFeature(feature.id, { icon: e.target.value })}
                    onFocus={() => setEditingFeatureId(feature.id)}
                    onBlur={() => setEditingFeatureId(null)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-auto w-12 border-0 bg-transparent p-0 text-center shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-4xl"
                    maxLength={2}
                  />
                ) : (
                  <span>{feature.icon}</span>
                )}
              </div>

              {/* Title */}
              {isSelected(feature.id) ? (
                <Input
                  value={feature.title}
                  onChange={(e) => handleUpdateFeature(feature.id, { title: e.target.value })}
                  onFocus={() => setEditingFeatureId(feature.id)}
                  onBlur={() => setEditingFeatureId(null)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Feature title"
                  className="font-semibold text-gray-900 mb-2 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              ) : (
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
              )}

              {/* Description */}
              {isSelected(feature.id) ? (
                <Textarea
                  value={feature.description}
                  onChange={(e) => handleUpdateFeature(feature.id, { description: e.target.value })}
                  onFocus={() => setEditingFeatureId(feature.id)}
                  onBlur={() => setEditingFeatureId(null)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Feature description"
                  className="text-sm text-gray-600 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-gray-600">{feature.description}</p>
              )}

              {renderControls(feature.id)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
