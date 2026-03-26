import React from "react";
import { BuilderComponent } from "@/types/builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ElementStylePanelProps {
  component: BuilderComponent | null;
  onUpdate: (updates: Partial<BuilderComponent>) => void;
  onClose: () => void;
}

interface StyleState {
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  padding: string;
  margin: string;
  width: string;
  height: string;
  borderRadius: string;
  borderColor: string;
  borderWidth: string;
}

export const ElementStylePanel: React.FC<ElementStylePanelProps> = ({
  component,
  onUpdate,
  onClose,
}) => {
  const [styles, setStyles] = React.useState<StyleState>({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontSize: "16",
    padding: "16",
    margin: "0",
    width: "100",
    height: "",
    borderRadius: "0",
    borderColor: "#000000",
    borderWidth: "0",
  });

  const [expandedSections, setExpandedSections] = React.useState({
    colors: true,
    sizing: true,
    spacing: true,
    borders: true,
  });

  React.useEffect(() => {
    if (component) {
      setStyles({
        backgroundColor: component.backgroundColor || "#ffffff",
        textColor: component.textColor || "#000000",
        fontSize: component.fontSize ? String(component.fontSize) : "16",
        padding: component.padding ? String(component.padding) : "16",
        margin: component.margin ? String(component.margin) : "0",
        width: component.width ? String(component.width) : "100",
        height: component.height ? String(component.height) : "",
        borderRadius: component.borderRadius ? String(component.borderRadius) : "0",
        borderColor: component.borderColor || "#000000",
        borderWidth: component.borderWidth ? String(component.borderWidth) : "0",
      });
    }
  }, [component]);

  const handleStyleChange = (key: keyof StyleState, value: string) => {
    setStyles((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Update the component with the new style
    const updates: any = {};
    if (
      key === "backgroundColor" ||
      key === "textColor" ||
      key === "borderColor"
    ) {
      updates[key] = value;
    } else {
      updates[key] = isNaN(Number(value)) ? value : Number(value);
    }
    onUpdate(updates);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const SectionHeader = ({
    title,
    section,
  }: {
    title: string;
    section: keyof typeof expandedSections;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors group"
    >
      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
        {title}
      </span>
      <ChevronDown
        className={cn(
          "w-4 h-4 text-gray-400 transition-transform",
          expandedSections[section] && "rotate-180"
        )}
      />
    </button>
  );

  const StyleInput = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
  }) => (
    <div className="space-y-2 px-4 py-3 border-b border-gray-100">
      <label className="text-xs font-bold text-gray-700">{label}</label>
      {type === "color" ? (
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-9 text-sm"
          />
          {type === "number" && <span className="text-xs text-gray-500">px</span>}
        </div>
      )}
    </div>
  );

  if (!component) {
    return (
      <aside className="w-80 flex-shrink-0 h-full border-l border-gray-200 bg-white flex flex-col min-h-0">
        <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700">Style Panel</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Select an element to edit
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 flex-shrink-0 h-full border-l border-gray-200 bg-white flex flex-col overflow-hidden min-h-0">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-700">
            {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Colors Section */}
        <div>
          <SectionHeader title="Colors" section="colors" />
          {expandedSections.colors && (
            <>
              <StyleInput
                label="Background Color"
                value={styles.backgroundColor}
                onChange={(value) =>
                  handleStyleChange("backgroundColor", value)
                }
                type="color"
              />
              <StyleInput
                label="Text Color"
                value={styles.textColor}
                onChange={(value) => handleStyleChange("textColor", value)}
                type="color"
              />
              <StyleInput
                label="Border Color"
                value={styles.borderColor}
                onChange={(value) => handleStyleChange("borderColor", value)}
                type="color"
              />
            </>
          )}
        </div>

        {/* Sizing Section */}
        <div>
          <SectionHeader title="Sizing" section="sizing" />
          {expandedSections.sizing && (
            <>
              <StyleInput
                label="Width (%)"
                value={styles.width}
                onChange={(value) => handleStyleChange("width", value)}
                type="number"
                placeholder="100"
              />
              <StyleInput
                label="Height (px)"
                value={styles.height}
                onChange={(value) => handleStyleChange("height", value)}
                type="number"
                placeholder="auto"
              />
              <StyleInput
                label="Font Size (px)"
                value={styles.fontSize}
                onChange={(value) => handleStyleChange("fontSize", value)}
                type="number"
                placeholder="16"
              />
            </>
          )}
        </div>

        {/* Spacing Section */}
        <div>
          <SectionHeader title="Spacing" section="spacing" />
          {expandedSections.spacing && (
            <>
              <StyleInput
                label="Padding (px)"
                value={styles.padding}
                onChange={(value) => handleStyleChange("padding", value)}
                type="number"
                placeholder="16"
              />
              <StyleInput
                label="Margin (px)"
                value={styles.margin}
                onChange={(value) => handleStyleChange("margin", value)}
                type="number"
                placeholder="0"
              />
            </>
          )}
        </div>

        {/* Borders Section */}
        <div>
          <SectionHeader title="Borders" section="borders" />
          {expandedSections.borders && (
            <>
              <StyleInput
                label="Border Width (px)"
                value={styles.borderWidth}
                onChange={(value) => handleStyleChange("borderWidth", value)}
                type="number"
                placeholder="0"
              />
              <StyleInput
                label="Border Radius (px)"
                value={styles.borderRadius}
                onChange={(value) => handleStyleChange("borderRadius", value)}
                type="number"
                placeholder="0"
              />
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
