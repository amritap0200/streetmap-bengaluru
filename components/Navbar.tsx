"use client";

import { FiCompass } from "react-icons/fi";

type Props = {
  mapType: string;
  setMapType: (type: string) => void;
};

export default function Navbar({ mapType, setMapType }: Props) {
  const types = [
    { value: "normal", label: "Explore" },
    { value: "cafe", label: "Cafe" },
    { value: "metro", label: "Metro" },
    { value: "park", label: "Park" },
    { value: "bmtc", label: "BMTC" },
  ];

  return (
    <div className="pointer-events-none absolute left-1/2 top-4 z-[1000] min-w-[44rem] max-w-[calc(100%-1.5rem)] -translate-x-1/2 px-1">
      <div className="pointer-events-auto grid grid-cols-1 gap-3 rounded-[2rem] bg-[#222222]/95 p-3 text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] ring-1 ring-black/10 backdrop-blur sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={() => setMapType("normal")}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f0e8] text-[#111111] shadow-inner transition hover:scale-[1.03]"
            aria-label="Reset map filter"
          >
            <FiCompass className="text-lg" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => setMapType(type.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium tracking-tight transition ${
                mapType === type.value
                  ? "bg-white text-[#111111]"
                  : "text-white/78 hover:bg-white/10 hover:text-white"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:block" />
      </div>
    </div>
  );
}
