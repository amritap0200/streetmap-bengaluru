import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Place from "../models/Place.ts";

dotenv.config();

async function importData() {
  try {
    // connect to DB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "streetmap-bengaluru",
    });

    console.log("MongoDB connected");

    // read JSON file
    const data = JSON.parse(
      fs.readFileSync("./data/places.json", "utf-8")
    );

    // clear old data (optional but useful)
    await Place.deleteMany();

    // insert new data
    const formattedData = data.map((p) => ({
      name: p.name,
      category: p.category,
      location: {
        type: "Point",
        coordinates: [p.lng, p.lat],
      },
      area: p.area,
      tags: p.tags || [],
      openTime: p.openTime,
      closeTime: p.closeTime,
      rating: p.rating,
      description: p.description,
    }));

    await Place.insertMany(formattedData);

    console.log("Data Imported Successfully");
    process.exit();

  } catch (error) {
    console.error("Error importing data", error);
    process.exit(1);
  }
}

importData();
