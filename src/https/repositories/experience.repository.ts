import pool from "../../config/database.js";

import type {
    UpdateExperienceData,
    CreateExperienceData
} from "../../types/experience.js";

// ================================================================
//    EXPERIENCE REPOSITORY
// ================================================================
//
// This file talks directly to PostgreSQL.
//
// Controllers ask.
// Services think.
// Repositories suffer.
//
// Responsibilities:
//   - Fetch experiences
//   - Create experiences
//   - Update experiences
//   - Delete experiences
//   - Perform approximately 400 SQL operations disguised as one API
//
// If something goes wrong here, check the SQL.
// If the SQL looks correct, check the SQL again.
//
// ================================================================


//--------------------------------------------------------------
// PUBLIC
//--------------------------------------------------------------

// Get all experiences with their glorious collection of details.
//
// Because apparently returning just:
//
//     company_name
//     position
//
// wasn't enough.
//
// We also need:
//     responsibilities
//     achievements
//     skills
//     technologies
//
// All bundled together so the frontend can stop making
// 17 requests just to render one experience card.

const findAll = async () => {
    const result = await pool.query(
        ` SELECT
            e.id,
            e.company_name AS "companyName",
            e.company_url AS "companyUrl",
            e.position,
            e.employment_type AS "employmentType",
            e.location,
            e.description,
            e.start_date AS "startDate",
            e.end_date AS "endDate",
            e.is_current AS "isCurrent",

        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', r.id,
                        'description', r.description
                    )
                    ORDER BY r.display_order, r.id
                )
                FROM experience_responsibilities r
                WHERE r.experience_id = e.id
            ),
            '[]'::jsonb
        ) AS responsibilities,

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
                FROM experience_achievements a
                WHERE a.experience_id = e.id
            ),
            '[]'::jsonb
        ) AS achievements,

        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', s.id,
                        'name', s.name,
                        'icon', s.icon
                    )
                    ORDER BY s.display_order, s.id
                )
                FROM experience_skills es
                INNER JOIN skills s
                    ON s.id = es.skill_id
                WHERE es.experience_id = e.id
            ),
            '[]'::jsonb
        ) AS skills,

        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', t.id,
                        'name', t.name,
                        'icon', t.icon
                    )
                    ORDER BY t.display_order, t.id
                )
                FROM experience_technologies et
                INNER JOIN technologies t
                    ON t.id = et.technology_id
                WHERE et.experience_id = e.id
            ),
            '[]'::jsonb
        ) AS technologies

        FROM experience e
        ORDER BY e.display_order, e.start_date DESC;`
    );

    // If this returns an empty array:
    // congratulations, the API is working perfectly.
    // Your portfolio just has nothing to show.

    return result.rows;
};

//--------------------------------------------------------------
// ADMIN
//--------------------------------------------------------------

// Get one experience.
//
// Admin gets the VIP version:
// display_order, IDs, and all the details.
//
// TODO: Keep this query in sync with findAll.
//
// Yes, there are two queries.
// Yes, future me will probably complain about this.
//
// Future me: you're welcome.

const findById = async (id: string) => {
    const result = await pool.query(`
        SELECT
            e.id,
            e.company_name,
            e.company_url,
            e.position,
            e.employment_type,
            e.location,
            e.description,
            e.start_date,
            e.end_date,
            e.is_current,
            e.display_order,

            COALESCE(
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'id', s.id,
                            'name', s.name
                        )
                        ORDER BY s.name
                    )
                    FROM experience_skills es
                    INNER JOIN skills s
                        ON s.id = es.skill_id
                    WHERE es.experience_id = e.id
                ),
                '[]'::jsonb
            ) AS skills,

            COALESCE(
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'id', t.id,
                            'name', t.name
                        )
                        ORDER BY t.name
                    )
                    FROM experience_technologies et
                    INNER JOIN technologies t
                        ON t.id = et.technology_id
                    WHERE et.experience_id = e.id
                ),
                '[]'::jsonb
            ) AS technologies,

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
                    FROM experience_achievements ea
                    WHERE ea.experience_id = e.id
                ),
                '[]'::jsonb
            ) AS achievements,

            COALESCE(
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'id', er.id,
                            'description', er.description,
                            'displayOrder', er.display_order
                        )
                        ORDER BY er.display_order
                    )
                    FROM experience_responsibilities er
                    WHERE er.experience_id = e.id
                ),
                '[]'::jsonb
            ) AS responsibilities

        FROM experience e
        WHERE e.id = $1;
    `, [id]);

    return result.rows[0] ?? null;
};

// ================================================================
//    CREATE EXPERIENCE
// ================================================================
//
// This operation touches multiple tables.
//
// Therefore:
//
// BEGIN
//   ↓
// Create experience
//   ↓
// Attach skills
//   ↓
// Attach technologies
//   ↓
// Add achievements
//   ↓
// Add responsibilities
//   ↓
// COMMIT
//
// If ANYTHING explodes:
//
// ROLLBACK
//
// PostgreSQL: "We pretend none of it happened."
//
// ================================================================

