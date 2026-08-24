import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import pool from "../../config/database.js";

const PostgreSQLStore = connectPgSimple(session);

const sessionMiddleware = session({
    store: new PostgreSQLStore({
        pool,
        tableName: "user_sessions",
    }),

    secret: process.env.SESSION_SECRET!,

    resave: false,

    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60,
    },
});

export default sessionMiddleware;