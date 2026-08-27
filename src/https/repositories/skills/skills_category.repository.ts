import pool from "../../../config/database.js";

import type {
    CreateSkillsCategoryData,
    UpdateSkillsCategoryData
} from "../../../types/skill_category.js"

//PUBLIC
//GET ALL
const find_all = async () => {
    const result = await pool.query(`
        SELECT
            id,
            name,
            description
        FROM skill_categories
        ORDER BY display_order ASC 
    `)

    return result.rows;
}

//ADMIN
//
//CREATE
const findById = async (id: string) => {
    const result = await pool.query(`
        SELECT
            id,
            name,
            description,
            display_order
        FROM skill_categories
        WHERE id = $1
        ORDER BY display_order ASC
    `,[id]);

    return result.rows ?? null;
};

//create
const create = async (data: CreateSkillsCategoryData) => {

    const skillCategoryResult = await pool.query(`
        INSERT INTO skill_categories (
            name,
            description,
            display_order
        )
        VALUES (
            $1, $2, $3
        )
            RETURNING *;
    `,[
        data.name,
        data.description,
        data.display_order
    ]);
    
    return skillCategoryResult.rows[0];
}

//update
const update = async (
    id: string,
    data: UpdateSkillsCategoryData
) => {

    const fields: string[] = [];
    const values: unknown[] = [];

    const updatableFields: Record<
        keyof UpdateSkillsCategoryData,
        string
    > = {
        name: "name",
        description: "description",
        display_order: "display_order"
    };

    for (const [key, column] of Object.entries(updatableFields)) {
        const value = data[key as keyof UpdateSkillsCategoryData];

        if(value !== undefined) {
            values.push(value);
            fields.push(`${column} = $${values.length}`);
        }
    }

    if (fields.length === 0) {
        return null;
    }

    fields.push(`updated_at = NOW()`);

    fields.push(id);

    const result = await pool.query(`
        UPDATE skill_categories
        SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING *
    `, values);

    return result.rows[0] ?? null;
};

//delete
const remove = async (id: string) => {
    const result = await pool.query(`
        DELETE FROM skill_categories
        WHERE id = $1
        RETURNING id
    `, [id]);

    return result.rows[0] ?? null;
};

export default {
    find_all,
    findById,
    create,
    update,
    delete: remove
}