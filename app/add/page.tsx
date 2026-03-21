"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type DBPlace = {
  _id: string;
  name: string;
  category: string;
  area: string;
  rating?: number;
  location: { coordinates: [number, number] };
};

type OSMResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address?: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
  };
};

type SelectedPlace =
  | { source: "db"; data: DBPlace }
  | { source: "osm"; data: OSMResult };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const categoryFromOSMType = (type: string): string => {
  if (["cafe", "restaurant", "fast_food", "bar", "pub"].includes(type)) return "cafe";
  if (["park", "garden", "nature_reserve"].includes(type)) return "park";
  if (["station", "subway_entrance", "halt"].includes(type)) return "metro";
  if (["bus_stop", "bus_station"].includes(type)) return "bmtc";
  return "place";
};

const shortName = (result: OSMResult) =>
  result.address?.road ||
  result.address?.neighbourhood ||
  result.display_name.split(",")[0];

const shortArea = (result: OSMResult) =>
  [result.address?.neighbourhood, result.address?.suburb]
    .filter(Boolean)
    .slice(0, 1)
    .join("") || "";

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    ({ source: "db"; item: DBPlace } | { source: "osm"; item: OSMResult })[]
  >([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<SelectedPlace | null>(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ── Search ──────────────────────────────────────────────────────────────────

  const doSearch = useCallback(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    try {
      const [dbRes, osmRes] = await Promise.all([
        fetch(`/api/places/search?q=${encodeURIComponent(q)}`),
        fetch(`/api/geocode?q=${encodeURIComponent(q)}`),
      ]);

      const dbPlaces: DBPlace[] = dbRes.ok ? await dbRes.json() : [];
      const osmData: OSMResult[] = osmRes.ok ? await osmRes.json() : [];

      setSearchResults([
        ...dbPlaces.map((p) => ({ source: "db" as const, item: p })),
        ...osmData.map((r) => ({ source: "osm" as const, item: r })),
      ]);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelected(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 400);
  };

  const handleSelectResult = (
    item: { source: "db"; item: DBPlace } | { source: "osm"; item: OSMResult }
  ) => {
    if (item.source === "db") {
      setSelected({ source: "db", data: item.item });
      setQuery(item.item.name);
    } else {
      setSelected({ source: "osm", data: item.item });
      setQuery(shortName(item.item));
    }
    setSearchResults([]);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!selected) { setError("Please select a place first."); return; }
    if (!rating) { setError("Please add a rating."); return; }
    if (!review.trim()) { setError("Please write a short review."); return; }
    if (!session) { setError("You need to be signed in."); return; }

    setSubmitting(true);
    setError("");

    try {
      let placeId: string;

      if (selected.source === "db") {
        placeId = selected.data._id;
      } else {
        // Create the place in your DB first
        const osmPlace = selected.data;
        const createRes = await fetch("/api/places", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: shortName(osmPlace),
            lat: parseFloat(osmPlace.lat),
            lng: parseFloat(osmPlace.lon),
            category: categoryFromOSMType(osmPlace.type),
            area: shortArea(osmPlace),
            osmId: String(osmPlace.place_id),
          }),
        });

        if (!createRes.ok) throw new Error("Failed to save place.");
        const created = await createRes.json();
        placeId = created._id;
      }

      // Post the review
      const reviewRes = await fetch(`/api/places/${placeId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: review.trim(), photos: [], tags: [] }),
      });

      if (!reviewRes.ok) throw new Error("Failed to post review.");

      router.push("/");
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
      setSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const dbResults = searchResults.filter((r) => r.source === "db");
  const osmResults = searchResults.filter((r) => r.source === "osm");
  const showDropdown = searchResults.length > 0 && !selected;
  const canSubmit = !!selected && rating > 0 && review.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/40 hover:text-white transition text-sm"
        >
          <span className="text-lg leading-none">←</span>
          <span>Back to map</span>
        </Link>
        <p className="text-white/20 text-xs tracking-widest uppercase">
          StreetMap Bengaluru
        </p>
        {session ? (
          <p className="text-white/40 text-sm">{session.user?.name?.split(" ")[0]}</p>
        ) : (
          <Link href="/" className="text-white/40 text-sm hover:text-white transition">
            Sign in
          </Link>
        )}
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-12 max-w-lg mx-auto w-full">

        {/* Heading */}
        <div className="w-full mb-10">
          <h1
            className="text-4xl font-bold tracking-tight mb-2"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Add a place.
          </h1>
          <p className="text-white/35 text-sm">
            Found somewhere worth knowing about? Put it on the map.
          </p>
        </div>

        {/* ── Step 1: Search ── */}
        <div className="w-full mb-8">
          <label className="text-white/30 text-[10px] uppercase tracking-widest block mb-2.5">
            01 — Find the place
          </label>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search by name, street, area…"
              className="
                w-full bg-white/5 border border-white/10 rounded-xl
                px-4 py-3.5 text-sm text-white placeholder-white/20
                outline-none focus:border-white/25 transition
              "
            />

            {/* Searching indicator */}
            {searching && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 text-xs animate-pulse">
                ···
              </span>
            )}

            {/* Selected checkmark */}
            {selected && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-sm">
                ✓
              </span>
            )}

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#151515] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto">

                {dbResults.length > 0 && (
                  <>
                    <p className="text-white/20 text-[9px] uppercase tracking-widest px-4 pt-3 pb-1.5">
                      Already in catalogue
                    </p>
                    {dbResults.map((r, i) => {
                      const p = (r as { source: "db"; item: DBPlace }).item;
                      return (
                        <button
                          key={`db-${i}`}
                          onClick={() => handleSelectResult(r as any)}
                          className="w-full text-left px-4 py-3 hover:bg-white/5 transition flex items-center gap-3 border-b border-white/5 last:border-0"
                        >
                          <span className="text-sm">📍</span>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{p.name}</p>
                            <p className="text-white/35 text-xs truncate">{p.area} · {p.category}</p>
                          </div>
                          <span className="ml-auto shrink-0 text-[9px] text-green-400/60 border border-green-400/20 rounded-full px-1.5 py-0.5">
                            in db
                          </span>
                        </button>
                      );
                    })}
                  </>
                )}

                {osmResults.length > 0 && (
                  <>
                    <p className="text-white/20 text-[9px] uppercase tracking-widest px-4 pt-3 pb-1.5 border-t border-white/5">
                      From OpenStreetMap
                    </p>
                    {osmResults.map((r, i) => {
                      const o = (r as { source: "osm"; item: OSMResult }).item;
                      return (
                        <button
                          key={`osm-${i}`}
                          onClick={() => handleSelectResult(r as any)}
                          className="w-full text-left px-4 py-3 hover:bg-white/5 transition flex items-center gap-3 border-b border-white/5 last:border-0"
                        >
                          <span className="text-sm">🗺</span>
                          <div className="min-w-0">
                            <p className="text-white/80 text-sm truncate">{shortName(o)}</p>
                            <p className="text-white/30 text-xs truncate">
                              {[o.address?.neighbourhood, o.address?.suburb].filter(Boolean).join(", ") || "Bengaluru"}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Show selected place pill */}
          {selected && (
            <div className="mt-2.5 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <span className="text-green-400 text-xs">✓</span>
              <p className="text-white/70 text-sm flex-1 truncate">
                {selected.source === "db" ? selected.data.name : shortName(selected.data)}
              </p>
              <button
                onClick={() => { setSelected(null); setQuery(""); }}
                className="text-white/25 hover:text-white/60 text-xs transition"
              >
                change
              </button>
            </div>
          )}
        </div>

        {/* ── Step 2: Rating ── */}
        <div className={`w-full mb-8 transition-opacity duration-300 ${selected ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
          <label className="text-white/30 text-[10px] uppercase tracking-widest block mb-3">
            02 — Your rating
          </label>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                className="text-3xl transition-transform hover:scale-110 active:scale-95"
                style={{
                  color: s <= (hoverRating || rating) ? "#FBBF24" : "rgba(255,255,255,0.12)",
                  transition: "color 150ms ease, transform 100ms ease",
                }}
              >
                ★
              </button>
            ))}
            {rating > 0 && (
              <span className="text-white/30 text-sm self-center ml-1">
                {["", "Poor", "Okay", "Good", "Great", "Must visit"][rating]}
              </span>
            )}
          </div>
        </div>

        {/* ── Step 3: Review ── */}
        <div className={`w-full mb-10 transition-opacity duration-300 ${selected ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
          <label className="text-white/30 text-[10px] uppercase tracking-widest block mb-2.5">
            03 — One line about it
          </label>
          <input
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Best masala dosa in the city, no contest."
            maxLength={120}
            className="
              w-full bg-white/5 border border-white/10 rounded-xl
              px-4 py-3.5 text-sm text-white placeholder-white/20
              outline-none focus:border-white/25 transition
            "
          />
          <p className="text-white/20 text-xs mt-1.5 text-right">{review.length}/120</p>
        </div>

        {/* ── Error ── */}
        {error && (
          <p className="w-full text-red-400 text-sm mb-4 bg-red-400/5 border border-red-400/15 rounded-lg px-4 py-2.5">
            {error}
          </p>
        )}

        {/* ── Auth gate ── */}
        {status === "unauthenticated" && (
          <div className="w-full mb-6 bg-white/3 border border-white/10 rounded-xl px-5 py-4 text-center">
            <p className="text-white/40 text-sm mb-3">You need to be signed in to submit.</p>
            <Link
              href="/"
              className="text-white text-sm underline underline-offset-4 decoration-white/30 hover:decoration-white transition"
            >
              Go back and sign in →
            </Link>
          </div>
        )}

        {/* ── Submit ── */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting || status === "unauthenticated"}
          className="
            w-full py-4 rounded-xl text-sm font-semibold
            bg-white text-black
            hover:bg-white/90 transition
            disabled:opacity-25 disabled:cursor-not-allowed
            relative overflow-hidden
          "
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block animate-spin">⟳</span>
              Saving…
            </span>
          ) : (
            "Add to the map →"
          )}
        </button>

        <p className="text-white/15 text-xs text-center mt-5 leading-relaxed">
          Your contribution goes live immediately and is visible to everyone on the map.
        </p>
      </div>
    </div>
  );
}