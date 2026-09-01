import pool from "../../../config/database.js";

import type {
    UpdatePersonalInfoData,
} from "../../../types/personal_info/personal_info.js";

//get
const get = async () => {
    const result = await pool.query(
        `
        SELECT
            p.id,
            p.full_name,
            p.professional_title,
            p.short_bio,
            p.bio,
            p.profile_image_url,
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
                        'icon', s.icon,
                        'display_order', s.display_order,
                        'is_visible', s.is_visible
                    )
                    ORDER BY s.display_order
                )
                FROM social_link s
                WHERE s.personal_info_id = p.id
            ),
            '[]'::json
        ) AS social_links
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
            profile_image_url: "profile_image_url",
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

export default {
    get,
    update
};