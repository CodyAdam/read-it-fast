import { css, cx } from "@/styled-system/css";
import { useState, useEffect, useRef, useMemo } from "react";
import { parseText, splitWordForDisplay, getWordDelay } from "@/utils/rsvp";
import { useSettings, settings } from "@/hooks/useSettings";

const LEFT_OFFSET = 100;
const MOUSE_OFFSET = 23;
const TOTAL_WIDTH = 400;
const PADDING = 20;

const textBase = css({
  height: "100%",
  display: "flex",
  alignItems: "center",
  flexShrink: 0
});

const beforeTextStyles = cx(textBase, css({
  textAlign: "right",
  justifyContent: "flex-end"
}))
const afterTextStyles = cx(textBase)

export default function HoverCard({ x, y, text }: { x: number, y: number, text: string }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startDelayRef = useRef<NodeJS.Timeout | null>(null);
  const { value: wordsPerMinute } = useSettings(settings.wordsPerMinute);
  const { value: startDelay } = useSettings(settings.startDelay);
  const { value: scale } = useSettings(settings.scale);
  const { value: cardBackgroundColor } = useSettings(settings.cardBackgroundColor);
  const { value: cardTextColor } = useSettings(settings.cardTextColor);
  const { value: cardAccentColor } = useSettings(settings.cardAccentColor);
  const { value: punctuationDelay } = useSettings(settings.punctuationDelay);
  const { value: newLineChar } = useSettings(settings.newLineChar);

  const [viewport, setViewport] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const boundedX = useMemo(() => {
    const minX = PADDING + scale * (LEFT_OFFSET + MOUSE_OFFSET);
    const maxX = viewport.width - PADDING - scale * (TOTAL_WIDTH - (MOUSE_OFFSET + LEFT_OFFSET));
    return Math.max(Math.min(x, maxX), minX);
  }, [x, scale, viewport]);

  // Parse text into words when text changes
  useEffect(() => {
    // Clear any pending timeouts when text changes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (startDelayRef.current) {
      clearTimeout(startDelayRef.current);
      startDelayRef.current = null;
    }

    if (text) {
      const parsedWords = parseText(text, newLineChar);
      setWords(parsedWords);
      setCurrentWordIndex(0);
      setHasStarted(false);

      // Start delay before beginning RSVP
      startDelayRef.current = setTimeout(() => {
        setHasStarted(true);
      }, startDelay * 1000);
    } else {
      setWords([]);
      setCurrentWordIndex(0);
      setHasStarted(false);
    }

    return () => {
      if (startDelayRef.current) {
        clearTimeout(startDelayRef.current);
        startDelayRef.current = null;
      }
    };
  }, [text, startDelay, newLineChar]);

  // RSVP display logic
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // If no words, reached the end, or hasn't started yet, don't schedule anything
    if (words.length === 0 || currentWordIndex >= words.length || !hasStarted) {
      return;
    }

    const currentWord = words[currentWordIndex];
    const delay = getWordDelay(currentWord, wordsPerMinute, true, punctuationDelay, 0, newLineChar);

    // Schedule next word
    timeoutRef.current = setTimeout(() => {
      setCurrentWordIndex((prev) => prev + 1);
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [words, currentWordIndex, wordsPerMinute, hasStarted, punctuationDelay, newLineChar]);


  if (!text || words.length === 0) {
    return null;
  }

  return (
    <div
      id="read-it-fast-popup"
      style={{
        left: `${boundedX - (LEFT_OFFSET + MOUSE_OFFSET) * scale}px`,
        top: `${y - 90}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        background: cardBackgroundColor,
        color: cardTextColor,
      }}
      className={css({
        position: "fixed",
        padding: "0px 16px",
        borderRadius: "16px",
        fontSize: "24px",
        pointerEvents: "none",
        zIndex: 2147483647,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        width: `${TOTAL_WIDTH}px`,
        display: "flex",
        alignItems: "center",
        height: "70px",
        flexDirection: "row",
        fontFamily: "'Geist Mono Variable', monospace",
        fontWeight: "600",
        letterSpacing: "0.05em",
        whiteSpace: "pre",
        overflow: "hidden",
      })}
    >
      <CurrentWordDisplay words={words} currentWordIndex={currentWordIndex} accentColor={cardAccentColor} />
    </div>
  );
}

function CurrentWordDisplay({ words, currentWordIndex, accentColor }: { words: string[], currentWordIndex: number, accentColor: string }) {
  if (words.length === 0 || currentWordIndex >= words.length) {
    return null;
  }
  console.log(words);
  const currentWord = words[currentWordIndex];
  const { before, orp, after } = splitWordForDisplay(currentWord);

  const orpContainerStyles = cx(textBase, css({
    color: accentColor,
    position: "relative",
    width: "1ch"
  }))
  const orpLineStyles = css({
    position: "absolute",
    height: "6px",
    width: "1px",
    left: "50%",
    transform: "translateX(-50%)"
  });

  return (
    <>
      <div className={beforeTextStyles} style={{ 'width': `${LEFT_OFFSET}px` }}>
        {before}
      </div>
      <div className={orpContainerStyles} style={{ color: accentColor }}>{orp}
        <div className={cx(orpLineStyles, css({ top: 0 }))} style={{ backgroundColor: accentColor }}>
        </div>
        <div className={cx(orpLineStyles, css({ bottom: 0 }))} style={{ backgroundColor: accentColor }}>
        </div>
      </div>
      <span className={afterTextStyles}>
        {after}
      </span>
    </>
  );
}