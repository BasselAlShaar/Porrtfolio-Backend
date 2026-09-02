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
import pool from "../../../config/database.js";

import type {
    CreateEducationData,
    UpdateEducationData,
} from "../../../types/education/education.js";

// PUBLIC
// Get All
//* Refactored
const findAll = async () => {
    const result = await pool.query(
        `
        SELECT
            e.id,
            e.institution_name AS institutionName,
            e.institution_url AS institutionUrl,
            e.degree,
            e.field_of_study AS fieldOfStudy,
            e.description,
            e.location,
            e.start_date AS startDate,
            e.end_date AS endDate,
            e.is_current AS isCurrent,

        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', a.id,
                        'title', a.title,
                        'description', a.description
                    )
                    ORDER BY a.display_order, a.id
                )
                FROM education_achievements a
                WHERE a.education_id = e.id
            ),
            '[]'::jsonb
        ) AS achievements
        FROM education e
        ORDER BY display_order ASC, start_date DESC;
        `
    );

    return result.rows;
};

// 
//   ADMIN
//

// Find by id
//* Updated
const findById = async (id: string) => {
    const result = await pool.query(
        `
        SELECT
            e.id,
            e.institution_name,
            e.institution_url,
            e.degree,
            e.field_of_study,
            e.description,
            e.location,
            e.start_date,
            e.end_date,
            e.is_current,
            e.display_order,
        
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', ea.id,
                        'title', ea.title,
                        'description', ea.description,
                        'displayOrder', ea.display_order
                    )
                    ORDER BY ea.display_order
                )
                FROM education_achievements ea
                WHERE ea.education_id = e.id
            ),
            '[]'::jsonb
        ) AS achievements
        FROM education e
        WHERE id = $1;
        `,
        [id]
    );

    return result.rows[0] ?? null;
};

// Create
//* Updated
const create = async (data: CreateEducationData) => {
    const client = await pool.connect();

    try {

        //Start
        await client.query('BEGIN');

        //queries
        const educationResult = await client.query(`
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
            RETURNING *;
        `, [
            data.institution_name,
            data.institution_url ?? null,
            data.degree,
            data.field_of_study ?? null,
            data.description ?? null,
            data.location ?? null,
            data.start_date,
            data.end_date ?? null,
            data.is_current,
            data.display_order
        ])

        const education = educationResult.rows[0];

        if (data.achievements?.length) {
            await client.query(`
                INSERT INTO education_achievements (
                    education_id,
                    title,
                    description,
                    display_order
                )
                SELECT
                    $1,
                    title,
                    description,
                    display_order
                FROM jsonb_to_recordset($2::jsonb)
                AS achievements(
                    title text,
                    description text,
                    display_order integer
                );
            `, [
                education.id,
                JSON.stringify(data.achievements)
            ]);
        }

        //Commit

        await client.query('COMMIT');

        return education;

    } catch (error) {

        await client.query('ROLLBACK');
        throw error;
    } finally {

        client.release();
    }
};

// Update
//* Updated
const update = async (
    id: string,
    data: UpdateEducationData
) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
            keyof UpdateEducationData,
            string
        > = {
            institution_name: "institution_name",
            institution_url: "institution_url",
            degree: "degree",
            field_of_study: "field_of_study",
            description: "description",
            location: "location",
            start_date: "start_date",
            end_date: "end_date",
            is_current: "is_current",
            display_order: "display_order",
        };

    for (const [key, column] of Object.entries(updateableFields)) {
            const value = data[key as keyof UpdateEducationData];
    
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
            UPDATE education
            SET ${fields.join(", ")}
            WHERE id = $${values.length}
            RETURNING *;
        `,
        values
    );

    return result.rows[0] ?? null;
};

//Delete
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