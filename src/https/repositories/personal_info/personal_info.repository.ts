import pool from "../../../config/database.js";

import type {
    UpdatePersonalInfoData,
} from "../../../types/personal_info/personal_info.js";

//get Public
const getPublic = async () => {
    const result = await pool.query(
        `
        SELECT
            p.full_name,
            p.professional_title,
            p.short_bio,
            p.bio,
            p.location,
            p.email,
            p.phone,
            p.availability_status,
            p.availability_text,        
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'id', s.id,
                        'platform', s.platform,
                        'label', s.label,
                    )
                    ORDER BY s.display_order
                )
                FROM social_links s
                WHERE s.personal_info_id = p.id
                AND s.is_visible = true
            ),
            '[]'::json
        ) AS links
        FROM personal_info p
        `
    );

    return result.rows[0] ?? null;
};

//get admin
const get = async () => {
    const result = await pool.query(
        `
        SELECT
            p.full_name,
            p.professional_title,
            p.short_bio,
            p.bio,
            p.location,
            p.email,
            p.phone,
            p.availability_status,
            p.availability_text,        
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'id', s.id,
                        'platform', s.platform,
                        'label', s.label,
                        'url', s.url,
                        'display_order', s.display_order,
                        'is_visible', s.is_visible
                    )
                    ORDER BY s.display_order
                )
                FROM social_links s
                WHERE s.personal_info_id = p.id
            ),
            '[]'::json
        ) AS links
        FROM personal_info p
        `
    );

    return result.rows[0] ?? null;
};

// Update
const update = async (
    data: UpdatePersonalInfoData
) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
            keyof UpdatePersonalInfoData,
            string
        > = {
            full_name: "full_name",
            professional_title: "professional_title",
            short_bio: "short_bio",
            bio: "bio",
            location: "location",
            email: "email",
            phone: "phone",
            availability_status: "availability_status",
            availability_text: "availability_text",
        };

    for (const [key, column] of Object.entries(updateableFields)) {
            const value = data[key as keyof UpdatePersonalInfoData];
    
            if (value !== undefined) {
                values.push(value);
                fields.push(`${column} = $${values.length}`);
            }
    }

    if (fields.length === 0) {
        return null;
    }

    fields.push(`updated_at = NOW()`);

    const result = await pool.query(
        `
            UPDATE personal_info
            SET ${fields.join(", ")}
            RETURNING *;
        `,
        values
    );

    return result.rows[0] ?? null;
};

// Update the stored image file information
const updateStorageKey = async (
    storageKey: string,
) => {
    const result = await pool.query(
        `
            UPDATE personal_info
            SET
                profile_image_url = $1,
                updated_at = NOW()
            RETURNING *;
        `,
        [storageKey]
    );

    return result.rows[0] ?? null;
};

const getImageStorageKey = async () => {
    const result = await pool.query(
        `
            SELECT
                profile_image_url
            FROM personal_info
        `
    )

    return result.rows[0].personal_info ?? null;
}

export default {
    getPublic,
    get,
    update,
    updateStorageKey,
    getImageStorageKey
};