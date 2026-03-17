import mongoose from "mongoose";
import fs from "fs";
import Place from "../models/Place.ts";

await mongoose.connect("mongodb://127.0.0.1:27017/streetmap-bengaluru");

const data = JSON.parse(fs.readFileSync("./data/places.json", "utf-8"));

for (let p of data) {
  await Place.create({
    name: p.name,
    category: p.category,
    location: {
      type: "Point",
      coordinates: [p.lng, p.lat]
    },
    area: p.area,
    tags: p.tags,
    openTime: p.openTime,
    closeTime: p.closeTime,
    rating: p.rating,
    description: p.description
  });
}

console.log("Data Imported");
process.exit();
