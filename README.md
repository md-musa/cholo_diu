<div align="center">

<img src="https://img.icons8.com/fluency/96/bus.png" width="80" height="80" alt="Cholo App Logo" />

# Cholo App

**Real-Time University Transport Tracking System**

*Cholo means "Let's Go"*

[![Play Store](https://img.shields.io/badge/Play%20Store-1000+%20Downloads-34A853?style=for-the-badge&logo=googleplay&logoColor=white)](https://play.google.com/store/apps/details?id=com.musa.cholo)
[![Demo Video](https://img.shields.io/badge/Demo%20Video-Watch-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](#)

</div>



## Table of Contents

1. [Overview](#1-overview)
2. [Features](#2-features)
3. [Tech Stack](#3-tech-stack)
4. [System Architecture](#4-system-architecture)
5. [Real-Time Tracking Flow](#5-real-time-tracking-flow)
6. [Database Collections](#6-database-collections)
7. [Screenshots](#7-screenshots)
8. [Project Structure](#8-project-structure)
9. [Installation & Setup](#9-installation--setup)
10. [Engineering Highlights](#10-engineering-highlights)
11. [Technical Challenges](#11-technical-challenges)
12. [Future Improvements](#12-future-improvements)
13. [What I Learned](#13-what-i-learned)



## 1. Overview

Cholo App is a real-time university transport management system I built to solve a real problem at my university — students had no way of knowing where buses were, whether a trip had started, or how long they needed to wait.

The system lets students view schedules, see assigned buses, and track live bus locations with ETA and distance from their phone. Drivers use the same app to start trips and broadcast their GPS location every 5 seconds. Everything updates in real time through Socket.IO — no polling.

The project is a monorepo with three parts: a React Native mobile app (students + drivers), a React admin dashboard, and an Express.js backend. It is live on the Google Play Store with 1000+ downloads and is actively used at my university.



## 2. Features

| # | Feature | Description |
|---|---|---|
| 1 | **Authentication** | JWT access and refresh tokens with role-based middleware |
| 2 | **Role System** | Separate roles for students, drivers, and admins |
| 3 | **Live Bus Tracking** | Real-time GPS updates via Socket.IO every 5 seconds |
| 4 | **ETA & Distance** | Calculated using Turf.js and the Haversine formula |
| 5 | **Route-Based Rooms** | Users only receive updates for their selected route |
| 6 | **Schedule Viewing** | Students can view bus schedules from the mobile app |
| 7 | **Driver Broadcast** | Drivers share live location during active trips |
| 8 | **Admin Dashboard** | Manage routes, buses, drivers, and schedules |
| 9 | **LRU Cache** | Optimizes active trip lookup on the backend |
| 10 | **Map View** | Live moving markers and route polylines with MapLibre |



## 3. Tech Stack

**Mobile** — React Native, Expo, Redux Toolkit, RTK Query, Socket.IO Client, MapLibre, Turf.js

**Admin** — React, Vite, TailwindCSS, Axios

**Server** — Node.js, Express.js, MongoDB, Mongoose, Socket.IO, JWT, LRU Cache



## 4. System Architecture

```
Mobile App (React Native)
        |
        |  REST API + Socket.IO
        v
Express.js Backend
        |
   +---------+----------+
   |         |          |
   v         v          v
MongoDB   Socket.IO  LRU Cache
```



## 5. Real-Time Tracking Flow

```
Driver starts trip
        |
        v
Driver GPS broadcast (every 5s)
        |
        v
Socket.IO server receives location
        |
        v
Broadcast to route-based room
        |
        v
Students receive live update
        |
        v
Map marker updates in real time
```



## 6. Database Collections

| # | Collection | Purpose |
|---|---|---|
| 1 | `Users` | Students, drivers, and admins |
| 2 | `Routes` | University transport routes |
| 3 | `Buses` | Bus information |
| 4 | `Schedules` | Bus schedules per route |
| 5 | `Trips` | Active and past trips |
| 6 | `Drivers` | Driver profiles and assignments |



## 7. Screenshots

### 7.1 Mobile App

**Home Screen** — [ Add Screenshot ]

**Live Tracking** — [ Add Screenshot ]

**Schedule View** — [ Add Screenshot ]

### 7.2 Admin Dashboard

**Dashboard** — [ Add Screenshot ]

**Route Management** — [ Add Screenshot ]



## 8. Project Structure

```
cholo-app/
|
├── client/               # React Native mobile app (students + drivers)
├── admin/                # React web dashboard (admin)
└── server/               # Express.js API + Socket.IO server
    ├── .env.example      # Environment variable template
    └── src/
        ├── routes/       # Express route definitions
        ├── controllers/  # Request handlers
        ├── services/     # Business logic
        ├── models/       # Mongoose schemas
        └── middlewares/  # Auth and role protection
```



## 9. Installation & Setup

### Prerequisites

- Node.js v18+
- MongoDB
- Expo CLI (`npm install -g expo-cli`)

### Clone and Install

```bash
git clone <YOUR_REPOSITORY_URL>
cd cholo-app

cd server && npm install
cd ../client && npm install
cd ../admin && npm install
```

### Environment Variables

```bash
cp server/.env.example server/.env
```

```env
# server/.env
PORT=5000
MONGO_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
```

```env
# client/.env
EXPO_PUBLIC_API_URL=http://localhost:5000
EXPO_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Run

```bash
# Backend
cd server && npm run dev

# Mobile app
cd client && npx expo start

# Admin dashboard
cd admin && npm run dev
```


## 10. Engineering Highlights

- Route-based socket rooms so users only receive updates for their route
- GPS broadcast every 5 seconds with instant Socket.IO fan-out
- ETA and distance calculated with Turf.js and the Haversine formula
- LRU cache for fast active trip lookups without repeated DB queries
- Modular backend using Route → Controller → Service pattern
- JWT refresh token rotation with role-based middleware protection


## 11. Technical Challenges

The hardest part was getting the real-time system right. Some specific problems I ran into:

- Keeping map markers smooth with frequent GPS updates
- Managing socket room subscriptions when users switch routes
- Handling reconnection scenarios without duplicating location data
- Synchronizing trip state between the driver and all connected students


## 12. Future Improvements

- [ ] Push notifications when a trip starts
- [ ] Offline schedule caching
- [ ] Redis Pub/Sub for horizontal socket scaling
- [ ] Bus occupancy tracking
- [ ] AI-based ETA prediction
- [ ] Multi-university support


## 13. What I Learned

- How real-time WebSocket systems work at a practical level
- Building and managing Socket.IO rooms for efficient broadcasting
- GPS tracking workflows and geospatial calculations
- Mobile app development with React Native and Expo
- Monorepo project organization for multi-platform apps
- JWT authentication with refresh token rotation
- Backend architecture using a layered service pattern


<div align="center">
MIT License · Built to solve a real problem at my university.
</div>
