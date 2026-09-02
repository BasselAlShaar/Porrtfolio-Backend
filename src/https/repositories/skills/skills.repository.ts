import pool from "../../../config/database.js";
import type {
    CreateSkillsData,
    UpdateSkillsData
} from "../../../types/skills/skills.js";

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
                    FROM skills s
                    WHERE s.category_id = c.id
                ),
                '[]'::json
            ) AS skills
        FROM skill_categories c
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
                FROM skills s
                WHERE s.category_id = c.id
            ),
            '[]'::json
        ) AS skills
        FROM skill_categories c
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
                    FROM skill_categories sc
                    WHERE s.category_id = sc.id
                ),
                '[]'::json
            ) AS skill_category
        FROM skills s
        WHERE s.id = $1;
    `, [id]);

    return result.rows[0] ?? null;
};

//create
const create = async (data: CreateSkillsData) => {
    const result = await pool.query(`
        INSERT INTO skills (
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
    data: UpdateSkillsData
) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
            keyof UpdateSkillsData,
            string
        > = {
            name: "name",
            category_id: "category_id",
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
            UPDATE skills
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
        DELETE FROM skills
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