import pool from "../../../config/database.js";

import type {
    CreateTechnologiesCategoryData,
    UpdateTechnologiesCategoryData
} from "../../../types//technologies/technologies_category.js"

//PUBLIC
//GET ALL
const find_all_public = async () => {
    const result = await pool.query(`
        SELECT
            id,
            name,
            description
        FROM technology_categories
        ORDER BY display_order ASC 
    `)

    return result.rows;
}

//ADMIN
//get all
const find_all = async () => {
    const result = await pool.query(`
        SELECT
            id,
            name,
            description,
            display_order
        FROM technology_categories
        ORDER BY display_order ASC 
    `)

    return result.rows;
}

//get one
const findById = async (id: string) => {
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
                            'icon', s.icon
                        )
                        ORDER BY s.display_order ASC
                    )
                    FROM technologies s
                    WHERE c.id = s.category_id
                ),
                '[]'::json
            ) AS technologies
        FROM technology_categories c
        WHERE id = $1
        ORDER BY display_order ASC
    `,[id]);

    return result.rows ?? null;
};

//create
const create = async (data: CreateTechnologiesCategoryData) => {

    const technologyCategoryResult = await pool.query(`
        INSERT INTO technology_categories (
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
    
    return technologyCategoryResult.rows[0];
}

//update
const update = async (
    id: string,
    data: UpdateTechnologiesCategoryData
) => {

    const fields: string[] = [];
    const values: unknown[] = [];

    const updatableFields: Record<
        keyof UpdateTechnologiesCategoryData,
        string
    > = {
        name: "name",
        description: "description",
        display_order: "display_order"
    };

    for (const [key, column] of Object.entries(updatableFields)) {
        const value = data[key as keyof UpdateTechnologiesCategoryData];

        if(value !== undefined) {
            values.push(value);
            fields.push(`${column} = $${values.length}`);
        }
    }

    if (fields.length === 0) {
        return null;
    }

    fields.push(`updated_at = NOW()`);

    values.push(id);

    const result = await pool.query(`
        UPDATE technology_categories
        SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING *
    `, values);

    return result.rows[0] ?? null;
};

//delete
const remove = async (id: string) => {

    const result = await pool.query(`
        DELETE FROM technology_categories
        WHERE id = $1
        RETURNING id
    `, [id]);

    return result.rows[0] ?? null;
};

//count Technologies in given category
const countTechnologies = async (id: string) => {
    const result = await pool.query(`
        SELECT COUNT(*)::int AS count
        FROM technologies
        WHERE category_id = $1
    `, [id]);

    return result.rows[0].count;
};

export default {
    find_all_public,
    find_all,
    findById,
    create,
    update,
    delete: remove,
    countTechnologies
}