import pool from "../../../config/database.js";

//public
//get all
const find_all_public = async () => {
    const result = await pool.query(`
        SELECT
            name,
            description
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'title', s.title,
                        'description', s.description,
                        'icon', s.icon
                    )
                    ORDER BY s.display_order
                )
                FROM skills s
                WHERE s.category_id = c.id
            ),
            '[]'::jsonb
        ) AS skills,
        FROM skill_categories c
        ORDER BY display_order ASC 
    `)

    return result.rows;
}

//admin
