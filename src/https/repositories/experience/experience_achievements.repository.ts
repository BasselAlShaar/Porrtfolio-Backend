import pool from "../../../config/database.js";

import type {
    CreateExperienceAchievementsData,
    UpdateExperienceAchievementsData
} from "../../../types/experience/experience_achievemnts.js";

//admin
//get all
const find_all = async (id: string) => {
    const result = await pool.query(
        `
            SELECT
                title,
                description,
                display_order
            FROM experience_achievements
            WHERE experience_id = $1
        `,[id]
    )

    return result.rows;
}

//const get one
const getById = async (id: string) => {
    const result = await pool.query(
        `
            SELECT
                experience_id,
                title,
                description,
                display_order
            FROM experience_achievements
            WHERE id = $1
        `,[id]
    );

    return result.rows[0] ?? null;
}

//create
const create = async (data: CreateExperienceAchievementsData) => {
    const result = await pool.query(
        `
        INSERT INTO experience_achievements  (
            experience_id,
            title,
            description,
            display_order
        )
        VALUES (
            $1, $2, $3, $4
        )
        Returning *
        `,[
            data.experience_id,
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
    data: UpdateExperienceAchievementsData
) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
            keyof UpdateExperienceAchievementsData,
            string
        > = {
            title: "title",
            description: "description",
            display_order: "display_order",
        };

    for (const [key, column] of Object.entries(updateableFields)) {
            const value = data[key as keyof UpdateExperienceAchievementsData];
    
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
            UPDATE experience_achievements
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
            DELETE FROM experience_achievements
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