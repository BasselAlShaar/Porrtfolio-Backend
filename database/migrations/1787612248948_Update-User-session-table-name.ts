import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.renameTable("user_session", "user_sessions");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.renameTable("user_sessions", "user_session");
}
