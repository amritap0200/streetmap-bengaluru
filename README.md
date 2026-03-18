# StreetMap Bengaluru — Time-Aware Community Map for Bengaluru

## Overview

StreetMap Bengaluru is a community-driven, time-aware mapping platform designed to help users discover places in Bengaluru based on what they want, where they are, and what time it is.

It enhances traditional maps by introducing contextual, time-based discovery and local insights.

---

## Problem Statement

Users often struggle to find relevant places at specific times of the day due to:

- Inaccurate or outdated timings  
- Lack of time-based filtering  
- Poor visibility of local and niche spots  
- Static map experiences  

---

## Solution

StreetMap Bengaluru provides:

- Time-based discovery (morning, noon, evening, night)  
- Category-based maps (cafes, parks, metro, BMTC)  
- Location and tag-based filtering  
- Community-driven place contributions  

---

## Core Concept

The system is structured around three dimensions:

WHAT → Navbar (Map Type)  
WHERE → Sidebar Filters  
WHEN → Footer Modes  

---

## Features

### Map Interface
- Interactive map using Leaflet  
- Dynamic markers with popups  

### Map Layers (Navbar)
- Normal Map  
- Cafe Map  
- Park Map  
- Metro Map  
- BMTC Map  

### Time Modes (Footer)
- Morning: breakfast, parks, gyms  
- Noon: lunch, workspaces  
- Evening: snacks, bakeries  
- Night: dinner, nightlife  

### Filters
- Area  
- Category  
- Open Now  
- Tags  

### Community Features
- Add places  
- Add tags and descriptions  

---

## Tech Stack

### Frontend
- Next.js  
- React  
- Tailwind CSS  
- React Leaflet  

### Backend
- Next.js API Routes  

### Database
- MongoDB (Mongoose)  

### Maps
- OpenStreetMap  

---

## Data Model

```json
{
  "name": "CTR Malleshwaram",
  "category": "cafe",
  "location": {
    "type": "Point",
    "coordinates": [77.5706, 12.9916]
  },
  "area": "malleshwaram",
  "tags": ["breakfast", "dosa"],
  "openTime": "07:00",
  "closeTime": "11:00",
  "description": "Best benne dosa"
}
```

---

## API Endpoints

```
GET /api/places
```

### Supported Filters

```
/api/places?category=cafe
/api/places?mode=morning
/api/places?area=indiranagar
/api/places?openNow=true
```

---

## Development Progress

Day 1–2  
- Project setup  
- Map rendering  

Day 3  
- Database schema  
- API setup  
- Starter dataset  

Day 4  
- Marker rendering  
- Popups  

Day 5  
- Filters  
- Category switching  

Day 6  
- Time-based modes  

Day 7  
- UI improvements  
- Testing  

---

## Unique Value

StreetMap Bengaluru introduces time-aware mapping, enabling users to explore the city based on real-world usage patterns rather than static data.

---

## Future Scope

- User reviews and ratings  
- Real-time activity indicators  
- AI-based recommendations  
- Transit integration  

---

## Contributors

- Nandita — Frontend, Backend, Database, Map UI  
- Amrita — Backend, Database, APIs

---

## Conclusion

StreetMap Bengaluru transforms static maps into a dynamic, community-driven discovery platform tailored to how people actually experience a city.