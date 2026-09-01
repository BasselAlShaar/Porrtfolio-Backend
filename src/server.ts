// ================================================================
// BACKEND INITIALIZATION
// ================================================================
//
// If you're reading this, congratulations.
// You have entered the part of the portfolio where things
// either work perfectly or fail because of one missing env var.
//
// No frontend magic here.
// Just TypeScript, Express, PostgreSQL, and questionable decisions.
//
// Days Here: 21
// Scream Counter: 147
//
// ================================================================

/*
//!   Education Achievements
//Todo : education achievements types
//Todo : education achievements repository
//Todo : education achievements service
//Todo : education achievements middleware
//Todo : education achievements controller
//Todo : education achievements routes

//!   Experience Achievements
//Todo : experience achievements types
//Todo : experience achievements repository
//Todo : experience achievements service
//Todo : experience achievements middleware
//Todo : experience achievements controller
//Todo : experience achievements routes

//!   Experience Responsibilities
//Todo : experience responsibilities types
//Todo : experience responsibilities repository
//Todo : experience responsibilities service
//Todo : experience responsibilities middleware
//Todo : experience responsibilities controller
//Todo : experience responsibilities routes

!   Social links
Todo : social links types
Todo : social links repository
Todo : social links service
Todo : social links middleware
Todo : social links controller
Todo : social links routes

!   Resume
Todo : resume types
Todo : resume repository
Todo : resume service
Todo : resume middleware
Todo : resume controller
Todo : resume routes

!   Personal Info
Todo : personal info types
Todo : personal info repository
Todo : personal info service
Todo : personal info middleware
Todo : personal info controller
Todo : personal info routes

!   Projects
Todo : projects types
Todo : projects repository
Todo : projects service
Todo : projects middleware
Todo : projects controller
Todo : projects routes

!   Project Challenges
Todo : project challenges types
Todo : project challenges repository
Todo : project challenges service
Todo : project challenges middleware
Todo : project challenges controller
Todo : project challenges routes

!   Project features
Todo : project features types
Todo : project features repository
Todo : project features service
Todo : project features middleware
Todo : project features controller
Todo : project features routes

!   Project images
Todo : project images types
Todo : project images repository
Todo : project images service
Todo : project images middleware
Todo : project images controller
Todo : project images routes

!   Project links
Todo : project links types
Todo : project links repository
Todo : project links service
Todo : project links middleware
Todo : project links controller
Todo : project links routes

!   Project skills
Todo : project skills types
Todo : project skills repository
Todo : project skills service
Todo : project skills middleware
Todo : project skills controller
Todo : project skills routes

!   Project technologies
Todo : project technologies types
Todo : project technologies repository
Todo : project technologies service
Todo : project technologies middleware
Todo : project technologies controller
Todo : project technologies routes

*/


import 'dotenv/config';
import express from 'express';
import router from './routes/index.js';
import sessionMiddleware from './https/middlewares/session.middleware.js';

// Creating the application.
// This is where the journey begins.
//
// Everything looks innocent right now.
// Give it 5 minutes.
const app = express();

// Allow the API to understand JSON.
//
// 100KB should be more than enough.
// If someone sends 100KB+ of JSON to this portfolio,
// they probably have bigger problems than my API.
app.use(express.json({
    limit: "100kb",
}));

// Session handling.
//
// Because apparently remembering who you are
// requires an entire middleware and a database.
//
// Security: important.
// Overengineering: never heard of it.
app.use(sessionMiddleware);

// ================================================================
// ROUTES
// ================================================================
//
// Welcome to /api/v1.
//
// The "v1" means:
// "I promise this won't change."
//
// Spoiler:
// It will.
// ================================================================
app.use("/api/v1", router);

// The sacred PORT.
//
// If this is undefined, check your .env.
// If your .env is correct, restart the server.
// If it still doesn't work...
//
// ...welcome to backend development.
const PORT = process.env.PORT;

// ================================================================
// IGNITION
// ================================================================
//
// Starting the server.
//
// At this point there are only two possible outcomes:
//
// 1. "Server is running."
// 2. 67 lines of errors I definitely understand.
//
// Let's find out.
// ================================================================
app.listen(PORT, () => {
    // If you're wondering why this console.log is this large:
    //
    // I spent 4 hours debugging a database connection,
    // so now the server gets a motivational speech every time it starts.
    // and "Server is running on port 5000" wasn't dramatic enough.
    //
    // Also known as:
    // making the backend look 69% more professional.
    console.log(`
        ╔══════════════════════════════════════════════════════════════════╗
        ║                                                                  ║
        ║    ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗        ║
        ║    ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║        ║
        ║    ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║        ║
        ║    ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║        ║
        ║    ██║     ╚██████╔╝██████╔╝   ██║   ███████╗╚██████╔╝███████╗   ║
        ║    ╚═╝      ╚═════╝ ╚═════╝    ╚═╝   ╚══════╝ ╚═════╝ ╚══════╝   ║
        ║                                                                  ║
        ║                  🚀 PORTFOLIO API IS ONLINE                      ║
        ║                                                                  ║
        ╠══════════════════════════════════════════════════════════════════╣
        ║                                                                  ║
        ║  🌐 Environment : development                                    ║
        ║  🚪 Port        : 5000                                           ║
        ║  🔗 API         : /api/v1                                        ║
        ║  🔐 Sessions    : Enabled                                        ║
        ║                                                                  ║
        ║  ─────────────────── LIVE DEVELOPMENT METRICS ─────────────────  ║
        ║                                                                  ║
        ║  👀 Visitors       : -5                                          ║
        ║  📡 Requests       : infinity                                    ║
        ║  ⏱️  Uptime         : Long enough                                 ║
        ║  🐛 Bugs Fixed     : -_-                                         ║
        ║  ☕ Coffees        : Importing in Containers                     ║
        ║  😭 Frustrations   : A LOT                                       ║
        ║                                                                  ║
        ║                                                                  ║
        ╠══════════════════════════════════════════════════════════════════╣
        ║                                                                  ║
        ║  Status: "Surprisingly still working."                           ║
        ║                                                                  ║
        ╚══════════════════════════════════════════════════════════════════╝
    `);
});

// If you made it this far:
//
// 🫡 Respect.
//
// Now don't touch anything.
// It works.
// TODO:
// - Add monitoring
// - Add logging
// - Add tests
// - Add caching
// - Touch grass
//
// Current status:
// - Still in development stage
//
// Therefore:
// - I hate my life