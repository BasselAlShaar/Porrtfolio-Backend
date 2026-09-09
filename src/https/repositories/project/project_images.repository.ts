import pool from "../../../config/database.js";

import type {
    CreateProjectImagesData,
    UpdateProjectImagesData,
} from "../../../types/project/project_images.js";

// Get all project images for a project
const find_all = async (slug: string) => {
    const result = await pool.query(
        `
            SELECT
                pi.id,
                pi.project_id,
                pi.image_storage_key,
                pi.alt_text,
                pi.caption,
                pi.image_type,
                pi.display_order
            FROM project_images pi
            INNER JOIN projects p
                ON p.id = pi.project_id
            WHERE p.slug = $1
            ORDER BY pi.display_order ASC
        `,
        [slug]
    );

    return result.rows;
};

// Get a single project image
const getById = async (id: string) => {
    const result = await pool.query(
        `
            SELECT
                id,
                project_id,
                image_storage_key,
                alt_text,
                caption,
                image_type,
                display_order
            FROM project_images
            WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] ?? null;
};

// Create a project image
const create = async (
    data: CreateProjectImagesData
) => {
    const result = await pool.query(
        `
            INSERT INTO project_images (
                project_id,
                image_storage_key,
                alt_text,
                caption,
                image_type,
                display_order
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )
            RETURNING *;
        `,
        [
            data.project_id,
            data.image_storage_key,
            data.alt_text,
            data.caption,
            data.image_type,
            data.display_order,
        ]
    );

    return result.rows[0] ?? null;
};

// Update project image metadata
const update = async (
    id: string,
    data: UpdateProjectImagesData
) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
        keyof UpdateProjectImagesData,
        string
    > = {
        alt_text: "alt_text",
        caption: "caption",
        image_type: "image_type",
        display_order: "display_order",
    };

    for (const [key, column] of Object.entries(
        updateableFields
    )) {
        const value =
            data[key as keyof UpdateProjectImagesData];

        if (value !== undefined) {
            values.push(value);
            fields.push(`${column} = $${values.length}`);
        }
    }

    if (fields.length === 0) {
        return null;
    }

    fields.push("updated_at = NOW()");

    values.push(id);

    const result = await pool.query(
        `
            UPDATE project_images
            SET ${fields.join(", ")}
            WHERE id = $${values.length}
            RETURNING *;
        `,
        values
    );

    return result.rows[0] ?? null;
};

// Update the stored image file information
const updateStorageKey = async (
    id: string,
    storageKey: string,
) => {
    const result = await pool.query(
        `
            UPDATE project_images
            SET
                image_storage_key = $1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING *;
        `,
        [
            storageKey,
            id,
        ]
    );

    return result.rows[0] ?? null;
};

// Delete a project image
const remove = async (id: string) => {
    const result = await pool.query(
        `
            DELETE FROM project_images
            WHERE id = $1
            RETURNING id;
        `,
        [id]
    );

    return result.rows[0] ?? null;
};

export default {
    find_all,
    getById,
    create,
    update,
    updateStorageKey,
    delete: remove,
};