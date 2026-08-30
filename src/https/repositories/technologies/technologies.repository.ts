import pool from "../../../config/database.js";

import type {
    CreateTechnologiesData,
    UpdateTechnologiesData
} from "../../../types/technologies/technologies.js";

//public
//get all
const find_all_public = async () => {
    const result = await pool.query(`
        SELECT
            c.name,
            c.description,
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'name', s.name,
                            'description', s.description,
                            'icon', s.icon
                        )
                        ORDER BY s.display_order
                    )
                    FROM technologies s
                    WHERE s.category_id = c.id
                ),
                '[]'::json
            ) AS technologies
        FROM technology_categories c
        ORDER BY c.display_order ASC;
    `);

    return result.rows;
};

//admin
//get all
const find_all = async () => {
    const result = await pool.query(`
        SELECT
            id,
            name,
            description,
            display_order,
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'id', s.id,
                        'name', s.name,
                        'description', s.description,
                        'icon', s.icon,
                        'display_order', s.display_order
                    )
                    ORDER BY s.display_order
                )
                FROM technologies s
                WHERE s.category_id = c.id
            ),
            '[]'::json
        ) AS technologies
        FROM technology_categories c
        ORDER BY c.display_order ASC 
    `)

    return result.rows;
}

//get one
const findById = async (id: string) => {
    const result = await pool.query(`
        SELECT
            s.id,
            s.name,
            s.description,
            s.icon,
            s.display_order,
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', sc.id,
                            'name', sc.name
                        )
                        ORDER BY sc.display_order
                    )
                    FROM technology_categories sc
                    WHERE s.category_id = sc.id
                ),
                '[]'::json
            ) AS technology_category
        FROM technologies s
        WHERE s.id = $1;
    `, [id]);

    return result.rows[0] ?? null;
};

//create
const create = async (data: CreateTechnologiesData) => {
    const result = await pool.query(`
        INSERT INTO technologies (
            name,
            category_id,
            description,
            icon,
            display_order
        )
        VALUES ( 
            $1, $2, $3, $4, $5
        )
        RETURNING *
    `,[
        data.name,
        data.category_id,
        data.description,
        data.icon,
        data.display_order
    ]);

    return result.rows ?? null;
}

//update
const update = async (
    id:string,
    data: UpdateTechnologiesData
) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
            keyof UpdateTechnologiesData,
            string
        > = {
            name: "name",
            category_id: "category_id",
            description: "description",
            icon: "icon",
            display_order: "display_order",
        };

    for (const [key, column] of Object.entries(updateableFields)) {
            const value = data[key as keyof UpdateTechnologiesData];
    
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
            UPDATE technologies
            SET ${fields.join(", ")}
            WHERE id = $${values.length}
            RETURNING *;
        `,
        values
    );

    return result.rows[0] ?? null;
};

//delete
const remove = async (id:string) => {
    const result = await pool.query(`
        DELETE FROM technologies
        WHERE id = $1
        Returning id
    `,[id])

    return result.rows[0] ?? null;
}

export default {
    find_all_public,
    find_all,
    findById,
    create,
    update,
    delete: remove,
};