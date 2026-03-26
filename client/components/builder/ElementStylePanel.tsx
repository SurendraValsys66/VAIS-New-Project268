import React from "react";
import { BuilderComponent } from "@/types/builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
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
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  width: string;
  height: string;
  borderRadius: string;
  borderColor: string;
  borderWidth: string;
  textAlign: "left" | "center" | "right" | "justify";
  justifyContent: "flex-start" | "center" | "flex-end" | "space-between";
}

interface SpacingState {
  groupPadding: boolean;
  groupMargin: boolean;
}

interface SizingUnits {
  width: "%" | "px";
  height: "%" | "px";
  fontSize: "%" | "px";
}

interface SpacingUnits {
  paddingUnit: "%" | "px";
  marginUnit: "%" | "px";
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
    paddingTop: "0",
    paddingRight: "0",
    paddingBottom: "0",
    paddingLeft: "0",
    marginTop: "0",
    marginRight: "0",
    marginBottom: "0",
    marginLeft: "0",
    width: "100",
    height: "",
    borderRadius: "0",
    borderColor: "#000000",
    borderWidth: "0",
    textAlign: "left",
    justifyContent: "flex-start",
  });

  const [spacing, setSpacing] = React.useState<SpacingState>({
    groupPadding: true,
    groupMargin: true,
  });

  const [sizingUnits, setSizingUnits] = React.useState<SizingUnits>({
    width: "%",
    height: "px",
    fontSize: "px",
  });

  const [spacingUnits, setSpacingUnits] = React.useState<SpacingUnits>({
    paddingUnit: "px",
    marginUnit: "px",
  });

  const [expandedSections, setExpandedSections] = React.useState({
    alignment: true,
    colors: true,
    sizing: true,
    spacing: true,
    borders: true,
  });

  const [groupPaddingValues, setGroupPaddingValues] = React.useState(false);
  const [groupMarginValues, setGroupMarginValues] = React.useState(false);

  // Use ref to track pending updates to debounce
  const debounceTimerRef = React.useRef<NodeJS.Timeout>();
  const pendingUpdatesRef = React.useRef<Partial<BuilderComponent>>({});

  React.useEffect(() => {
    if (component) {
      const props = component.props || {};
      setStyles({
        backgroundColor: props.backgroundColor || "#ffffff",
        textColor: props.textColor || "#000000",
        fontSize: props.fontSize ? String(props.fontSize) : "16",
        paddingTop: props.paddingTop ? String(props.paddingTop) : "0",
        paddingRight: props.paddingRight ? String(props.paddingRight) : "0",
        paddingBottom: props.paddingBottom ? String(props.paddingBottom) : "0",
        paddingLeft: props.paddingLeft ? String(props.paddingLeft) : "0",
        marginTop: props.marginTop ? String(props.marginTop) : "0",
        marginRight: props.marginRight ? String(props.marginRight) : "0",
        marginBottom: props.marginBottom ? String(props.marginBottom) : "0",
        marginLeft: props.marginLeft ? String(props.marginLeft) : "0",
        width: props.width ? String(props.width) : "100",
        height: props.height ? String(props.height) : "",
        borderRadius: props.borderRadius ? String(props.borderRadius) : "0",
        borderColor: props.borderColor || "#000000",
        borderWidth: props.borderWidth ? String(props.borderWidth) : "0",
        textAlign: props.textAlign || "left",
        justifyContent: props.justifyContent || "flex-start",
      });

      // Initialize units from component
      setSizingUnits({
        width: component.widthUnit || "%",
        height: component.heightUnit || "px",
        fontSize: component.fontSizeUnit || "px",
      });
    }
  }, [component?.id]); // Only update when component ID changes

  const handleStyleChange = React.useCallback(
    (key: keyof StyleState, value: string) => {
      // Update local state immediately for responsive UI
      setStyles((prev) => ({
        ...prev,
        [key]: value,
      }));

      // Prepare the update for the parent
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

      // Store in pending updates
      pendingUpdatesRef.current = {
        ...pendingUpdatesRef.current,
        ...updates,
      };

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the update call to prevent parent re-renders while typing
      debounceTimerRef.current = setTimeout(() => {
        onUpdate(pendingUpdatesRef.current);
        pendingUpdatesRef.current = {};
      }, 300); // 300ms debounce
    },
    [onUpdate]
  );

  const handleGroupPaddingToggle = () => {
    setSpacing((prev) => ({
      ...prev,
      groupPadding: !prev.groupPadding,
    }));
  };

  const handleGroupMarginToggle = () => {
    setSpacing((prev) => ({
      ...prev,
      groupMargin: !prev.groupMargin,
    }));
  };

  React.useEffect(() => {
    // Cleanup debounce timer on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleUnitChange = React.useCallback(
    (property: keyof SizingUnits, newUnit: "%" | "px") => {
      setSizingUnits((prev) => ({
        ...prev,
        [property]: newUnit,
      }));

      // Update the component with the unit
      const updates: any = {};
      updates[`${property}Unit`] = newUnit; // Store the unit (widthUnit, heightUnit, fontSizeUnit)
      onUpdate(updates);
    },
    [onUpdate]
  );

  const handleSpacingUnitChange = React.useCallback(
    (property: keyof SpacingUnits, newUnit: "%" | "px") => {
      setSpacingUnits((prev) => ({
        ...prev,
        [property]: newUnit,
      }));

      // Update the component with the unit
      const updates: any = {};
      updates[`${property}`] = newUnit;
      onUpdate(updates);
    },
    [onUpdate]
  );

  const toggleSection = React.useCallback(
    (section: keyof typeof expandedSections) => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    },
    []
  );

  const SectionHeader = React.useMemo(
    () =>
      ({
        title,
        section,
      }: {
        title: string;
        section: keyof typeof expandedSections;
      }) =>
        (
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
        ),
    [expandedSections, toggleSection]
  );

  const StyleInput = React.useMemo(
    () =>
      ({
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
      }) =>
        (
          <div className="space-y-2 px-4 py-3 border-b border-gray-100">
            <label className="text-xs font-bold text-gray-700">{label}</label>
            {type === "color" ? (
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onDragEnter={(e) => e.preventDefault()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    onChange(e.dataTransfer.getData("text"));
                  }}
                  className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
                />
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 text-xs font-mono h-9"
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
                {type === "number" && (
                  <span className="text-xs text-gray-500">
                    {label.includes("Font") ? "px" : label.includes("(") ? label.split("(")[1]?.slice(0, -1) : "px"}
                  </span>
                )}
              </div>
            )}
          </div>
        ),
    []
  );

  const SizingInput = React.useMemo(
    () =>
      ({
        label,
        value,
        onChange,
        unit,
        onUnitChange,
        placeholder = "",
        property = "height",
      }: {
        label: string;
        value: string;
        onChange: (value: string) => void;
        unit: "%" | "px";
        onUnitChange: (unit: "%" | "px") => void;
        placeholder?: string;
        property?: "width" | "height" | "fontSize";
      }) => {
        // For width and height in percentage, cap at 100
        const isPercentageCapped =
          (property === "width" || property === "height") && unit === "%";
        const maxValue = isPercentageCapped ? 100 : undefined;
        const displayValue =
          isPercentageCapped && Number(value) > 100 ? "100" : value;

        return (
          <div className="space-y-2 px-4 py-3 border-b border-gray-100">
            <label className="text-xs font-bold text-gray-700">{label}</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={displayValue}
                onChange={(e) => {
                  let newValue = e.target.value;
                  // Prevent width and height from exceeding 100 when unit is %
                  if (isPercentageCapped && Number(newValue) > 100) {
                    newValue = "100";
                  }
                  onChange(newValue);
                }}
                max={maxValue}
                placeholder={placeholder}
                className="h-9 text-sm flex-1"
              />
              <select
                value={unit}
                onChange={(e) => onUnitChange(e.target.value as "%" | "px")}
                className="px-3 py-2 h-9 border border-gray-200 rounded-lg text-xs font-medium bg-white cursor-pointer hover:border-gray-300 transition-colors"
              >
                <option value="%">%</option>
                <option value="px">px</option>
              </select>
            </div>
          </div>
        );
      },
    []
  );

  if (!component) {
    return (
      <div className="flex flex-col h-full min-h-0">
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
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden min-h-0">
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
        {/* Alignment Section */}
        <div>
          <SectionHeader title="Alignment" section="alignment" />
          {expandedSections.alignment && (
            <div className="px-4 py-4 space-y-4 bg-gray-50">
              {/* Text Alignment */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">Text Alignment</label>
                <div className="flex gap-2">
                  {[
                    { value: "left" as const, icon: AlignLeft },
                    { value: "center" as const, icon: AlignCenter },
                    { value: "right" as const, icon: AlignRight },
                    { value: "justify" as const, icon: AlignJustify },
                  ].map((opt) => {
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleStyleChange("textAlign", opt.value)}
                        className={cn(
                          "flex-1 py-2 px-2 rounded flex items-center justify-center transition-colors border",
                          styles.textAlign === opt.value
                            ? "bg-blue-100 border-blue-400 text-blue-600"
                            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                        )}
                        title={`Text align ${opt.value}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Alignment (Block/Justify Content) */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">Content Alignment</label>
                <div className="flex gap-2">
                  {[
                    { value: "flex-start" as const, icon: AlignLeft, label: "Start" },
                    { value: "center" as const, icon: AlignCenter, label: "Center" },
                    { value: "flex-end" as const, icon: AlignRight, label: "End" },
                    { value: "space-between" as const, icon: AlignJustify, label: "Between" },
                  ].map((opt) => {
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleStyleChange("justifyContent", opt.value)}
                        className={cn(
                          "flex-1 py-2 px-2 rounded flex items-center justify-center transition-colors border",
                          styles.justifyContent === opt.value
                            ? "bg-blue-100 border-blue-400 text-blue-600"
                            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                        )}
                        title={`Content align ${opt.label}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

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
              <SizingInput
                label="Width"
                value={styles.width}
                onChange={(value) => handleStyleChange("width", value)}
                unit={sizingUnits.width}
                onUnitChange={(unit) => handleUnitChange("width", unit)}
                placeholder="100"
                property="width"
              />
              <SizingInput
                label="Height"
                value={styles.height}
                onChange={(value) => handleStyleChange("height", value)}
                unit={sizingUnits.height}
                onUnitChange={(unit) => handleUnitChange("height", unit)}
                placeholder="auto"
                property="height"
              />
              <SizingInput
                label="Font Size"
                value={styles.fontSize}
                onChange={(value) => handleStyleChange("fontSize", value)}
                unit={sizingUnits.fontSize}
                onUnitChange={(unit) => handleUnitChange("fontSize", unit)}
                placeholder="16"
                property="fontSize"
              />
            </>
          )}
        </div>

        {/* Spacing Section */}
        <div>
          <SectionHeader title="Spacing" section="spacing" />
          {expandedSections.spacing && (
            <div className="px-4 py-3 space-y-4 bg-gray-50">
              {/* Padding Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    Padding
                    <span className="text-gray-400 text-xs">ⓘ</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={spacingUnits.paddingUnit}
                      onChange={(e) => handleSpacingUnitChange("paddingUnit", e.target.value as "%" | "px")}
                      className="px-2 py-1 h-6 border border-gray-200 rounded text-xs font-medium bg-white cursor-pointer hover:border-gray-300 transition-colors"
                    >
                      <option value="px">px</option>
                      <option value="%">%</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={spacing.groupPadding}
                        onChange={handleGroupPaddingToggle}
                        className="w-3 h-3"
                      />
                      <span className="text-xs text-gray-600">Group sides</span>
                    </label>
                  </div>
                </div>

                {spacing.groupPadding ? (
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-400">⊞</span>
                    <Input
                      type="number"
                      value={styles.paddingTop}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (spacingUnits.paddingUnit === "%" && Number(value) > 100) {
                          value = "100";
                        }
                        handleStyleChange("paddingTop", value);
                        handleStyleChange("paddingRight", value);
                        handleStyleChange("paddingBottom", value);
                        handleStyleChange("paddingLeft", value);
                      }}
                      placeholder="0"
                      max={spacingUnits.paddingUnit === "%" ? 100 : undefined}
                      className="w-12 text-xs h-7"
                    />
                    <span className="text-xs text-gray-400">{spacingUnits.paddingUnit}</span>
                    <div className="flex flex-col gap-0 ml-auto">
                      <button
                        onClick={() => {
                          const current = Number(styles.paddingTop);
                          const newVal = spacingUnits.paddingUnit === "%" ? Math.min(100, current + 1) : current + 1;
                          const val = String(newVal);
                          handleStyleChange("paddingTop", val);
                          handleStyleChange("paddingRight", val);
                          handleStyleChange("paddingBottom", val);
                          handleStyleChange("paddingLeft", val);
                        }}
                        className="text-xs text-gray-600 hover:text-gray-900 leading-3"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => {
                          const val = String(Math.max(0, Number(styles.paddingTop) - 1));
                          handleStyleChange("paddingTop", val);
                          handleStyleChange("paddingRight", val);
                          handleStyleChange("paddingBottom", val);
                          handleStyleChange("paddingLeft", val);
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
                      { propKey: "paddingTop", label: "⊞" },
                      { propKey: "paddingRight", label: "⊞" },
                      { propKey: "paddingBottom", label: "⊞" },
                      { propKey: "paddingLeft", label: "⊞" },
                    ].map(({ propKey, label }) => (
                      <div key={propKey} className="flex gap-1.5 items-center">
                        <span className="text-xs text-gray-400">{label}</span>
                        <Input
                          type="number"
                          value={styles[propKey as keyof StyleState]}
                          onChange={(e) => {
                            let value = e.target.value;
                            if (spacingUnits.paddingUnit === "%" && Number(value) > 100) {
                              value = "100";
                            }
                            handleStyleChange(propKey as keyof StyleState, value);
                          }}
                          max={spacingUnits.paddingUnit === "%" ? 100 : undefined}
                          className="w-10 text-xs h-7"
                        />
                        <span className="text-xs text-gray-400">{spacingUnits.paddingUnit}</span>
                        <div className="flex flex-col gap-0">
                          <button
                            onClick={() => {
                              const current = Number(styles[propKey as keyof StyleState]);
                              const newVal = spacingUnits.paddingUnit === "%" ? Math.min(100, current + 1) : current + 1;
                              handleStyleChange(propKey as keyof StyleState, String(newVal));
                            }}
                            className="text-xs text-gray-600 hover:text-gray-900 leading-3"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleStyleChange(propKey as keyof StyleState, String(Math.max(0, Number(styles[propKey as keyof StyleState]) - 1)))}
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

              {/* Margin Section */}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    Margin
                    <span className="text-gray-400 text-xs">ⓘ</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={spacingUnits.marginUnit}
                      onChange={(e) => handleSpacingUnitChange("marginUnit", e.target.value as "%" | "px")}
                      className="px-2 py-1 h-6 border border-gray-200 rounded text-xs font-medium bg-white cursor-pointer hover:border-gray-300 transition-colors"
                    >
                      <option value="px">px</option>
                      <option value="%">%</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={spacing.groupMargin}
                        onChange={handleGroupMarginToggle}
                        className="w-3 h-3"
                      />
                      <span className="text-xs text-gray-600">Group sides</span>
                    </label>
                  </div>
                </div>

                {spacing.groupMargin ? (
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-400">⊞</span>
                    <Input
                      type="number"
                      value={styles.marginTop}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (spacingUnits.marginUnit === "%" && Number(value) > 100) {
                          value = "100";
                        }
                        handleStyleChange("marginTop", value);
                        handleStyleChange("marginRight", value);
                        handleStyleChange("marginBottom", value);
                        handleStyleChange("marginLeft", value);
                      }}
                      placeholder="0"
                      max={spacingUnits.marginUnit === "%" ? 100 : undefined}
                      className="w-12 text-xs h-7"
                    />
                    <span className="text-xs text-gray-400">{spacingUnits.marginUnit}</span>
                    <div className="flex flex-col gap-0 ml-auto">
                      <button
                        onClick={() => {
                          const current = Number(styles.marginTop);
                          const newVal = spacingUnits.marginUnit === "%" ? Math.min(100, current + 1) : current + 1;
                          const val = String(newVal);
                          handleStyleChange("marginTop", val);
                          handleStyleChange("marginRight", val);
                          handleStyleChange("marginBottom", val);
                          handleStyleChange("marginLeft", val);
                        }}
                        className="text-xs text-gray-600 hover:text-gray-900 leading-3"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => {
                          const val = String(Math.max(0, Number(styles.marginTop) - 1));
                          handleStyleChange("marginTop", val);
                          handleStyleChange("marginRight", val);
                          handleStyleChange("marginBottom", val);
                          handleStyleChange("marginLeft", val);
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
                      { propKey: "marginTop", label: "⊞" },
                      { propKey: "marginRight", label: "⊞" },
                      { propKey: "marginBottom", label: "⊞" },
                      { propKey: "marginLeft", label: "⊞" },
                    ].map(({ propKey, label }) => (
                      <div key={propKey} className="flex gap-1.5 items-center">
                        <span className="text-xs text-gray-400">{label}</span>
                        <Input
                          type="number"
                          value={styles[propKey as keyof StyleState]}
                          onChange={(e) => {
                            let value = e.target.value;
                            if (spacingUnits.marginUnit === "%" && Number(value) > 100) {
                              value = "100";
                            }
                            handleStyleChange(propKey as keyof StyleState, value);
                          }}
                          max={spacingUnits.marginUnit === "%" ? 100 : undefined}
                          className="w-10 text-xs h-7"
                        />
                        <span className="text-xs text-gray-400">{spacingUnits.marginUnit}</span>
                        <div className="flex flex-col gap-0">
                          <button
                            onClick={() => {
                              const current = Number(styles[propKey as keyof StyleState]);
                              const newVal = spacingUnits.marginUnit === "%" ? Math.min(100, current + 1) : current + 1;
                              handleStyleChange(propKey as keyof StyleState, String(newVal));
                            }}
                            className="text-xs text-gray-600 hover:text-gray-900 leading-3"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleStyleChange(propKey as keyof StyleState, String(Math.max(0, Number(styles[propKey as keyof StyleState]) - 1)))}
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
                max={50}
              />
              <StyleInput
                label="Border Radius (px)"
                value={styles.borderRadius}
                onChange={(value) => handleStyleChange("borderRadius", value)}
                type="number"
                placeholder="0"
                max={200}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
