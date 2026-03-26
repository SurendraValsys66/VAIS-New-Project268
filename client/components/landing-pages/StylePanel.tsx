import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Palette, Type, Box, Sparkles, ToggleLeft, AlignLeft, AlignCenter, AlignRight, AlignJustify, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface StylePanelProps {
  onClose?: () => void;
}

interface StyleState {
  // Layout
  width: string;
  blockAlignment: "left" | "center" | "right" | "justify";
  textAlignment: "left" | "center" | "right" | "justify";
  lineHeight: string;
  
  // Spacing
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  
  // Background
  backgroundColor: string;
  backgroundImage: string;
  backgroundImageUrl: string;
  backgroundSize: "cover" | "contain" | "auto" | "stretch";
  backgroundPosition: "top" | "center" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  backgroundRepeat: "repeat" | "no-repeat" | "repeat-x" | "repeat-y";
  backgroundAttachment: "scroll" | "fixed";
  backgroundOpacity: string;
  
  // Rounded Corners
  borderRadiusTopLeft: string;
  borderRadiusTopRight: string;
  borderRadiusBottomLeft: string;
  borderRadiusBottomRight: string;
  
  // Borders
  borderSize: string;
  borderColor: string;
  
  // Text
  textColor: string;
  fontSize: string;
  fontWeight: string;
  
  // Effects
  boxShadow: string;
  
  // Content Visibility
  contentVisibility: "all" | "desktop" | "mobile";
  displayConditions: string[];
}

