"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Filters from "@/components/Filters";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});



export default function Home() {
  const [places, setPlaces] = useState([]);
  const [mapType, setMapType] = useState("normal");
  const [filters, setFilters] = useState({
    areas: [] as string[],
    openNow: false,
    tag: "",
    rating: "",
  });


  useEffect(() => {
    const params = new URLSearchParams();

    if (mapType !== "normal") {
      params.set("category", mapType);
    }

    if (filters.areas.length) {
      params.set("area", filters.areas.join(","));
    }

    if (filters.openNow) {
      params.set("openNow", "true");
    }

    if (filters.tag) {
      params.set("tag", filters.tag);
    }

    if (filters.rating) {
      params.set("rating", filters.rating);
    }

    const queryString = params.toString();
    const url = queryString ? `/api/places?${queryString}` : "/api/places";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data);
      });
  }, [mapType, filters]);

  return (
    <div className="h-screen w-full">
      <Navbar mapType={mapType} setMapType={setMapType} />
      <Filters filters={filters} setFilters={setFilters} />
      <Map places={places} />
    </div>
  );
}
