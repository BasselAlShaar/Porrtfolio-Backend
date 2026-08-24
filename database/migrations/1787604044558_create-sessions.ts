import type { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
    pgm.sql(`
        CREATE TABLE "session" (
            "sid" varchar NOT NULL,
            "sess" json NOT NULL,
            "expire" timestamp(6) NOT NULL,
            CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
        );

        CREATE INDEX "IDX_session_expire"
            ON "session" ("expire");
    `);
};

export const down = (pgm: MigrationBuilder): void => {
    pgm.sql(`
        DROP TABLE IF EXISTS "session";
    `);
};