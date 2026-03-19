"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

type FiltersState = {
  areas: string[];
  openNow: boolean;
  tag: string;
  rating: string;
};

type Props = {
  filters: FiltersState;
  setFilters: (filters: FiltersState) => void;
};

type SectionId = "location" | "quality" | "interests";

const filterSections: {
  id: SectionId;
  label: string;
  helper: string;
}[] = [
  { id: "location", label: "Location", helper: "Area" },
  { id: "quality", label: "Quality", helper: "Min rating" },
  { id: "interests", label: "Interests", helper: "Tags" },
];

const locationOptions = [
  "Indiranagar",
  "Koramangala",
  "Jayanagar",
  "Whitefield",
  "HSR Layout",
  "MG Road",
  "Church Street",
  "Electronic City",
];

const suggestedTags = [
  "breakfast",
  "coffee",
  "dessert",
  "dinner",
  "park",
  "late-night",
];

export default function Filters({ filters, setFilters }: Props) {
  const [openSection, setOpenSection] = useState<SectionId | null>("location");

  const toggleArea = (area: string) => {
    const normalizedArea = area.toLowerCase();
    const nextAreas = filters.areas.includes(normalizedArea)
      ? filters.areas.filter((item) => item !== normalizedArea)
      : [...filters.areas, normalizedArea];

    setFilters({
      ...filters,
      areas: nextAreas,
    });
  };

  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 top-0 z-[1000] w-full p-0 md:w-[28%] md:min-w-[380px] md:max-w-[620px]">
      <div className="pointer-events-auto flex h-full flex-col overflow-hidden rounded-none bg-[#222222]/95 p-4 text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] ring-1 ring-black/10 backdrop-blur md:border-r md:border-white/10">
        <div className="mb-4 flex items-center justify-center border-b border-white/8 pb-4">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-tight">Filters</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto rounded-[1.5rem] bg-white/4">
          <div className="px-4 py-3">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <p className="text-sm font-semibold text-white/92">Open Now</p>
              <input
                type="checkbox"
                checked={filters.openNow || false}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    openNow: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded bg-transparent accent-white"
              />
            </label>
          </div>

          {filterSections.map((section) => {
            const isOpen = openSection === section.id;

            return (
              <div
                key={section.id}
                className="last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-white/6"
                >
                  <div>
                    <p className="text-sm font-semibold text-white/92">
                      {section.label}
                    </p>
                    <p className="text-xs text-white/45">{section.helper}</p>
                  </div>

                  {isOpen ? (
                    <FiChevronDown className="h-4 w-4 text-white/70" />
                  ) : (
                    <FiChevronRight className="h-4 w-4 text-white/70" />
                  )}
                </button>

                {isOpen && (
                  <div className="bg-white/6 px-4 py-4">
                    {section.id === "location" && (
                      <div>
                        <p className="mb-2 text-sm font-semibold text-white/90">
                          Choose locations
                        </p>
                        <div className="space-y-2">
                          {locationOptions.map((area) => {
                            const normalizedArea = area.toLowerCase();
                            const checked = filters.areas.includes(normalizedArea);

                            return (
                              <label
                                key={area}
                                className="flex cursor-pointer items-center justify-between rounded-2xl bg-white/8 px-4 py-3 transition hover:bg-white/10"
                              >
                                <span className="text-sm text-white/90">
                                  {area}
                                </span>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleArea(area)}
                                  className="h-4 w-4 rounded bg-transparent accent-white"
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {section.id === "quality" && (
                      <div>
                        <p className="mb-2 text-sm font-semibold text-white/90">
                          Min Rating
                        </p>
                        <select
                          value={filters.rating || ""}
                          onChange={(e) =>
                            setFilters({ ...filters, rating: e.target.value })
                          }
                          className="w-full rounded-2xl bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:bg-white/12"
                        >
                          <option value="" className="text-[#111111]">
                            Any
                          </option>
                          <option value="4" className="text-[#111111]">
                            4+
                          </option>
                          <option value="3" className="text-[#111111]">
                            3+
                          </option>
                        </select>
                      </div>
                    )}

                    {section.id === "interests" && (
                      <div>
                        <p className="mb-2 text-sm font-semibold text-white/90">
                          Tags
                        </p>
                        <input
                          type="text"
                          placeholder="e.g. breakfast"
                          value={filters.tag || ""}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              tag: e.target.value.toLowerCase(),
                            })
                          }
                          className="w-full rounded-2xl bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:bg-white/12"
                        />
                        <div className="mt-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                            Suggested
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {suggestedTags.map((tag) => {
                              const isActive = filters.tag === tag;

                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() =>
                                    setFilters({
                                      ...filters,
                                      tag: isActive ? "" : tag,
                                    })
                                  }
                                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                    isActive
                                      ? "bg-white text-[#111111]"
                                      : "bg-white/8 text-white/75 hover:bg-white/12 hover:text-white"
                                  }`}
                                >
                                  {tag}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
