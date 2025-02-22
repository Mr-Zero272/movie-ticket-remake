# Fullstack Moon Movie

![Demo App](/screenshots/movie-h-1.png)
![Demo App](/screenshots/movie-h-2.png)

## Overview

This project is a comprehensive fullstack application for managing movie bookings. The backend is built in Java with Microservices architecture and the frontend consists of two separate Nextjs and Angular projects: one for the user interface and one for the admin interface. This is a remake of an old project of mine but with quite a few upgrades in terms of logic and back-end to front-end processes. I will keep this project updated as much as possible.

Highlights:

- 🌟 Microservices architecture for backend
- 🎃 Nextjs for User UI, Angular for Admin UI.
- 👾 Choose movie seats in real time
- 🚀 Keyword suggestions when searching.
- 👌 Online payment via e-wallets.
- ⭐ Movie scheduling algorithm.
- 🐞 All UI is responsive to fit all devices.
- ⏳ And much more!

## Backend

The backend is composed of the following microservices:

1. **Auth Service**: Manages user authentication and authorization.
2. **Gateway Service**: Acts as an entry point to the system, routing requests to the appropriate microservice.
3. **Media Service**: Handles media content management, such as movie posters and trailers.
4. **Movie Service**: Manages movie-related data, including movie details and schedules.
5. **Registry Service**: Provides service discovery to ensure that microservices can locate each other.
6. **Reservation Service**: Manages reservations for movie tickets.
7. **Seat Service**: Manages seat availability and selection.
8. **Recommend Service**: Responsible for providing suggestions to users.

## Frontend

The frontend is divided into two separate projects:

1. **User Interface**: The user's UI is written with the nextjs framework, along with the Shadcn/ui library, tailwindcss, zod, ... With full responsiveness on all pages, there is also dark mode. The pages are designed in a modern, friendly and easy-to-use direction.
2. **Admin Interface**: The admin ui is written with the Angular framework. The reason I chose it is simply because I want to learn a new front-end framework. I have not completed the responsive part for the admin pages yet, but I have used the core parts of Angular in this project. These include core services, custom directives, guard routes, ... Because I am used to using tailwind, I only use flowbite as a place to refer to the UI, most of the important components I have to rewrite myself, so the Admin page's UI is not very beautiful compared to the User's UI.

### User Interface Features

- **Movie Browsing**: Browse and search for movies.
- **Movie Details**: View detailed information about movies.
- **Reservations**: Make and manage reservations.
- **Account Management**: Manage user account information.
- ...

### Admin Interface Features

- **Movie Management**: Add, update, and delete movies.
- **Reservation Management**: View and manage reservations.
- **User Management**: Manage user accounts.
- ...

### Technologies Used

### Technologies Used

- 🍏 Java 17
- 🍎 Spring Boot
- 🍐 Spring Security
- 🍊 Spring Cloud (for microservices and service discovery)
- 🍋 Eureka (for service registry)
- 🍉 Python
- 🍇 Flask
- 🍓 MySQL, MongoDB and Redis
- 🍈 Nextjs
- 🥝 Angular
- 🥑 Axios
- 🍍Tailwindcss
- 🍒 Shadcn/ui
- 🍑 Zod
- 🍆 React Hook Form
- 🥒Tanstack Table
- 🥕 Socket.io
- 🍌 ...

## Getting Started

### Prerequisites

- **JDK 17**
- **Node.js**
- **npm or yarn**
- **python 3**

### Installation

1. **Backend**:

   - Clone the repository and navigate to the backend directory.
   - Build the project using Maven: `mvn clean install`.
   - Next, just start Registry Service first and then the remaining services.
   - For recommendation service just run `py main.py`.

2. **Frontend**:
   - Clone the repository and navigate to the frontend directories (user and admin).
   - Install dependencies using npm or yarn: `npm install` or `yarn install`.
   - Start the development server: `npm run dev` or `yarn run dev`.
   - With Admin project: ng server

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for any enhancements or bug fixes.
