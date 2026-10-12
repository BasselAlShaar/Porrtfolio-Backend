import pool from "../../../config/database.js";

import type {
    CreateProjectLinksData,
    UpdateProjectLinksData
} from "../../../types/project/project_links.js";

//admin
//get all
const find_all = async (slug: string) => {
    const result = await pool.query(
        `
            SELECT
                pc.id,
                pc.link_type,
                pc.label,
                pc.url,
                pc.display_order
            FROM project_links pc
            JOIN projects p ON pc.project_id = p.id
            WHERE p.slug = $1
        `,[slug]
    )

    return result.rows;
}

//const get one
const getById = async (id: string) => {
    const result = await pool.query(
        `
            SELECT
                pc.id,
                pc.link_type,
                pc.label,
                pc.url,
                pc.display_order
            FROM project_links pc
            JOIN projects p ON pc.project_id = p.id
            WHERE pc.id = $1
        `,[id]
    );

    return result.rows[0] ?? null;
}

//create
const create = async (project_id: string, data: CreateProjectLinksData) => {
    const result = await pool.query(
        `
        INSERT INTO project_links  (
            project_id,
            link_type,
            label,
            url,
            display_order
        )
        VALUES (
            $1, $2, $3,
            $4, $5
        )
        Returning *
        `,[
            project_id,
            data.link_type,
            data.label,
            data.url,
            data.display_order
        ]
    )

    return result.rows ?? null;
}

//update
const update = async (
    id: string,
    data: UpdateProjectLinksData
) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
            keyof UpdateProjectLinksData,
            string
        > = {
            link_type: "link_type",
            label: "label",
            url: "url",
            display_order: "display_order",
        };

    for (const [key, column] of Object.entries(updateableFields)) {
            const value = data[key as keyof UpdateProjectLinksData];
    
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
            UPDATE project_links
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
            DELETE FROM project_links
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