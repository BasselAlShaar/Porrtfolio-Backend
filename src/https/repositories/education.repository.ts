// ================================================================
//    EDUCATION REPOSITORY
// ================================================================
//
// Handles all direct database operations for education records.
//
// This is the layer that actually talks to PostgreSQL:
//
//     Controller → Service → Repository → PostgreSQL
//
// No business rules should live here.
// The service decides whether the data makes sense;
// this layer decides how to store and retrieve it.
//
// SQL lives here so the rest of the application doesn't have to
// know what PostgreSQL is cooking.
//
// ! Message to future me:
// ! Update this code to get show everything with their respective details
// ================================================================
import pool from "../../config/database.js";

import type {
    CreateEducationData,
    UpdateEducationData,
} from "../../types/education.js";

const findAll = async () => {
    const result = await pool.query(
        `
        SELECT
            id,
            institution_name,
            institution_url,
            degree,
            field_of_study,
            description,
            location,
            start_date,
            end_date,
            is_current,
            display_order,
            created_at,
            updated_at
        FROM education
        ORDER BY display_order ASC, start_date DESC;
        `
    );

    return result.rows;
};

const findById = async (id: string) => {
    const result = await pool.query(
        `
        SELECT
            id,
            institution_name,
            institution_url,
            degree,
            field_of_study,
            description,
            location,
            start_date,
            end_date,
            is_current,
            display_order,
            created_at,
            updated_at
        FROM education
        WHERE id = $1;
        `,
        [id]
    );

    return result.rows[0] ?? null;
};

const create = async (data: CreateEducationData) => {
    const result = await pool.query(
        `
        INSERT INTO education (
            institution_name,
            institution_url,
            degree,
            field_of_study,
            description,
            location,
            start_date,
            end_date,
            is_current,
            display_order
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10
        )
        RETURNING
            id,
            institution_name,
            institution_url,
            degree,
            field_of_study,
            description,
            location,
            start_date,
            end_date,
            is_current,
            display_order,
            created_at,
            updated_at;
        `,
        [
            data.institution_name,
            data.institution_url ?? null,
            data.degree,
            data.field_of_study ?? null,
            data.description ?? null,
            data.location ?? null,
            data.start_date,
            data.end_date ?? null,
            data.is_current,
            data.display_order,
        ]
    );

    return result.rows[0];
};

const update = async (
    id: string,
    data: UpdateEducationData
) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.institution_name !== undefined) {
        fields.push(`institution_name = $${values.length + 1}`);
        values.push(data.institution_name);
    }

    if (data.institution_url !== undefined) {
        fields.push(`institution_url = $${values.length + 1}`);
        values.push(data.institution_url);
    }

    if (data.degree !== undefined) {
        fields.push(`degree = $${values.length + 1}`);
        values.push(data.degree);
    }

    if (data.field_of_study !== undefined) {
        fields.push(`field_of_study = $${values.length + 1}`);
        values.push(data.field_of_study);
    }

    if (data.description !== undefined) {
        fields.push(`description = $${values.length + 1}`);
        values.push(data.description);
    }

    if (data.location !== undefined) {
        fields.push(`location = $${values.length + 1}`);
        values.push(data.location);
    }

    if (data.start_date !== undefined) {
        fields.push(`start_date = $${values.length + 1}`);
        values.push(data.start_date);
    }

    if (data.end_date !== undefined) {
        fields.push(`end_date = $${values.length + 1}`);
        values.push(data.end_date);
    }

    if (data.is_current !== undefined) {
        fields.push(`is_current = $${values.length + 1}`);
        values.push(data.is_current);
    }

    if (data.display_order !== undefined) {
        fields.push(`display_order = $${values.length + 1}`);
        values.push(data.display_order);
    }

    if (fields.length === 0) {
        return null;
    }

    fields.push(`updated_at = NOW()`);

    values.push(id);

    const result = await pool.query(
        `
        UPDATE education
        SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING
            id,
            institution_name,
            institution_url,
            degree,
            field_of_study,
            description,
            location,
            start_date,
            end_date,
            is_current,
            display_order,
            created_at,
            updated_at;
        `,
        values
    );

    return result.rows[0] ?? null;
};

const remove = async (id: string) => {
    const result = await pool.query(
        `
        DELETE FROM education
        WHERE id = $1
        RETURNING id;
        `,
        [id]
    );

    return result.rows[0] ?? null;
};

export default {
    findAll,
    findById,
    create,
    update,
    delete: remove,
};