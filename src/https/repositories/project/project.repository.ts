import pool from "../../../config/database.js";

import type {
    CreateProjectData,
    UpdateProjectData
} from "../../../types/project/project.js";

//public
//get all
const find_all_public_card = async () => {
    const result = await pool.query(
        `
            SELECT
                p.title,
                p.slug,
                p.short_description,
                p.project_type, 
                p.status,
                p.featured,
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', i.id,
                            'image_url', i.image_url,
                            'alt_text', i.alt_text,
                            'caption', i.caption,
                            'image_type', i.image_type
                        )
                        ORDER BY i.display_order
                    )
                    FROM project_images i
                    WHERE i.project_id = p.id
                    AND i.image_type = 'main'
                ),
                '[]'::json
            ) AS images
            From projects p
            ORDER BY p.display_order ASC
        `
    );

    return result.rows;
}

//get one
const get_one_public = async (slug: string) => {
    const result = await pool.query(
        `
            SELECT
                p.id,
                p.title,
                p.slug,
                p.short_description,
                p.description,
                p.role,
                p.problem,
                p.solution,
                p.project_type,
                p.status,
                p.start_date,
                p.end_date,
                p.featured,
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', s.id,
                            'name', s.name,
                            'icon', s.icon
                        )
                        ORDER BY s.display_order, s.id
                    )
                    FROM project_skills ps
                    INNER JOIN skills s
                        ON s.id = ps.skill_id
                    WHERE ps.project_id = p.id
                ),
                '[]'::json
            ) AS skills,

            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', t.id,
                            'name', t.name,
                            'icon', t.icon
                        )
                        ORDER BY t.display_order, t.id
                    )
                    FROM project_technologies pt
                    INNER JOIN technologies t
                        ON t.id = pt.technology_id
                    WHERE pt.project_id = p.id
                ),
                '[]'::json
            ) AS technologies,

            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', l.id,
                            'link_type', l.link_type,
                            'label', l.label,
                            'url', l.url
                        )
                        ORDER BY l.display_order
                    )
                    FROM project_links l
                    WHERE l.project_id = p.id
                ),
                '[]'::json
            ) AS links,
            
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', i.id,
                            'image_url', i.image_url,
                            'alt_text', i.alt_text,
                            'caption', i.caption,
                            'image_type', i.image_type
                        )
                        ORDER BY i.display_order
                    )
                    FROM project_images i
                    WHERE i.project_id = p.id
                ),
                '[]'::json
            ) AS images,
            
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', f.id,
                            'title', f.title,
                            'description', f.description
                        )
                        ORDER BY f.display_order
                    )
                    FROM project_features f
                    WHERE f.project_id = p.id
                ),
                '[]'::json
            ) AS features,

            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', c.id,
                            'title', c.title,
                            'description', c.description,
                            'solution', c.solution
                        )
                        ORDER BY c.display_order
                    )
                    FROM project_challenges c
                    WHERE c.project_id = p.id
                ),
                '[]'::json
            ) AS challenges
            FROM projects p
            WHERE p.slug = $1
        `,[slug]
    );

    return result.rows[0] ?? null;
}

//Admin
//get all
const find_all_card = async () => {
    const result = await pool.query(
        `
            SELECT
                p.id,
                p.title,
                p.slug,
                p.short_description,
                p.project_type, 
                p.status,
                p.featured,
                display_order,
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', i.id,
                            'image_url', i.image_url,
                            'alt_text', i.alt_text,
                            'caption', i.caption,
                            'image_type', i.image_type
                        )
                        ORDER BY i.display_order
                    )
                    FROM project_images i
                    WHERE i.project_id = p.id
                    AND i.image_type = 'main'
                ),
                '[]'::json
            ) AS images
            From projects p
            ORDER BY p.display_order ASC
        `
    );

    return result.rows;
}

//get one
const getBySlug = async (slug: string) => {
    const result = await pool.query(
        `
            SELECT
                p.id,
                p.title,
                p.slug,
                p.short_description,
                p.description,
                p.role,
                p.problem,
                p.solution,
                p.project_type,
                p.status,
                p.start_date,
                p.end_date,
                p.featured,
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', s.id,
                            'name', s.name,
                            'icon', s.icon,
                            'display_order', s.display_order
                        )
                        ORDER BY s.display_order, s.id
                    )
                    FROM project_skills ps
                    INNER JOIN skills s
                        ON s.id = ps.skill_id
                    WHERE ps.project_id = p.id
                ),
                '[]'::json
            ) AS skills,

            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', t.id,
                            'name', t.name,
                            'icon', t.icon,
                            'display_order', t.display_order
                        )
                        ORDER BY t.display_order, t.id
                    )
                    FROM project_technologies pt
                    INNER JOIN technologies t
                        ON t.id = pt.technology_id
                    WHERE pt.project_id = p.id
                ),
                '[]'::json
            ) AS technologies,

            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', l.id,
                            'link_type', l.link_type,
                            'label', l.label,
                            'url', l.url,
                            'display_order', l.display_order
                        )
                        ORDER BY l.display_order
                    )
                    FROM project_links l
                    WHERE l.project_id = p.id
                ),
                '[]'::json
            ) AS links,
            
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', i.id,
                            'image_url', i.image_url,
                            'alt_text', i.alt_text,
                            'caption', i.caption,
                            'image_type', i.image_type,
                            'display_order', i.display_order
                        )
                        ORDER BY i.display_order
                    )
                    FROM project_images i
                    WHERE i.project_id = p.id
                ),
                '[]'::json
            ) AS images,
            
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', f.id,
                            'title', f.title,
                            'description', f.description,
                            'display_order', f.display_order
                        )
                        ORDER BY f.display_order
                    )
                    FROM project_features f
                    WHERE f.project_id = p.id
                ),
                '[]'::json
            ) AS features,

            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', c.id,
                            'title', c.title,
                            'description', c.description,
                            'solution', c.solution,
                            'display_order', c.display_order
                        )
                        ORDER BY c.display_order
                    )
                    FROM project_challenges c
                    WHERE c.project_id = p.id
                ),
                '[]'::json
            ) AS challenges
            FROM projects p
            WHERE p.slug = $1
        `,[slug]
    );

    return result.rows[0] ?? null;
}