const create = async (data: CreateExperienceData) => {
    // We need one dedicated connection because this is a transaction.
    //
    // DO NOT use pool.query() for individual statements here.
    // All queries must run on the SAME client.
    const client = await pool.connect();

    try {
        // Start the transaction.
        //
        // This is where PostgreSQL starts keeping receipts.
        await client.query('BEGIN');

        // ---------------------------------------------------------
        // 1. Create the main experience
        // ---------------------------------------------------------
        const experienceResult = await client.query(`
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
            )
            VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10
            )
            RETURNING *;
        `, [
            data.company_name,
            data.company_url ?? null,
            data.position,
            data.employment_type ?? null,
            data.location ?? null,
            data.description ?? null,
            data.start_date,
            data.end_date ?? null,
            data.is_current,
            data.display_order
        ]);

        const experience = experienceResult.rows[0];

        // ---------------------------------------------------------
        // 2. Attach skills
        // ---------------------------------------------------------
        //
        // No skills?
        // No problem.
        //
        // We simply pretend this person is mysterious.
        if (data.skill_ids?.length) {
            await client.query(`
                INSERT INTO experience_skills (
                    experience_id,
                    skill_id
                )
                SELECT $1, unnest($2::uuid[]);
            `, [
                experience.id,
                data.skill_ids
            ]);
        }

        // ---------------------------------------------------------
        // 3. Attach technologies
        // ---------------------------------------------------------
        //
        // Same concept.
        //
        // More technologies = more impressive portfolio.
        // Probably.
        if (data.technology_ids?.length) {
            await client.query(`
                INSERT INTO experience_technologies (
                    experience_id,
                    technology_id
                )
                SELECT $1, unnest($2::uuid[]);
            `, [
                experience.id,
                data.technology_ids
            ]);
        }

        // ---------------------------------------------------------
        // 4. Insert achievements
        // ---------------------------------------------------------
        //
        // PostgreSQL is now doing JSON parsing.
        //
        // Because obviously we couldn't just insert them normally.
        if (data.achievements?.length) {
            await client.query(`
                INSERT INTO experience_achievements (
                    experience_id,
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
                experience.id,
                JSON.stringify(data.achievements)
            ]);
        }

        // ---------------------------------------------------------
        // 5. Insert responsibilities
        // ---------------------------------------------------------
        //
        // "What did you actually do?"
        //
        // The database will now answer that question.
        if (data.responsibilities?.length) {
            await client.query(`
                INSERT INTO experience_responsibilities (
                    experience_id,
                    description,
                    display_order
                )
                SELECT
                    $1,
                    description,
                    display_order
                FROM jsonb_to_recordset($2::jsonb)
                AS responsibilities(
                    description text,
                    display_order integer
                );
            `, [
                experience.id,
                JSON.stringify(data.responsibilities)
            ]);
        }

        // Everything survived.
        //
        // Release the transaction into the wild.

        await client.query('COMMIT');

        return experience;

    } catch (error) {
        // Something went wrong.
        //
        // Delete all evidence.
        // Nobody saw anything.
        await client.query('ROLLBACK');
        throw error;
    } finally {
        // Give the connection back to the pool.
        //
        // We don't keep database connections hostage here.
        client.release();
    }
};

// ================================================================
//    UPDATE EXPERIENCE
// ================================================================
//
// Dynamic UPDATE query.
//
// Why?
// Because sending:
//
//     UPDATE experience SET everything = everything
//
// every time would be a little ridiculous.
//
// Only fields that actually exist in `data` get updated.
//
// ================================================================

const update = async (id: string, data: UpdateExperienceData) => {
    // ---------------------------------------------------------
    //    DYNAMIC UPDATE
    // ---------------------------------------------------------
    //
    // Only update fields that were actually provided.
    //
    // We intentionally generate parameter placeholders dynamically
    // instead of hardcoding $1, $2, $3...
    //
    // Future me:
    // You are welcome.
    // ---------------------------------------------------------

    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
        keyof UpdateExperienceData,
        string
    > = {
        company_name: "company_name",
        company_url: "company_url",
        position: "position",
        employment_type: "employment_type",
        location: "location",
        description: "description",
        start_date: "start_date",
        end_date: "end_date",
        is_current: "is_current",
        display_order: "display_order",
    };

    for (const [key, column] of Object.entries(updateableFields)) {
        const value = data[key as keyof UpdateExperienceData];

        if (value !== undefined) {
            values.push(value);
            fields.push(`${column} = $${values.length}`);
        }
    }

    // Nothing was provided to update.
    //
    // No need to bother PostgreSQL with:
    // UPDATE experience SET absolutely_nothing = nothing
    if (fields.length === 0) {
        return null;
    }

    // Keep track of when the record was modified.
    fields.push("updated_at = NOW()");

    // The experience ID is always the final parameter.
    values.push(id);

    const result = await pool.query(
        `
            UPDATE experience
            SET ${fields.join(", ")}
            WHERE id = $${values.length}
            RETURNING *;
        `,
        values
    );

    return result.rows[0] ?? null;
};

// ================================================================
//    DELETE EXPERIENCE
// ================================================================
//
// One DELETE.
//
// Many memories.
//
// Hopefully the foreign keys are configured correctly,
// otherwise PostgreSQL is about to have opinions.
// ================================================================

const remove = async (id: string) => {
    const result = await pool.query(`
        DELETE FROM experience
        WHERE id = $1
        RETURNING id;
    `, [id]);

    // If we got an ID back:
    // it died successfully.
    //
    // If null:
    // it was already gone.
    return result.rows[0] ?? null;
};

// ================================================================
//    EXPORT REPOSITORY
// ================================================================
//
// Everything the outside world is allowed to know about.
//
// `delete` is kept as an alias for `remove` because sometimes
// naming things consistently is less important than keeping
// TypeScript happy.
//
// ================================================================
export default {
    findAll,
    findById,
    create,
    update,
    remove,

    // Yes, JavaScript lets us do this.
    // No, we're not going to explain why.
    delete: remove
};