<div align="center">

<img src="./assets/logo.png" width="80" height="80" alt="Cholo App Logo" />

<h1> CholoDIU </h1>

**Real-Time University Transport Tracking System**

[![Play Store](https://img.shields.io/badge/Play%20Store-1000+%20Downloads-34A853?style=for-the-badge&logo=googleplay&logoColor=white)](https://play.google.com/store/apps/details?id=com.musa.cholo)

<!-- [![Demo Video](https://img.shields.io/badge/Demo%20Video-Coming%20Soon-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](#) -->

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
10. [API Reference](#10-api-reference)
11. [Deployment](#11-deployment)
12. [Challenges](#12-challenges)
13. [Engineering Highlights](#13-engineering-highlights)
14. [Future Improvements](#14-future-improvements)

## 1. Overview

Cholo App is a real-time university transport management system I built to solve a real problem at my university — students had no way of knowing where buses were, whether a trip had started, or how long they needed to wait.

The system lets students view schedules, see assigned buses, and track live bus locations with ETA and distance from their phone. Drivers use the same app to start trips and broadcast their GPS location every 5 seconds. Everything updates in real time through Socket.IO.

The project is a monorepo with three parts: a React Native mobile app (students + drivers), a React admin dashboard, and an Express.js backend. It is live on the Google Play Store with 1000+ downloads and is actively used at my university.

## 2. Features

| #   | Feature               | Description                                              |
| --- | --------------------- | -------------------------------------------------------- |
| 1   | **Sign In / Sign Up** | Secure onboarding for students, drivers, and admins      |
| 2   | **Authentication**    | JWT access and refresh tokens with role-based middleware |
| 3   | **Role System**       | Separate roles for students, drivers, and admins         |
| 4   | **Live Bus Tracking** | Real-time GPS updates via Socket.IO every 5 seconds      |
| 5   | **ETA & Distance**    | Calculated using Turf.js and the Haversine formula       |
| 6   | **Route-Based Rooms** | Users only receive updates for their selected route      |
| 7   | **Schedule Viewing**  | Students can view bus schedules from the mobile app      |
| 8   | **Driver Broadcast**  | Drivers share live location during active trips          |
| 9   | **Admin Dashboard**   | Manage routes, buses, drivers, and schedules             |
| 10  | **LRU Cache**         | Optimizes active trip lookup on the backend              |
| 11  | **Map View**          | Live moving markers and route polylines with MapLibre    |

## 3. Tech Stack

**Mobile** — React Native, Expo, Redux Toolkit, RTK Query, Socket.IO Client, MapLibre, Turf.js

**Admin** — React, Vite, TailwindCSS, Axios

**Server** — Node.js, Express.js, MongoDB, Mongoose, Socket.IO, JWT, LRU Cache

## 4. System Architecture

![System Architecture](./assets/sad.png)

A high-level overview of the mobile, admin, and backend components with the live data flow between users and the server.

## 5. Real-Time Tracking Flow

![System Architecture](./assets/wfd.png)

A workflow diagram showing how driver GPS updates are sent to the backend, processed, and broadcast to student devices in real time.

## 6. Database Collections

| #   | Collection  | Purpose                         |
| --- | ----------- | ------------------------------- |
| 1   | `Users`     | Students, drivers, and admins   |
| 2   | `Routes`    | University transport routes     |
| 3   | `Buses`     | Bus information                 |
| 4   | `Schedules` | Bus schedules per route         |
| 5   | `Trips`     | Active and past trips           |
| 6   | `Drivers`   | Driver profiles and assignments |

## 7. Screenshots

### 7.1 Mobile App

![App Screens](./assets/screen.png)

### 7.2 Admin Dashboard

**Schedule Management**
![Schedule Management](./assets/admin-schedule.png)

**Bus Management**
![Bus Management](./assets/admin-buses.png)

## 8. Project Structure

![Project structure](./assets/project-structure.png)

## 9. Installation & Setup

### Prerequisites

- Node.js v18+
- MongoDB
- Expo CLI (`npm install -g expo-cli`)

### Clone and Install

```bash
git clone <YOUR_REPOSITORY_URL>
cd cholo-diu

cd server && npm install
cd ../client && npm install
cd ../admin && npm install
```

### Environment Variables

Use the server env example file at `server/.env.example` as a reference.

```bash
copy server\.env.example server\development.env

# Required Variables
NODE_ENV=development

PORT=4000
DATABASE_URL=
BCRYPT_SALT_ROUNDS=10

# JWT configuration for access and refresh tokens
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_LIFE=30d
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_LIFE=100d

# Brevo credentials for transactional email
BREVO_USER=
BREVO_API_KEY=
```

### Run

```bash
# Backend
cd server && npm run dev

# Mobile app
cd client && npm run dev

# Admin dashboard
cd admin && npm run dev
```

## 10. API Reference

> Full Swagger documentation coming soon.

### Authentication

| Method | Endpoint             | Description                               |
| ------ | -------------------- | ----------------------------------------- |
| POST   | `/api/auth/register` | Register a new user                       |
| POST   | `/api/auth/login`    | Login and receive access + refresh tokens |
| POST   | `/api/auth/refresh`  | Refresh an expired access token           |
| POST   | `/api/auth/logout`   | Invalidate the refresh token              |

### Routes & Schedules

| Method | Endpoint                  | Description                        |
| ------ | ------------------------- | ---------------------------------- |
| GET    | `/api/routes`             | List all routes                    |
| GET    | `/api/routes/:id`         | Get a single route with stops      |
| GET    | `/api/schedules`          | List all schedules                 |
| GET    | `/api/schedules/:routeId` | Get schedules for a specific route |

### Trips

| Method | Endpoint                     | Description                       |
| ------ | ---------------------------- | --------------------------------- |
| POST   | `/api/trips/start`           | Start a new trip (driver only)    |
| POST   | `/api/trips/end`             | End the active trip (driver only) |
| GET    | `/api/trips/active/:routeId` | Get the active trip for a route   |

### Admin

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| GET    | `/api/admin/users`     | List all users             |
| POST   | `/api/admin/buses`     | Add a new bus              |
| PUT    | `/api/admin/buses/:id` | Update bus details         |
| DELETE | `/api/admin/buses/:id` | Remove a bus               |
| POST   | `/api/admin/drivers`   | Assign a driver to a route |

### Socket.IO Events

| Event             | Direction       | Payload                                  |
| ----------------- | --------------- | ---------------------------------------- |
| `join_route`      | Client → Server | `{ routeId }`                            |
| `location_update` | Client → Server | `{ lat, lng, speed, timestamp }`         |
| `bus_location`    | Server → Client | `{ lat, lng, speed, tripId, timestamp }` |
| `trip_started`    | Server → Client | `{ tripId, routeId, driverId }`          |
| `trip_ended`      | Server → Client | `{ tripId }`                             |

## 11. Deployment

- Production backend hosted on DigitalOcean using `nginx` as a reverse proxy and `pm2` for process management.
- Database hosted on MongoDB Atlas for reliable cloud storage and global access.
- Mobile app is published on the Google Play Store for students and drivers.

## 12. Challenges

- Calculating accurate distance and ETA along a route polyline while optimizing performance for real-time updates
- Integrating and adapting to an outdated MapLibre SDK and handling compatibility issues
- Managing real-time GPS inconsistencies and maintaining smooth synchronization between driver and student views over Socket.IO

## 13. Engineering Highlights

- Route-based socket rooms so users only receive updates for their selected route
- GPS broadcasting every 5 seconds with real-time Socket.IO event fan-out
- ETA and distance calculation using Turf.js and the Haversine formula
- LRU caching for faster active trip lookup and reduced database queries
- Modular backend architecture using Route → Controller → Service pattern
- JWT-based authentication with role-based authorization middleware
- Persistent Node.js process management using PM2 behind Nginx reverse proxy

## 14. Future Improvements

- [ ] Push notifications
- [ ] Offline schedule caching
- [ ] Redis Pub/Sub for horizontal socket scaling
- [ ] Bus occupancy tracking

<div align="center">
## License

This project is licensed under the MIT License.

</div>
