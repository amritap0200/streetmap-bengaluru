"use client";

import { FiFilter } from "react-icons/fi";

type Props = {
  filters: any;
  setFilters: (filters: any) => void;
};

export default function Filters({ filters, setFilters }: Props) {
  return (
    <div className="pointer-events-none absolute left-4 top-24 z-[1000] w-[calc(100%-2rem)] max-w-sm">
      <div className="pointer-events-auto rounded-[2rem] bg-[#222222]/95 p-4 text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] ring-1 ring-black/10 backdrop-blur">
        <div className="mb-4 flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold tracking-tight">Filters</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-white/90">Area</p>
            <input
              type="text"
              placeholder="e.g. koramangala"
              value={filters.area || ""}
              onChange={(e) =>
                setFilters({ ...filters, area: e.target.value.toLowerCase() })
              }
              className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/25 focus:bg-white/12"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white/90">Open Now</p>
                <p className="text-xs text-white/55">Show only currently open places</p>
              </div>
              <input
                type="checkbox"
                checked={filters.openNow || false}
                onChange={(e) =>
                  setFilters({ ...filters, openNow: e.target.checked })
                }
                className="h-4 w-4 rounded border-white/30 bg-transparent accent-white"
              />
            </label>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-white/90">Min Rating</p>
            <select
              value={filters.rating || ""}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25 focus:bg-white/12"
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

          <div>
            <p className="mb-2 text-sm font-semibold text-white/90">Tags</p>
            <input
              type="text"
              placeholder="e.g. breakfast"
              value={filters.tag || ""}
              onChange={(e) =>
                setFilters({ ...filters, tag: e.target.value.toLowerCase() })
              }
              className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/25 focus:bg-white/12"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
