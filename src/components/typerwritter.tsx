"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const WORDS = [
  { text: "To do App", bg: "#0E3525", color: "#FBEFFF" },
  { text: "Comencemos", bg: "#1E1E1E", color: "#FFD369" },
  { text: "Organiza", bg: "#003049", color: "#FCBF49" },
  { text: "Diseña tu dia", bg: "#780000", color: "#FCEEE3" },
  { text: "Colaboremos", bg: "#2A9D8F", color: "#FFEFEA" },
];

export default function TypewriterLogin() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const word = WORDS[index].text;
  const bgColor = WORDS[index].bg;
  const textColor = WORDS[index].color;

  // Typewriter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayText((current) => {
        if (!deleting) {
          // typing
          if (current.length < word.length) {
            return word.slice(0, current.length + 1);
          } else {
            // wait before deleting
            setTimeout(() => setDeleting(true), 1200);
            return current;
          }
        } else {
          // deleting
          if (current.length > 0) {
            return current.slice(0, -1);
          } else {
            setDeleting(false);
            setIndex((i) => (i + 1) % WORDS.length);
            return "";
          }
        }
      });
    }, deleting ? 60 : 90);

    return () => clearInterval(interval);
  }, [word, deleting]);

  return (
    <div
      className="h-[70vh] flex justify-center items-center transition-colors duration-700 ease-in-out px-6"
      style={{ backgroundColor: bgColor }}
    >
      <h1
        className="text-4xl font-semibold transition-colors duration-700 text-center"
        style={{ color: textColor }}
      >
        {displayText}
        <span className="border-r-2 ml-1 animate-pulse" style={{ borderColor: textColor }}></span>
      </h1>
    </div>
  );
}