export const StylePanel: React.FC<StylePanelProps> = ({ onClose }) => {
  const [styles, setStyles] = useState<StyleState>({
    width: "100",
    blockAlignment: "left",
    textAlignment: "left",
    lineHeight: "1.5",
    paddingTop: "16",
    paddingRight: "16",
    paddingBottom: "16",
    paddingLeft: "16",
    marginTop: "0",
    marginRight: "0",
    marginBottom: "0",
    marginLeft: "0",
    backgroundColor: "#ffffff",
    backgroundImage: "",
    backgroundImageUrl: "",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "scroll",
    backgroundOpacity: "100",
    borderRadiusTopLeft: "0",
    borderRadiusTopRight: "0",
    borderRadiusBottomLeft: "0",
    borderRadiusBottomRight: "0",
    borderSize: "0",
    borderColor: "#000000",
    textColor: "#000000",
    fontSize: "16",
    fontWeight: "400",
    boxShadow: "none",
    contentVisibility: "all",
    displayConditions: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    layout: true,
    spacing: true,
    background: true,
    roundedCorners: true,
    borders: true,
    typography: true,
    effects: true,
    contentVisibility: true,
  });

  const [linkPaddingValues, setLinkPaddingValues] = useState(false);
  const [linkMarginValues, setLinkMarginValues] = useState(false);
  const [paddingUnit, setPaddingUnit] = useState<"px" | "%">("px");
  const [marginUnit, setMarginUnit] = useState<"px" | "%">("px");

  // Validation helper for spacing values
  const validateSpacingValue = (val: string, unit: "px" | "%"): string => {
    const numVal = Number(val);
    if (isNaN(numVal)) return "0";

    // For percentage, cap at 100
    if (unit === "%") {
      return String(Math.min(100, Math.max(0, numVal)));
    }
    // For px, allow any non-negative value
    return String(Math.max(0, numVal));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateStyle = (key: keyof StyleState, value: any) => {
    setStyles((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const SectionHeader = ({ icon: Icon, label, section }: { icon: any; label: string; section: keyof typeof expandedSections }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-valasys-orange" />
        <span className="font-semibold text-sm text-gray-900">{label}</span>
      </div>
      <ChevronDown
        className={cn(
          "w-4 h-4 text-gray-600 transition-transform",
          expandedSections[section] && "rotate-180"
        )}
      />
    </button>
  );

  const InputGroup = ({ label, value, onChange, unit = "" }: any) => (
    <div className="flex gap-2 items-center">
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-xs"
      />
      {unit && <span className="text-xs text-gray-500 w-6">{unit}</span>}
    </div>
  );

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 bg-white">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-valasys-orange" />
          <h2 className="font-bold text-gray-900">Styling</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Layout Section */}
        <div>
          <SectionHeader icon={Box} label="Layout" section="layout" />
          {expandedSections.layout && (
            <div className="px-4 py-4 space-y-4 bg-gray-50">
              {/* Width */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Width</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={styles.width}
                    onChange={(e) => updateStyle("width", e.target.value)}
                    className="flex-1 text-xs"
                  />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              </div>

              {/* Block Alignment */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Block Alignment</label>
                <div className="flex gap-2">
                  {[
                    { value: "left", icon: AlignLeft },
                    { value: "center", icon: AlignCenter },
                    { value: "right", icon: AlignRight },
                    { value: "justify", icon: AlignJustify },
                  ].map((opt) => {
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateStyle("blockAlignment", opt.value)}
                        className={cn(
                          "flex-1 py-2 px-2 rounded flex items-center justify-center transition-colors border",
                          styles.blockAlignment === opt.value
                            ? "bg-blue-100 border-blue-400 text-blue-600"
                            : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-150"
                        )}
                        title={opt.value}
                      >
                        <IconComponent className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Text Alignment</label>
                <div className="flex gap-2">
                  {[
                    { value: "left", icon: AlignLeft },
                    { value: "center", icon: AlignCenter },
                    { value: "right", icon: AlignRight },
                    { value: "justify", icon: AlignJustify },
                  ].map((opt) => {
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateStyle("textAlignment", opt.value)}
                        className={cn(
                          "flex-1 py-2 px-2 rounded flex items-center justify-center transition-colors border",
                          styles.textAlignment === opt.value
                            ? "bg-blue-100 border-blue-400 text-blue-600"
                            : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-150"
                        )}
                        title={opt.value}
                      >
                        <IconComponent className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Line Height */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600">Line Height</label>
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Line height settings">
                    <Settings className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>
                <div className="space-y-3">
                  {/* Preset buttons */}
                  <div className="flex gap-2">
                    {[
                      { label: "1x", value: "1" },
                      { label: "1.5x", value: "1.5" },
                      { label: "2x", value: "2" },
                      { label: "3x", value: "3" },
                    ].map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => updateStyle("lineHeight", preset.value)}
                        className={cn(
                          "flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors border",
                          styles.lineHeight === preset.value
                            ? "bg-blue-100 border-blue-400 text-blue-600"
                            : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-150"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  {/* Custom slider */}
                  <div>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={styles.lineHeight}
                      onChange={(e) => updateStyle("lineHeight", e.target.value)}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500 mt-1 block text-center">{parseFloat(styles.lineHeight).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spacing Section */}
        <div>
          <SectionHeader icon={Box} label="Spacing" section="spacing" />
          {expandedSections.spacing && (
            <div className="px-4 py-3 space-y-4 bg-gray-50">
              {/* Padding */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-600">Padding</label>
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={linkPaddingValues}
                      onChange={(e) => setLinkPaddingValues(e.target.checked)}
                      className="cursor-pointer w-3 h-3"
                    />
                    <span>Group sides</span>
                  </label>
                </div>
                {linkPaddingValues ? (
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-400">⊞</span>
                    <Input
                      type="number"
                      value={styles.paddingTop}
                      onChange={(e) => {
                        const validated = validateSpacingValue(e.target.value, paddingUnit);
                        updateStyle("paddingTop", validated);
                        updateStyle("paddingRight", validated);
                        updateStyle("paddingBottom", validated);
                        updateStyle("paddingLeft", validated);
                      }}
                      className="w-12 text-xs h-7"
                    />
                    <Select value={paddingUnit} onValueChange={(val) => setPaddingUnit(val as "px" | "%")}>
                      <SelectTrigger className="w-16 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="px">px</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex flex-col gap-0 ml-auto">
                      <button
                        onClick={() => {
                          const newVal = String(Number(styles.paddingTop) + 1);
                          const validated = validateSpacingValue(newVal, paddingUnit);
                          updateStyle("paddingTop", validated);
                          updateStyle("paddingRight", validated);
                          updateStyle("paddingBottom", validated);
                          updateStyle("paddingLeft", validated);
                        }}
                        className="text-xs text-gray-600 hover:text-gray-900 leading-3"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => {
                          const newVal = String(Math.max(0, Number(styles.paddingTop) - 1));
                          const validated = validateSpacingValue(newVal, paddingUnit);
                          updateStyle("paddingTop", validated);
                          updateStyle("paddingRight", validated);
                          updateStyle("paddingBottom", validated);
                          updateStyle("paddingLeft", validated);
                        }}
                        className="text-xs text-gray-600 hover:text-gray-900 leading-3"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "paddingTop", label: "⊞" },
                      { key: "paddingRight", label: "⊞" },
                      { key: "paddingBottom", label: "⊞" },
                      { key: "paddingLeft", label: "⊞" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex gap-1.5 items-center">
                        <span className="text-xs text-gray-400">{label}</span>
                        <Input
                          type="number"
                          value={styles[key as keyof StyleState]}
                          onChange={(e) => {
                            const validated = validateSpacingValue(e.target.value, paddingUnit);
                            updateStyle(key as keyof StyleState, validated);
                          }}
                          className="w-10 text-xs h-7"
                        />
                        <Select value={paddingUnit} onValueChange={(val) => setPaddingUnit(val as "px" | "%")}>
                          <SelectTrigger className="w-14 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="px">px</SelectItem>
                            <SelectItem value="%">%</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex flex-col gap-0">
                          <button
                            onClick={() => {
                              const newVal = String(Number(styles[key as keyof StyleState]) + 1);
                              const validated = validateSpacingValue(newVal, paddingUnit);
                              updateStyle(key as keyof StyleState, validated);
                            }}
                            className="text-xs text-gray-600 hover:text-gray-900 leading-3"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => {
                              const newVal = String(Math.max(0, Number(styles[key as keyof StyleState]) - 1));
                              const validated = validateSpacingValue(newVal, paddingUnit);
                              updateStyle(key as keyof StyleState, validated);
                            }}
                            className="text-xs text-gray-600 hover:text-gray-900 leading-3"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Margin */}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-600">Margin</label>
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={linkMarginValues}
                      onChange={(e) => setLinkMarginValues(e.target.checked)}
                      className="cursor-pointer w-3 h-3"
                    />
                    <span>Group sides</span>
                  </label>
                </div>
                {linkMarginValues ? (
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-400">⊞</span>
                    <Input
                      type="number"
                      value={styles.marginTop}
                      onChange={(e) => {
                        const validated = validateSpacingValue(e.target.value, marginUnit);
                        updateStyle("marginTop", validated);
                        updateStyle("marginRight", validated);
                        updateStyle("marginBottom", validated);
                        updateStyle("marginLeft", validated);
                      }}
                      className="w-12 text-xs h-7"
                    />
                    <Select value={marginUnit} onValueChange={(val) => setMarginUnit(val as "px" | "%")}>
                      <SelectTrigger className="w-16 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="px">px</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex flex-col gap-0 ml-auto">
                      <button
                        onClick={() => {
                          const newVal = String(Number(styles.marginTop) + 1);
                          const validated = validateSpacingValue(newVal, marginUnit);
                          updateStyle("marginTop", validated);
                          updateStyle("marginRight", validated);
                          updateStyle("marginBottom", validated);
                          updateStyle("marginLeft", validated);
                        }}
                        className="text-xs text-gray-600 hover:text-gray-900 leading-3"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => {
                          const newVal = String(Math.max(0, Number(styles.marginTop) - 1));
                          const validated = validateSpacingValue(newVal, marginUnit);
                          updateStyle("marginTop", validated);
                          updateStyle("marginRight", validated);
                          updateStyle("marginBottom", validated);
                          updateStyle("marginLeft", validated);
                        }}
                        className="text-xs text-gray-600 hover:text-gray-900 leading-3"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "marginTop", label: "⊞" },
                      { key: "marginRight", label: "⊞" },
                      { key: "marginBottom", label: "⊞" },
                      { key: "marginLeft", label: "⊞" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex gap-1.5 items-center">
                        <span className="text-xs text-gray-400">{label}</span>
                        <Input
                          type="number"
                          value={styles[key as keyof StyleState]}
                          onChange={(e) => {
                            const validated = validateSpacingValue(e.target.value, marginUnit);
                            updateStyle(key as keyof StyleState, validated);
                          }}
                          className="w-10 text-xs h-7"
                        />
                        <Select value={marginUnit} onValueChange={(val) => setMarginUnit(val as "px" | "%")}>
                          <SelectTrigger className="w-14 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="px">px</SelectItem>
                            <SelectItem value="%">%</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex flex-col gap-0">
                          <button
                            onClick={() => {
                              const newVal = String(Number(styles[key as keyof StyleState]) + 1);
                              const validated = validateSpacingValue(newVal, marginUnit);
                              updateStyle(key as keyof StyleState, validated);
                            }}
                            className="text-xs text-gray-600 hover:text-gray-900 leading-3"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => {
                              const newVal = String(Math.max(0, Number(styles[key as keyof StyleState]) - 1));
                              const validated = validateSpacingValue(newVal, marginUnit);
                              updateStyle(key as keyof StyleState, validated);
                            }}
                            className="text-xs text-gray-600 hover:text-gray-900 leading-3"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Background Section */}
        <div>
          <SectionHeader icon={Palette} label="Background" section="background" />
          {expandedSections.background && (
            <div className="px-4 py-4 space-y-4 bg-gray-50">
              {/* Color */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={styles.backgroundColor}
                    onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={styles.backgroundColor}
                    onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>

              {/* Image */}
              <div className="border-t pt-4">
                <Button variant="outline" className="w-full text-xs">
                  Add Image
                </Button>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Image URL</label>
                <Input
                  type="text"
                  value={styles.backgroundImageUrl}
                  onChange={(e) => updateStyle("backgroundImageUrl", e.target.value)}
                  className="text-xs"
                  placeholder="https://..."
                />
              </div>

              {/* Background Size */}
              <div className="border-t pt-4">
                <label className="text-xs font-semibold text-gray-600 block mb-2">Size</label>
                <Select value={styles.backgroundSize} onValueChange={(val) => updateStyle("backgroundSize", val)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="stretch">Stretch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Background Position */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Position</label>
                <Select value={styles.backgroundPosition} onValueChange={(val) => updateStyle("backgroundPosition", val)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Background Repeat */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Repeat</label>
                <Select value={styles.backgroundRepeat} onValueChange={(val) => updateStyle("backgroundRepeat", val)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-repeat">No Repeat</SelectItem>
                    <SelectItem value="repeat">Repeat</SelectItem>
                    <SelectItem value="repeat-x">Repeat X</SelectItem>
                    <SelectItem value="repeat-y">Repeat Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Background Attachment */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Attachment</label>
                <Select value={styles.backgroundAttachment} onValueChange={(val) => updateStyle("backgroundAttachment", val)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scroll">Scroll</SelectItem>
                    <SelectItem value="fixed">Fixed (Parallax)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Background Opacity */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Opacity: {styles.backgroundOpacity}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={styles.backgroundOpacity}
                  onChange={(e) => updateStyle("backgroundOpacity", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Rounded Corners Section */}
        <div>
          <SectionHeader icon={Sparkles} label="Rounded Corners" section="roundedCorners" />
          {expandedSections.roundedCorners && (
            <div className="px-4 py-4 space-y-4 bg-gray-50">
              <div className="space-y-2">
                <InputGroup
                  label="Radius"
                  value={styles.borderRadiusTopLeft}
                  onChange={(val: string) => {
                    updateStyle("borderRadiusTopLeft", val);
                    updateStyle("borderRadiusTopRight", val);
                    updateStyle("borderRadiusBottomLeft", val);
                    updateStyle("borderRadiusBottomRight", val);
                  }}
                  unit="px"
                />
              </div>
            </div>
          )}
        </div>

        {/* Borders Section */}
        <div>
          <SectionHeader icon={Box} label="Borders" section="borders" />
          {expandedSections.borders && (
            <div className="px-4 py-4 space-y-4 bg-gray-50">
              <label className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                <input type="checkbox" />
                Apply to all slides
              </label>

              {/* Size */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Size</label>
                <InputGroup
                  value={styles.borderSize}
                  onChange={(val: string) => updateStyle("borderSize", val)}
                  unit="px"
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={styles.borderColor}
                    onChange={(e) => updateStyle("borderColor", e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={styles.borderColor}
                    onChange={(e) => updateStyle("borderColor", e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Typography Section */}
        <div>
          <SectionHeader icon={Type} label="Typography" section="typography" />
          {expandedSections.typography && (
            <div className="px-4 py-4 space-y-4 bg-gray-50">
              {/* Text Color */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Text Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={styles.textColor}
                    onChange={(e) => updateStyle("textColor", e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={styles.textColor}
                    onChange={(e) => updateStyle("textColor", e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Font Size: {styles.fontSize}px</label>
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={styles.fontSize}
                  onChange={(e) => updateStyle("fontSize", e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Font Weight */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Font Weight</label>
                <select
                  value={styles.fontWeight}
                  onChange={(e) => updateStyle("fontWeight", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-valasys-orange focus:border-valasys-orange"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extrabold (800)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Effects Section */}
        <div>
          <SectionHeader icon={Sparkles} label="Effects" section="effects" />
          {expandedSections.effects && (
            <div className="px-4 py-4 space-y-4 bg-gray-50">
              {/* Shadow */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Shadow</label>
                <select
                  value={styles.boxShadow}
                  onChange={(e) => updateStyle("boxShadow", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-valasys-orange focus:border-valasys-orange"
                >
                  <option value="none">None</option>
                  <option value="0 1px 2px rgba(0,0,0,0.05)">Small</option>
                  <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                  <option value="0 10px 15px rgba(0,0,0,0.1)">Large</option>
                  <option value="0 20px 25px rgba(0,0,0,0.15)">Extra Large</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Content Visibility Section */}
        <div>
          <SectionHeader icon={ToggleLeft} label="Content Visibility" section="contentVisibility" />
          {expandedSections.contentVisibility && (
            <div className="px-4 py-4 space-y-4 bg-gray-50">
              <p className="text-xs text-gray-600 mb-3">Display or hide content based on the type of device or other specific conditions</p>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Show on:</label>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All devices" },
                    { value: "desktop", label: "Only on desktop" },
                    { value: "mobile", label: "Only on mobile" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        name="visibility"
                        value={opt.value}
                        checked={styles.contentVisibility === opt.value}
                        onChange={(e) => updateStyle("contentVisibility", e.target.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Display Conditions */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600">Display conditions</label>
                  <Button variant="ghost" size="sm" className="text-xs h-6">
                    + Add condition
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-2">
        <Button className="w-full bg-valasys-orange hover:bg-valasys-orange/90 text-white rounded-lg">
          Apply Styles
        </Button>
        <Button variant="outline" className="w-full rounded-lg">
          Reset
        </Button>
      </div>
    </div>
  );
};
