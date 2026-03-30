import React from "react";
import { BuilderComponent } from "@/types/builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Copy, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  component: BuilderComponent;
  onUpdate: (id: string, updates: Partial<BuilderComponent>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onSelect?: (id: string) => void;
}

interface HeroElement {
  id: string;
  type: "badge" | "heading" | "paragraph" | "buttons";
  label: string;
  content: string;
  instanceId: string; // Unique identifier for each instance
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  component,
  onUpdate,
  onRemove,
  onDuplicate,
  onSelect,
}) => {
  const [selectedElementId, setSelectedElementId] = React.useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = React.useState<string | null>(null);
  const [editingElementId, setEditingElementId] = React.useState<string | null>(null);

  const defaultElementContent: Record<HeroElement["type"], string> = {
    badge: "✨ New Release",
    heading: "Build your vision faster than ever.",
    paragraph: "The world's most advanced landing page builder. Drag, drop, and launch in minutes, not days.",
    buttons: "CTA Buttons",
  };

  // Initialize hero elements with instance IDs
  const initializeElements = (): HeroElement[] => {
    const elements: HeroElement[] = [];
    const badges = component.heroBadges?.length
      ? component.heroBadges
      : [{ instanceId: "badge-0", content: component.heroBadgeText || defaultElementContent.badge }];

    badges.forEach((badge) => {
      elements.push({
        id: badge.instanceId,
        instanceId: badge.instanceId,
        type: "badge",
        label: "Badge",
        content: badge.content || defaultElementContent.badge,
      });
    });

    elements.push(
      {
        id: "heading-0",
        instanceId: "heading-0",
        type: "heading",
        label: "Heading",
        content: component.heroHeadingText || defaultElementContent.heading,
      },
      {
        id: "paragraph-0",
        instanceId: "paragraph-0",
        type: "paragraph",
        label: "Paragraph",
        content: component.heroDescriptionText || defaultElementContent.paragraph,
      },
      {
        id: "buttons-0",
        instanceId: "buttons-0",
        type: "buttons",
        label: "Buttons",
        content: defaultElementContent.buttons,
      },
    );

    return elements;
  };

  const [heroElements, setHeroElements] = React.useState<HeroElement[]>(() => initializeElements());

  React.useEffect(() => {
    setHeroElements(initializeElements());
    setSelectedElementId(null);
    setHoveredElementId(null);
    setEditingElementId(null);
  }, [component.id]);

  React.useEffect(() => {
    setHeroElements((prev) =>
      prev.map((element) => {
        if (element.instanceId === "badge-0") {
          return { ...element, content: component.heroBadgeText || defaultElementContent.badge };
        }
        if (element.instanceId === "heading-0") {
          return { ...element, content: component.heroHeadingText || defaultElementContent.heading };
        }
        if (element.instanceId === "paragraph-0") {
          return { ...element, content: component.heroDescriptionText || defaultElementContent.paragraph };
        }
        return element;
      }),
    );
  }, [component.heroBadgeText, component.heroHeadingText, component.heroDescriptionText]);

  const getComponentStyles = () => {
    const styles: React.CSSProperties = {};
    // IMPORTANT: Do NOT apply width to the hero container - it should be full width
    // Width adjustments through the styling panel are for individual elements only
    if (component.height) {
      const unit = component.heightUnit || "px";
      styles.minHeight = `${component.height}${unit}`;
    }
    if (component.paddingTop || component.paddingRight || component.paddingBottom || component.paddingLeft) {
      styles.paddingTop = `${component.paddingTop || 0}px`;
      styles.paddingRight = `${component.paddingRight || 0}px`;
      styles.paddingBottom = `${component.paddingBottom || 0}px`;
      styles.paddingLeft = `${component.paddingLeft || 0}px`;
    } else if (component.padding) {
      styles.padding = `${component.padding}px`;
    }
    if (component.marginTop || component.marginRight || component.marginBottom || component.marginLeft) {
      styles.marginTop = `${component.marginTop || 0}px`;
      styles.marginRight = `${component.marginRight || 0}px`;
      styles.marginBottom = `${component.marginBottom || 0}px`;
      styles.marginLeft = `${component.marginLeft || 0}px`;
    } else if (component.margin) {
      styles.margin = `${component.margin}px`;
    }
    if (component.backgroundColor) {
      styles.backgroundColor = component.backgroundColor;
    }
    return styles;
  };

  const handleElementClick = (instanceId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    const newSelectedId = selectedElementId === instanceId ? null : instanceId;
    const selectedElement = heroElements.find((element) => element.instanceId === instanceId);

    setSelectedElementId(newSelectedId);
    onSelect?.(component.id);
    onUpdate(component.id, {
      selectedHeroElement: newSelectedId ? selectedElement?.type ?? null : null,
    });
  };

  const handleElementUpdate = (instanceId: string, content: string) => {
    if (instanceId === "primaryButton" || instanceId === "primaryButton-0") {
      onUpdate(component.id, { heroPrimaryButtonText: content });
      return;
    }

    if (instanceId === "secondaryButton" || instanceId === "secondaryButton-0") {
      onUpdate(component.id, { heroSecondaryButtonText: content });
      return;
    }

    const element = heroElements.find((el) => el.instanceId === instanceId);
    if (!element) return;

    const updatedElements = heroElements.map((el) =>
      el.instanceId === instanceId ? { ...el, content } : el,
    );
    setHeroElements(updatedElements);

    const fieldMap = {
      badge: "heroBadgeText",
      heading: "heroHeadingText",
      paragraph: "heroDescriptionText",
    } as const;

    const fieldKey = fieldMap[element.type as keyof typeof fieldMap];
    if (fieldKey && instanceId.endsWith("-0")) {
      onUpdate(component.id, { [fieldKey]: content });
    }
  };

  const handleEditableFocus = (event: React.FocusEvent<HTMLElement>) => {
    setEditingElementId(event.currentTarget.dataset.elementId || null);
  };

  const handleCopyElement = (instanceId: string) => {
    const element = heroElements.find(el => el.instanceId === instanceId);
    if (!element) return;

    // Create a duplicate element with a new instanceId
    const newInstanceId = `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const duplicatedElement: HeroElement = {
      ...element,
      id: newInstanceId,
      instanceId: newInstanceId,
    };

    // Add the duplicated element to the array
    const updatedElements = [...heroElements];
    const elementIndex = updatedElements.findIndex(el => el.instanceId === instanceId);
    updatedElements.splice(elementIndex + 1, 0, duplicatedElement);

    setHeroElements(updatedElements);
    setSelectedElementId(newInstanceId);
  };

  const handleDeleteElement = (instanceId: string) => {
    const element = heroElements.find((el) => el.instanceId === instanceId);
    if (!element) return;

    const elementsOfSameType = heroElements.filter((el) => el.type === element.type);

    if (elementsOfSameType.length === 1) {
      if (element.type === "buttons") {
        onUpdate(component.id, {
          heroPrimaryButtonText: "Start Free Trial",
          heroSecondaryButtonText: "Watch Demo",
          selectedHeroElement: null,
        });
      } else {
        const resetContent = defaultElementContent[element.type];
        const updatedElements = heroElements.map((el) =>
          el.instanceId === instanceId ? { ...el, content: resetContent } : el,
        );
        setHeroElements(updatedElements);

        const updateMap = {
          badge: "heroBadgeText",
          heading: "heroHeadingText",
          paragraph: "heroDescriptionText",
        } as const;

        const key = updateMap[element.type as keyof typeof updateMap];
        if (key) {
          onUpdate(component.id, {
            [key]: resetContent,
            selectedHeroElement: null,
          });
        }
      }
    } else {
      setHeroElements(heroElements.filter((el) => el.instanceId !== instanceId));
      onUpdate(component.id, { selectedHeroElement: null });
    }

    setSelectedElementId(null);
    setHoveredElementId(null);
    setEditingElementId(null);
  };

  const handleAddElement = (instanceId: string) => {
    // Add is the same as copy
    handleCopyElement(instanceId);
  };

  const headingTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const paragraphTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  React.useLayoutEffect(() => {
    resizeTextarea(headingTextareaRef.current);
    resizeTextarea(paragraphTextareaRef.current);
  }, [component.heroHeadingText, component.heroDescriptionText, editingElementId]);


  const renderElementContent = (element: HeroElement) => {
    const isSelected = selectedElementId === element.instanceId;
    const isHovered = hoveredElementId === element.instanceId;

    // Get the actual value - in edit mode show the real value even if empty, in display mode show with fallback
    const getDisplayContent = (elementId: string): string => {
      const valueMap: Record<string, string | undefined> = {
        badge: component.heroBadgeText,
        heading: component.heroHeadingText,
        paragraph: component.heroDescriptionText,
      };
      return valueMap[elementId] || "";
    };

    const getDefaultContent = (elementId: string): string => {
      const defaults: Record<string, string> = {
        badge: "✨ New Release",
        heading: "Build your vision faster than ever.",
        paragraph: "The world's most advanced landing page builder. Drag, drop, and launch in minutes, not days.",
      };
      return defaults[elementId] || "";
    };

    const borderClasses = cn(
      "transition-all",
      isSelected && "border-2 border-solid border-valasys-orange",
      isHovered && !isSelected && "border-2 border-dashed border-valasys-orange/50",
      !isSelected && !isHovered && "border-2 border-transparent"
    );

    const containerClasses = cn(
      "relative group transition-all rounded-lg p-3",
      borderClasses
    );

    const renderControls = () => {
      if (!isSelected || editingElementId === element.instanceId) return null;

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
              handleCopyElement(element.instanceId);
            }}
            className="h-6 w-6 flex items-center justify-center hover:bg-valasys-orange/10 rounded transition-colors cursor-pointer"
            title="Duplicate content"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddElement(element.instanceId);
            }}
            className="h-6 w-6 flex items-center justify-center hover:bg-valasys-orange/10 rounded transition-colors cursor-pointer"
            title="Duplicate content"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDeleteElement(element.instanceId);
            }}
            className="h-6 w-6 flex items-center justify-center hover:bg-red-100 text-red-500 rounded transition-colors cursor-pointer"
            title="Delete or reset to default"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    };

    const onMouseEnter = () => setHoveredElementId(element.instanceId);
    const onMouseLeave = () => setHoveredElementId(null);

    switch (element.type) {
      case "badge":
        const badgeContent = element.content || getDefaultContent("badge");
        const badgeFontSize = component.badgeFontSize ? `${component.badgeFontSize}${component.badgeFontSizeUnit || "rem"}` : undefined;
        const badgeWidth = component.badgeWidth ? `${component.badgeWidth}${component.badgeWidthUnit || "%"}` : undefined;
        const badgeTextAlign = component.badgeTextAlign || "center";
        return (
          <div
            key={element.instanceId}
            className={cn(
              containerClasses,
              "relative",
              editingElementId && editingElementId !== element.instanceId && "opacity-0 pointer-events-none transition-opacity"
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={(e) => handleElementClick(element.instanceId, e)}
            style={{ maxWidth: badgeWidth || "100%", textAlign: badgeTextAlign }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-valasys-orange/10 text-valasys-orange font-bold uppercase tracking-wider" style={{ fontSize: badgeFontSize || "0.75rem" }}>
              {isSelected ? (
                <Input
                  value={badgeContent}
                  data-element-id={element.instanceId}
                  onChange={(e) => handleElementUpdate(element.instanceId, e.target.value)}
                  onFocus={handleEditableFocus}
                  onBlur={() => setEditingElementId(null)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-auto w-auto min-w-0 border-0 bg-transparent p-0 font-bold uppercase tracking-wider text-valasys-orange shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  style={{ fontSize: badgeFontSize || "0.75rem" }}
                />
              ) : (
                <span
                  className="break-words"
                  style={{
                    direction: "ltr",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                    fontSize: badgeFontSize || "0.75rem",
                  }}
                >
                  {badgeContent}
                </span>
              )}
            </div>
            {renderControls()}
          </div>
        );

      case "heading":
        const headingContent = element.content || getDefaultContent("heading");
        const headingWidth = component.headingWidth ? `${component.headingWidth}${component.headingWidthUnit || "%"}` : undefined;
        const headingFontSize = component.headingFontSize ? `${component.headingFontSize}${component.headingFontSizeUnit || "rem"}` : undefined;
        const headingTextAlign = component.headingTextAlign || "center";
        return (
          <div
            key={element.instanceId}
            className={cn(containerClasses, "relative")}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={(e) => handleElementClick(element.instanceId, e)}
            style={{ textAlign: headingTextAlign }}
          >
            {isSelected ? (
              <Textarea
                ref={headingTextareaRef}
                value={headingContent}
                data-element-id={element.instanceId}
                onChange={(e) => {
                  handleElementUpdate(element.instanceId, e.target.value);
                  resizeTextarea(e.currentTarget);
                }}
                onFocus={handleEditableFocus}
                onBlur={() => setEditingElementId(null)}
                onClick={(e) => e.stopPropagation()}
                className="min-h-0 resize-none overflow-hidden border-0 bg-transparent p-0 font-black text-gray-900 tracking-tight leading-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  maxWidth: headingWidth || "100%",
                  fontSize: headingFontSize || "3.75rem",
                  textAlign: headingTextAlign,
                }}
                rows={1}
              />
            ) : (
              <h1
                className="font-black text-gray-900 tracking-tight leading-none break-words"
                style={{
                  direction: "ltr",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  maxWidth: headingWidth || "100%",
                  fontSize: headingFontSize || "3.75rem",
                  textAlign: headingTextAlign,
                }}
              >
                {headingContent}
              </h1>
            )}
            {renderControls()}
          </div>
        );

      case "paragraph":
        const paragraphContent = element.content || getDefaultContent("paragraph");
        const paragraphWidth = component.paragraphWidth ? `${component.paragraphWidth}${component.paragraphWidthUnit || "%"}` : undefined;
        const paragraphFontSize = component.paragraphFontSize ? `${component.paragraphFontSize}${component.paragraphFontSizeUnit || "rem"}` : undefined;
        const paragraphTextAlign = component.paragraphTextAlign || "center";
        return (
          <div
            key={element.instanceId}
            className={cn(containerClasses, "relative w-full self-stretch")}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={(e) => handleElementClick(element.instanceId, e)}
            style={{ textAlign: paragraphTextAlign }}
          >
            {isSelected ? (
              <Textarea
                ref={paragraphTextareaRef}
                value={paragraphContent}
                data-element-id={element.instanceId}
                onChange={(e) => {
                  handleElementUpdate(element.instanceId, e.target.value);
                  resizeTextarea(e.currentTarget);
                }}
                onFocus={handleEditableFocus}
                onBlur={() => setEditingElementId(null)}
                onClick={(e) => e.stopPropagation()}
                className="min-h-0 w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-gray-600 leading-relaxed shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  width: "100%",
                  maxWidth: paragraphWidth || "100%",
                  fontSize: paragraphFontSize || "1.125rem",
                  textAlign: paragraphTextAlign,
                }}
                rows={1}
              />
            ) : (
              <p
                className="w-full text-gray-600 leading-relaxed break-words"
                style={{
                  direction: "ltr",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  width: "100%",
                  maxWidth: "100%",
                  fontSize: paragraphFontSize || "1.125rem",
                  textAlign: paragraphTextAlign,
                }}
              >
                {paragraphContent}
              </p>
            )}
            {renderControls()}
          </div>
        );

      case "buttons":
        const buttonsWidth = component.buttonWidth ? `${component.buttonWidth}${component.buttonWidthUnit || "%"}` : undefined;
        const buttonFontSize = component.buttonFontSize ? `${component.buttonFontSize}${component.buttonFontSizeUnit || "rem"}` : undefined;
        const buttonTextAlign = component.buttonTextAlign || "center";
        return (
          <div
            key={element.instanceId}
            className={containerClasses}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={(e) => handleElementClick(element.instanceId, e)}
            style={{ textAlign: buttonTextAlign }}
          >
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4" style={{ maxWidth: buttonsWidth || "100%", fontSize: buttonFontSize || "1.125rem", textAlign: buttonTextAlign }}>
              {isSelected ? (
                <Input
                  value={component.heroPrimaryButtonText}
                  data-element-id="primaryButton"
                  onChange={(e) => handleElementUpdate("primaryButton", e.target.value)}
                  onFocus={handleEditableFocus}
                  onBlur={() => setEditingElementId(null)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Start Free Trial"
                  className="h-auto min-w-[220px] rounded-2xl border-0 bg-valasys-orange px-10 py-7 text-center text-lg font-bold text-white shadow-xl focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              ) : (
                <Button className="px-10 py-7 text-lg font-bold rounded-2xl bg-valasys-orange shadow-xl hover:shadow-2xl transition-all hover:bg-valasys-orange/90">
                  {component.heroPrimaryButtonText || "Start Free Trial"}
                </Button>
              )}
              {isSelected ? (
                <Input
                  value={component.heroSecondaryButtonText}
                  data-element-id="secondaryButton"
                  onChange={(e) => handleElementUpdate("secondaryButton", e.target.value)}
                  onFocus={handleEditableFocus}
                  onBlur={() => setEditingElementId(null)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Watch Demo"
                  className="h-auto min-w-[180px] rounded-2xl border border-gray-200 bg-white px-10 py-7 text-center text-lg font-bold text-gray-900 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              ) : (
                <Button
                  variant="outline"
                  className="px-10 py-7 text-lg font-bold rounded-2xl border-gray-200"
                >
                  {component.heroSecondaryButtonText || "Watch Demo"}
                </Button>
              )}
            </div>
            {renderControls()}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-white p-12 lg:p-24 flex flex-col items-center justify-center text-center gap-6 rounded-3xl border border-gray-100"
      style={getComponentStyles()}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-valasys-orange/5 to-transparent pointer-events-none" />
      <div className="w-full h-full flex flex-col items-center justify-center gap-6">
        {heroElements.map((element) => renderElementContent(element))}
      </div>
    </div>
  );
};
