import pool from "../../config/database.js";

import type {
    CreateExperienceData,
    UpdateExperienceData,
} from "../../types/experience.js";

const findAll = async () => {
    const result = await pool.query(` SELECT * FROM experience ORDER BY display_order ASC, start_date DESC; `);

    return result.rows;
};

const findById = async (id: string) => {
    const result = await pool.query(`
        SELECT *
        FROM experience
        WHERE id = $1;
    `, [id]);

    return result.rows[0] ?? null;
};

const create = async (data: CreateExperienceData) => {
    const result = await pool.query(`
        INSERT INTO experience (
            company_name,
            company_url,
            position,
            employment_type,
            location,
            description,
            start_date,
            end_date,
            is_current,
            display_order
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        ) RETURNING *;
    `, [
        data.company_name,
        data.company_url,
        data.position,
        data.employment_type,
        data.location,
        data.description,
        data.start_date,
        data.end_date,
        data.is_current,
        data.display_order
    ]);

    return result.rows[0];
};

const update = async (id: string, data: UpdateExperienceData) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.company_name !== undefined) {
        fields.push("company_name = $1");
        values.push(data.company_name);
    }
    if (data.company_url !== undefined) {
        fields.push("company_url = $2");
        values.push(data.company_url);
    }
    if (data.position !== undefined) {
        fields.push("position = $3");
        values.push(data.position);
    }
    if (data.employment_type !== undefined) {
        fields.push("employment_type = $4");
        values.push(data.employment_type);
    }
    if (data.location !== undefined) {
        fields.push("location = $5");
        values.push(data.location);
    }
    if (data.description !== undefined) {
        fields.push("description = $6");
        values.push(data.description);
    }
    if (data.start_date !== undefined) {
        fields.push("start_date = $7");
        values.push(data.start_date);
    }
    if (data.end_date !== undefined) {
        fields.push("end_date = $8");
        values.push(data.end_date);
    }
    if (data.is_current !== undefined) {
        fields.push("is_current = $9");
        values.push(data.is_current);
    }
    if (data.display_order !== undefined) {
        fields.push("display_order = $10");
        values.push(data.display_order);
    }

    if (fields.length === 0) {
        return null;
    }

    fields.push(`updated_at = NOW()`);

    values.push(id);

    const result = await pool.query(`
        UPDATE experience
        SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING *;
    `, values);

    return result.rows[0] ?? null;
};

const remove = async (id: string) => {
    const result = await pool.query(`
        DELETE FROM experience
        WHERE id = $1
        RETURNING id;
    `, [id]);

    return result.rows[0] ?? null;
};

export default {
    findAll,
    findById,
    create,
    update,
    remove
};