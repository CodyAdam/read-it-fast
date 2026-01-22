import { useState, useEffect, useRef, useCallback } from "react";
import HoverCard from "./hover-card";
import { useSettings, settings } from "@/hooks/useSettings";

const OUTLINE_PADDING = 6; // Padding around the outline in pixels

// Function to get only visible text content from element
function getTextFromElement(element: Element | null, newLineChar: string): string {
  if (!element) return "";

  function getVisibleText(node: Node): string {
    // Ignore comment nodes
    if (node.nodeType === Node.COMMENT_NODE) return "";

    // Exclude hidden elements & script/style/noscript
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (
        tag === "script" ||
        tag === "style" ||
        tag === "noscript" ||
        el.hidden ||
        el.getAttribute("aria-hidden") === "true" ||
        window.getComputedStyle(el).display === "none" ||
        window.getComputedStyle(el).visibility === "hidden"
      ) {
        return "";
      }

      let text = "";
      for (const child of Array.from(el.childNodes)) {
        text += getVisibleText(child) + newLineChar + " ";
      }
      return text;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim() || "";
      return text.length > 0 ? text : "";
    }

    return "";
  }

  return getVisibleText(element);
}

export default function HoverLogic() {
  const [show, setShow] = useState(false);
  const rootElementRef = useRef<HTMLElement>(null);
  const targetElementRef = useRef<HTMLElement>(null);
  const previousElementRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [text, setText] = useState("");
  const { value: triggerHotkey } = useSettings(settings.triggerHotkey);
  const { value: balanceOutwardHotkey } = useSettings(settings.balanceOutwardHotkey);
  const { value: newLineChar } = useSettings(settings.newLineChar);

  const balanceOutward = useCallback((delta: number) => {
    let current = targetElementRef.current;
    if (!current) return;

    const currentText = getTextFromElement(current, newLineChar);

    let newText = currentText;
    while (currentText === newText) {
      if (current.parentElement) {
        current = current.parentElement;
        newText = getTextFromElement(current, newLineChar);
      } else {
        break;
      }
    }
    if (currentText.length < newText.length) {
      setText(newText);
    }
    targetElementRef.current = current;
    // Force overlay update when target element changes
    requestAnimationFrame(() => {
      const overlay = overlayRef.current;
      if (overlay && current) {
        const rect = current.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        overlay.style.left = `${rect.left + scrollX - OUTLINE_PADDING}px`;
        overlay.style.top = `${rect.top + scrollY - OUTLINE_PADDING}px`;
        overlay.style.width = `${rect.width + OUTLINE_PADDING * 2}px`;
        overlay.style.height = `${rect.height + OUTLINE_PADDING * 2}px`;
      }
    });
  }, [newLineChar]);

  // Helper function to check if a modifier key is currently held
  const isModifierHeld = useCallback((e: KeyboardEvent, keyName: string): boolean => {
    const normalizedKey = keyName.toLowerCase();
    if (normalizedKey === "meta") {
      return e.metaKey;
    } else if (normalizedKey === "alt") {
      return e.altKey;
    } else if (normalizedKey === "control" || normalizedKey === "ctrl") {
      return e.ctrlKey;
    } else if (normalizedKey === "shift") {
      return e.shiftKey;
    }
    return false;
  }, []);

  // Helper function to check if a key matches (for keydown/keyup events)
  const isKeyMatch = useCallback((e: KeyboardEvent, keyName: string): boolean => {
    const normalizedKey = keyName.toLowerCase();
    if (normalizedKey === "meta") {
      return e.key === "Meta";
    } else if (normalizedKey === "alt") {
      return e.key === "Alt";
    } else if (normalizedKey === "control" || normalizedKey === "ctrl") {
      return e.key === "Control";
    } else if (normalizedKey === "shift") {
      return e.key === "Shift";
    } else {
      return e.key === keyName || e.key === keyName.toLowerCase() || e.key === keyName.toUpperCase();
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const triggerHeld = isModifierHeld(e, triggerHotkey);
      const balanceKeyMatch = isKeyMatch(e, balanceOutwardHotkey);

      // If trigger is held and balance key is pressed, balance outward
      if (triggerHeld && balanceKeyMatch) {
        console.log("balanceOutward", 1);
        balanceOutward(1);
      }
      // If trigger key itself is pressed, show RSVP
      else if (isKeyMatch(e, triggerHotkey)) {
        console.log("show");
        setShow(true);
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (isKeyMatch(e, triggerHotkey)) {
        console.log("hide");
        targetElementRef.current = rootElementRef.current;

        if (rootElementRef.current) {
          setText(getTextFromElement(rootElementRef.current, newLineChar));
        } else {
          setText("");
        }
        setShow(false);
      }
    }

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keyup", handleKeyUp, true);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [triggerHotkey, balanceOutwardHotkey, isModifierHeld, isKeyMatch, balanceOutward, newLineChar]);

  useEffect(() => {
    function handleMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;

      if (target === rootElementRef.current)
        return;

      const text = getTextFromElement(target, newLineChar);

      if (text && text.trim().length > 0) {

        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
        setText(text);
        rootElementRef.current = target;
        targetElementRef.current = target;
      } else {
        rootElementRef.current = null;
        targetElementRef.current = null;
        setText("");
      }
    }

    function handleMouseMove(e: MouseEvent) {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    }

    function handleMouseOut(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target === rootElementRef.current) {
        rootElementRef.current = null;
        targetElementRef.current = null;
        setText("");
      }
    }


    // Add event listeners
    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseOut, true);

    // Cleanup
    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut, true);
    };
  }, [text, show, newLineChar]);

  // Update overlay position to match target element
  const updateOverlayPosition = useCallback(() => {
    const targetElement = targetElementRef.current;
    const overlay = overlayRef.current;

    if (!targetElement || !overlay || !show) {
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    overlay.style.position = "absolute";
    overlay.style.left = `${rect.left + scrollX - OUTLINE_PADDING}px`;
    overlay.style.top = `${rect.top + scrollY - OUTLINE_PADDING}px`;
    overlay.style.width = `${rect.width + OUTLINE_PADDING * 2}px`;
    overlay.style.height = `${rect.height + OUTLINE_PADDING * 2}px`;
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "999999";
    overlay.style.border = "2px solid #3b82f6";
    overlay.style.borderRadius = "2px";
    overlay.style.boxSizing = "border-box";
  }, [show]);

  // Create and manage overlay element for outline
  useEffect(() => {
    const targetElement = targetElementRef.current;

    if (targetElement && show) {
      // Create overlay element if it doesn't exist
      if (!overlayRef.current) {
        const overlay = document.createElement("div");
        overlay.setAttribute("data-rsvp-outline", "true");
        document.body.appendChild(overlay);
        overlayRef.current = overlay;
      }

      // Update position
      updateOverlayPosition();

      // Update position on scroll and resize
      const handleScroll = () => updateOverlayPosition();
      const handleResize = () => updateOverlayPosition();

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);

      // Store current element for cleanup
      previousElementRef.current = targetElement;

      // Cleanup function
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    } else {
      // Remove overlay when not needed
      if (overlayRef.current && overlayRef.current.parentNode) {
        document.body.removeChild(overlayRef.current);
        overlayRef.current = null;
      }
      previousElementRef.current = null;
    }
  }, [text, show, updateOverlayPosition]);

  // Cleanup overlay on unmount
  useEffect(() => {
    return () => {
      if (overlayRef.current && overlayRef.current.parentNode) {
        document.body.removeChild(overlayRef.current);
        overlayRef.current = null;
      }
    };
  }, []);

  if (!show || !text) {
    return null;
  }

  return (
    <HoverCard x={mousePosition.x} y={mousePosition.y} text={text} />
  );
}