//create
const create = async (data: CreateProjectData) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const projectResult = await client.query(`
            INSERT INTO projects (
                title,
                slug,
                short_description,
                description,
                role,
                problem,
                solution,
                project_type,
                status,
                start_date,
                end_date,
                featured,
                display_order
            )
            VALUES (
                $1, $2, $3, $4,
                $5, $6, $7, $8,
                $9, $10, $11, $12,
                $13
            )
            RETURNING *;
        `, [
            data.title,
            data.slug,
            data.short_description,
            data.description,
            data.role,
            data.problem,
            data.solution,
            data.project_type,
            data.status,
            data.start_date,
            data.end_date,
            data.featured,
            data.display_order
        ]);

        const project = projectResult.rows[0];

        if (data.skills?.length) {
            await client.query(`
                INSERT INTO project_skills (
                    project_id,
                    skill_id
                )
                SELECT $1, unnest($2::uuid[]);
            `, [
                project.id,
                data.skills
            ]);
        }

        if (data.technologies?.length) {
            await client.query(`
                INSERT INTO project_technologies (
                    project_id,
                    technology_id
                )
                SELECT $1, unnest($2::uuid[]);
            `, [
                project.id,
                data.technologies
            ]);
        }

        if (data.links?.length) {
            await client.query(`
                INSERT INTO project_links (
                    project_id,
                    link_type,
                    label,
                    url,
                    display_order
                )
                SELECT
                    $1,
                    link_type,
                    label,
                    url,
                    display_order
                FROM jsonb_to_recordset($2::jsonb)
                AS links(
                    link_type text,
                    label text,
                    url text,
                    display_order integer
                );
            `, [
                project.id,
                JSON.stringify(data.links)
            ]);
        }

        if (data.images?.length) {
            await client.query(`
                INSERT INTO project_images (
                    project_id,
                    image_url,
                    alt_text,
                    caption,
                    image_type,
                    display_order
                )
                SELECT
                    $1,
                    image_url,
                    alt_text,
                    caption,
                    image_type,
                    display_order
                FROM jsonb_to_recordset($2::jsonb)
                AS images(
                    image_url text,
                    alt_text text,
                    caption text,
                    image_type text,
                    display_order integer
                );
            `, [
                project.id,
                JSON.stringify(data.images)
            ]);
        }

        if (data.features?.length) {
            await client.query(`
                INSERT INTO project_features (
                    project_id,
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
                AS features(
                    title text,
                    description text,
                    display_order integer
                );
            `, [
                project.id,
                JSON.stringify(data.features)
            ]);
        }

        if (data.challenges?.length) {
            await client.query(`
                INSERT INTO project_challenges (
                    project_id,
                    title,
                    description,
                    solution,
                    display_order
                )
                SELECT
                    $1,
                    title,
                    description,
                    solution,
                    display_order
                FROM jsonb_to_recordset($2::jsonb)
                AS challenges(
                    title text,
                    description text,
                    solution text,
                    display_order integer
                );
            `, [
                project.id,
                JSON.stringify(data.challenges)
            ]);
        }

        await client.query('COMMIT');

        return project;

    } catch (error) {

        await client.query('ROLLBACK');
        throw error;
    } finally {

        client.release();
    }
};

//update
const update = async (slug: string, data: UpdateProjectData) => {
    
    const fields: string[] = [];
    const values: unknown[] = [];

    const updateableFields: Record<
        keyof UpdateProjectData,
        string
    > = {
        title: "title",
        slug: "slug",
        short_description: "short_description",
        description: "description",
        role: "role",
        problem: "problem",
        solution: "solution",
        project_type: "project_type",
        status: "status",
        start_date: "start_date",
        end_date: "end_date",
        featured: "featured",
        display_order: "display_order",
    };

    for (const [key, column] of Object.entries(updateableFields)) {
        const value = data[key as keyof UpdateProjectData];

        if (value !== undefined) {
            values.push(value);
            fields.push(`${column} = $${values.length}`);
        }
    }

    
    if (fields.length === 0) {
        return null;
    }

        fields.push("updated_at = NOW()");

        values.push(slug);

    const result = await pool.query(
        `
            UPDATE projects
            SET ${fields.join(", ")}
            WHERE slug = $${values.length}
            RETURNING *;
        `,
        values
    );

    return result.rows[0] ?? null;
};

//delete
const remove = async (slug: string) => {
    const result = await pool.query(
        `
            DELETE FROM projects
            WHERE slug = $1
            RETURNING slug
        `,[slug]
    );

    return result.rows[0] ?? null;
}

export default {
    find_all_public_card,
    get_one_public,
    find_all_card,
    getBySlug,
    create,
    update,
    delete: remove
}