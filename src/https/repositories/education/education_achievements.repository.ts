import pool from "../../../config/database.js";

import type {
    CreateEducationAchievementsData,
    UpdateEducationAchievementsData
} from "../../../types/education_achievements.js";

//admin
//get all
const find_all = async (id: string) => {
    const result = await pool.query(
        `
            SELECT
                title,
                description,
                display_order
            FROM education_achievements
            WHERE education_id = $1
        `,[id]
    )

    return result.rows;
}

//const get one
const getById = async (id: string) => {
    const result = await pool.query(
        `
            SELECT
                education_id,
                title,
                description,
                display_order
            FROM education_achievements
            WHERE id = $1
        `,[id]
    );

    return result.rows[0] ?? null;
}

//create
const create = async (data: CreateEducationAchievementsData) => {
    const result = await pool.query(
        `
        INSERT INTO education_achievements  (
            education_id,
            title,
            description,
            display_order
        )
        VALUES (
            $1, $2, $3, $4
        )
        Returning *
        `,[
            data.education_id,
            data.title,
            data.description,
            data.display_order
        ]
    )

    return result.rows ?? null;
}

//update
const update = async (
    id: string,
    data: UpdateEducationAchievementsData
) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
            keyof UpdateEducationAchievementsData,
            string
        > = {
            title: "title",
            description: "description",
            display_order: "display_order",
        };

    for (const [key, column] of Object.entries(updateableFields)) {
            const value = data[key as keyof UpdateEducationAchievementsData];
    
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
            UPDATE education_achievements
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
            DELETE FROM education_achievements
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