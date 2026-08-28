import pool from "../../../config/database.js";
import type {
    CreateSkillsData,
    UpdateSkillsData
} from "../../../types/skills.js";

//public
//get all
const find_all_public = async () => {
    const result = await pool.query(`
        SELECT
            name,
            description
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'title', s.title,
                        'description', s.description,
                        'icon', s.icon
                    )
                    ORDER BY s.display_order
                )
                FROM skills s
                WHERE s.category_id = c.id
            ),
            '[]'::jsonb
        ) AS skills,
        FROM skill_categories c
        ORDER BY display_order ASC 
    `)

    return result.rows;
}

//admin
//get all
const find_all = async () => {
    const result = await pool.query(`
        SELECT
            id
            name,
            description,
            display_order
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', s.id,
                        'name', s.name,
                        'description', s.description,
                        'icon', s.icon,
                        'display_order', s.display_order
                    )
                    ORDER BY s.display_order
                )
                FROM skills s
                WHERE s.category_id = c.id
            ),
            '[]'::jsonb
        ) AS skills,
        FROM skill_categories c
        ORDER BY display_order ASC 
    `)

    return result.rows;
}

//get one
const findById = async (id: string) => {
    const result = await pool.query(`
        SELECT
            id
            name,
            description,
            display_order
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', s.id,
                        'name', s.name,
                        'description', s.description,
                        'icon', s.icon,
                        'display_order', s.display_order
                    )
                    ORDER BY s.display_order
                )
                FROM skills s
                WHERE s.category_id = c.id
            ),
            '[]'::jsonb
        ) AS skills,
        FROM skill_categories c
        WHERE c.id = $1
        ORDER BY display_order ASC 
    `,[id]);

    return result.rows ?? null;
}

//create
const create = async (data: CreateSkillsData) => {
    const result = await pool.query(`
        INSERT INTO skill_categories (
            name,
            description,
            icon,
            display_order
        )
        VALUES ( 
            $1, $2, $3
        )
    `,[
        data.name,
        data.description,
        data.icon,
        data.display_order
    ]);

    return result.rows ?? null;
}

//update
const update = async (
    id:string,
    data: UpdateSkillsData
) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
            keyof UpdateSkillsData,
            string
        > = {
            name: "name",
            description: "description",
            icon: "icon",
            display_order: "display_order",
        };

    for (const [key, column] of Object.entries(updateableFields)) {
            const value = data[key as keyof UpdateSkillsData];
    
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
            UPDATE skill_categories
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
        DELETE FROM skill_categories
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