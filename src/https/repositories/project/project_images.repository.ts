import pool from "../../../config/database.js";

import type {
    CreateProjectImagesData,
    UpdateProjectImagesData
} from "../../../types/project/project_images.js";

//admin
//get all
const find_all = async (id: string) => {
    const result = await pool.query(
        `
            SELECT
                id,
                image_url,
                alt_text,
                caption,
                image_type,
                display_order
            FROM project_images
            WHERE project_id = $1
        `,[id]
    )

    return result.rows;
}

//const get one
const getById = async (id: string) => {
    const result = await pool.query(
        `
            SELECT
                id,
                image_url,
                alt_text,
                caption,
                image_type,
                display_order
            FROM project_images
            WHERE id = $1
        `,[id]
    );

    return result.rows[0] ?? null;
}

//create
const create = async (data: CreateProjectImagesData) => {
    const result = await pool.query(
        `
        INSERT INTO project_images  (
            project_id,
            image_url,
            alt_text,
            caption,
            Image_type,
            display_order
        )
        VALUES (
            $1, $2, $3,
            $4, $5, $6
        )
        Returning *
        `,[
            data.project_id,
            data.image_url,
            data.alt_text,
            data.caption,
            data.image_type,
            data.display_order
        ]
    )

    return result.rows ?? null;
}

//update
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
            image_url: "image_url",
            alt_text: "alt_text",
            caption: "caption",
            image_type: "image_type",
            display_order: "display_order",
        };

    for (const [key, column] of Object.entries(updateableFields)) {
            const value = data[key as keyof UpdateProjectImagesData];
    
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
            UPDATE project_images
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
            DELETE FROM project_images
            WHERE id = $1
            RETURNING id
        `,[id]
    );

    return result.rows[0] ?? null;
}

export default {
    find_all,
    getById,
    create,
    update,
    delete: remove
}