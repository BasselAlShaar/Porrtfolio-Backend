import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(
        `
            CREATE UNIQUE INDEX resumes_one_active_idx
            ON resumes (is_active)
            WHERE is_active = TRUE;
        `
    );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(
        `
            DROP INDEX IF EXISTS resumes_one_active_idx;
        `
    );
}
