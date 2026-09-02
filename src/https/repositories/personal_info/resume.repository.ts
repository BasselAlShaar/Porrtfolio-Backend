import pool from '../../../config/database.js';

import type {
    CreateResumeData,
    UpdateResumeData
} from '../../../types/personal_info/resume.js';

//get public
const getPublicResume = async () => {
    const result = await pool.query(
        `
            SELECT
                title,
                file_url,
                file_name,
            FROM resumes
            WHERE is_active = true
        `
    );

    return result.rows[0] ?? null;
};

//admin
//get all
const find_all = async () => {
    const result = await pool.query(
        `
            SELECT
                id,
                title,
                file_url,
                file_name,
                version,
                is_active,
                display_order
            FROM resumes
            ORDER BY display_order ASC
        `
    );

    return result.rows;
};

//get one
const getById = async (id: string) => {
    const result = await pool.query(
        `
            SELECT
                id,
                title,
                file_url,
                file_name,
                version,
                is_active,
                display_order
            FROM resumes
            WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] ?? null;
};

//create
const create = async (data: CreateResumeData) => {
    const result = await pool.query(
        `
            INSERT INTO resumes (
                title,
                file_url,
                file_name,
                version,
                is_active,
                display_order
            )
            VALUES (
                $1, $2, $3,
                $4, $5, $6
            )
            RETURNING *
        `,
        [
            data.title,
            data.file_url,
            data.file_name,
            data.version,
            data.is_active,
            data.display_order
        ]
    );

    return result.rows[0] ?? null;
};

//update
const update = async (
    id: string,
    data: UpdateResumeData
) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
            keyof UpdateResumeData,
            string
        > = {
            title: "title",
            file_url: "file_url",
            file_name: "file_name",
            version: "version",
            is_active: "is_active",
            display_order: "display_order"
        };

    for (const [key, column] of Object.entries(updateableFields)) {
            const value = data[key as keyof UpdateResumeData];
    
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
            UPDATE resumes
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
            DELETE FROM resumes
            WHERE id = $1
            RETURNING *;
        `,
        [id]
    );

    return result.rows[0] ?? null;
};

export default {
    getPublicResume,
    find_all,
    getById,
    create,
    update,
    remove
};