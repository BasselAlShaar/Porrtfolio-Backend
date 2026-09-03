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