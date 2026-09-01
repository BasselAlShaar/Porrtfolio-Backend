import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(
        `
            INSERT INTO personal_info(
                full_name,
                professional_title,
                short_bio,
                bio,
                profile_image_url,
                location,
                email,
                phone,
                availability_status,
                availability_text,
                updated_at,
                created_at
            )
            VALUES (
                'Bassel Al-Shaar',
                'Software Developer',
                'A passionate software developer with expertise in web development.',
                'Bassel has over 10 years of experience in building scalable web applications. He is proficient in various programming languages and frameworks, and has a strong background in both frontend and backend development.',
                '',
                'Beirut, Lebanon',
                'basselalshaar11@gmail.com',
                '+961 76 859 886',
                true,
                'Available for new opportunities',
                NOW(),
                NOW()
            )
        `
    )
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(
        `
            DELETE FROM personal_info
            WHERE full_name = 'Bassel Al-Shaar'
        `
    )
}
