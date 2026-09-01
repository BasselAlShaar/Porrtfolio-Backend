import pool from "../../../config/database.js";

import type {
    CreateSocialLinksData,
    UpdateSocialLinksData
} from "../../../types/personal_info/social_links.js";

//get all
export const find_all = async () => {
    const result = await pool.query(
        `
            SELECT
                id,
                personal_info_id,
                platform,
                label,
                url,
                icon,
                display_order,
                is_visible
            FROM social_links
        `
    );

    return result.rows;
};

//get one
export const getById = async (id: string) => {
    const result = await pool.query(
        `
            SELECT
                id,
                personal_info_id,
                platform,
                label,
                url,
                icon,
                display_order,
                is_visible
            FROM social_links
            WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] ?? null;
};

//create
export const create = async (data: CreateSocialLinksData) => {
    const result = await pool.query(
        `
            INSERT INTO social_links (
                personal_info_id,
                platform,
                label,
                url,
                icon,
                display_order,
                is_visible
            )
            VALUES (
                $1, $2, $3,
                $4, $5, $6,
                $7
            )
            RETURNING *
        `,
        [
            data.personal_info_id,
            data.platform,
            data.label,
            data.url,
            data.icon,
            data.display_order,
            data.is_visible
        ]
    );

    return result.rows[0] ?? null;
};

//update
const update = async (
    id: string,
    data: UpdateSocialLinksData
) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
            keyof UpdateSocialLinksData,
            string
        > = {
            platform: "platform",
            label: "label",
            url: "url",
            icon: "icon",
            display_order: "display_order",
            is_visible: "is_visible"
        };

    for (const [key, column] of Object.entries(updateableFields)) {
            const value = data[key as keyof UpdateSocialLinksData];
    
            if (value !== undefined) {
                values.push(value);
                fields.push(`${column} = $${values.length}`);
            }
    }

    if (fields.length === 0) {
        return null;
    }

    fields.push(`updated_at = NOW()`);

    values.push(id);

    const result = await pool.query(
        `
            UPDATE social_links
            SET ${fields.join(", ")}
            WHERE id = $${values.length}
            RETURNING *;
        `,
        values
    );

    return result.rows[0] ?? null;
};

//delete
const remove = async (id: string) => {
    const result = await pool.query(
        `
            DELETE FROM social_links
            WHERE id = $1
            RETURNING *;
        `,
        [id]
    );

    return result.rows[0] ?? null;
};
