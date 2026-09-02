import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(
        `
            ALTER TABLE resumes
            DROP CONSTRAINT IF EXISTS resumes_personal_info_fk;

            ALTER TABLE social_links
            DROP CONSTRAINT IF EXISTS social_links_personal_info_fk;

            ALTER TABLE resumes
            DROP COLUMN IF EXISTS personal_info_id;

            ALTER TABLE social_links
            DROP COLUMN IF EXISTS personal_info_id;
        `
    )

}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(
        `
            ALTER TABLE resumes
            ADD COLUMN personal_info_id UUID;

            ALTER TABLE social_links
            ADD COLUMN personal_info_id UUID;

            ALTER TABLE resumes
            ADD CONSTRAINT resumes_personal_info_fk
            FOREIGN KEY (personal_info_id)
            REFERENCES personal_info(id)
            ON DELETE CASCADE;

            ALTER TABLE social_links
            ADD CONSTRAINT social_links_personal_info_fk
            FOREIGN KEY (personal_info_id)
            REFERENCES personal_info(id)
            ON DELETE CASCADE;
        `
    );
}
