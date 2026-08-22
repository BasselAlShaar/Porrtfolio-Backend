import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`-- ============================================================
-- PORTFOLIO DATABASE
-- PostgreSQL
-- ============================================================


-- ============================================================
-- 1. PERSONAL INFORMATION
-- ============================================================

CREATE TABLE personal_info (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name           text NOT NULL,
    professional_title  text NOT NULL,
    short_bio           text,
    bio                 text,
    profile_image_url   text,
    location            text,
    email               text,
    phone               text,
    availability_status text,
    availability_text   text,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 2. SOCIAL LINKS
-- ============================================================

CREATE TABLE social_links (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_info_id  uuid NOT NULL,
    platform          text NOT NULL,
    label             text,
    url               text NOT NULL,
    icon              text,
    display_order     integer NOT NULL DEFAULT 0,
    is_visible        boolean NOT NULL DEFAULT true,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT social_links_display_order_check
        CHECK (display_order >= 0),

    CONSTRAINT social_links_person_platform_unique
        UNIQUE (personal_info_id, platform),

    CONSTRAINT social_links_personal_info_fk
        FOREIGN KEY (personal_info_id)
        REFERENCES personal_info(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 3. RESUMES
-- ============================================================

CREATE TABLE resumes (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_info_id  uuid NOT NULL,
    title             text NOT NULL,
    file_url          text NOT NULL,
    file_name         text,
    version           text,
    is_active         boolean NOT NULL DEFAULT false,
    display_order     integer NOT NULL DEFAULT 0,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT resumes_display_order_check
        CHECK (display_order >= 0),

    CONSTRAINT resumes_personal_info_fk
        FOREIGN KEY (personal_info_id)
        REFERENCES personal_info(id)
        ON DELETE CASCADE
);


-- Only one active resume per portfolio owner.
CREATE UNIQUE INDEX resumes_one_active_per_owner_idx
    ON resumes (personal_info_id)
    WHERE is_active = true;


-- ============================================================
-- 4. PROJECTS
-- ============================================================

CREATE TABLE projects (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title              text NOT NULL,
    slug               text NOT NULL UNIQUE,
    short_description  text NOT NULL,
    description        text,
    role               text,
    problem            text,
    solution           text,
    goals              text,
    project_type       text,
    status             text NOT NULL,
    start_date         date,
    end_date           date,
    featured           boolean NOT NULL DEFAULT false,
    display_order      integer NOT NULL DEFAULT 0,
    created_at         timestamptz NOT NULL DEFAULT now(),
    updated_at         timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT projects_status_check
        CHECK (
            status IN (
                'completed',
                'in_progress',
                'archived'
            )
        ),

    CONSTRAINT projects_project_type_check
        CHECK (
            project_type IS NULL
            OR project_type IN (
                'personal',
                'academic',
                'professional',
                'freelance',
                'open_source',
                'game',
                'other'
            )
        ),

    CONSTRAINT projects_dates_check
        CHECK (
            end_date IS NULL
            OR start_date IS NULL
            OR end_date >= start_date
        ),

    CONSTRAINT projects_display_order_check
        CHECK (display_order >= 0)
);


-- ============================================================
-- 5. PROJECT FEATURES
-- ============================================================

CREATE TABLE project_features (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id     uuid NOT NULL,
    title          text NOT NULL,
    description    text,
    display_order  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT project_features_display_order_check
        CHECK (display_order >= 0),

    CONSTRAINT project_features_project_fk
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 6. PROJECT CHALLENGES
-- ============================================================

CREATE TABLE project_challenges (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id     uuid NOT NULL,
    title          text NOT NULL,
    description    text,
    solution       text,
    display_order  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT project_challenges_display_order_check
        CHECK (display_order >= 0),

    CONSTRAINT project_challenges_project_fk
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 7. PROJECT IMAGES
-- ============================================================

CREATE TABLE project_images (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id     uuid NOT NULL,
    image_url      text NOT NULL,
    alt_text       text,
    caption        text,
    image_type     text,
    display_order  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT project_images_display_order_check
        CHECK (display_order >= 0),

    CONSTRAINT project_images_project_fk
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 8. PROJECT LINKS
-- ============================================================

CREATE TABLE project_links (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id     uuid NOT NULL,
    link_type      text NOT NULL,
    label          text,
    url            text NOT NULL,
    display_order  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT project_links_type_check
        CHECK (
            link_type IN (
                'github',
                'live_demo',
                'documentation',
                'figma',
                'itch_io',
                'app_store',
                'play_store',
                'other'
            )
        ),

    CONSTRAINT project_links_display_order_check
        CHECK (display_order >= 0),

    CONSTRAINT project_links_project_fk
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 9. SKILL CATEGORIES
-- ============================================================

CREATE TABLE skill_categories (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name           text NOT NULL UNIQUE,
    description    text,
    display_order  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT skill_categories_display_order_check
        CHECK (display_order >= 0)
);


-- ============================================================
-- 10. SKILLS
-- ============================================================

CREATE TABLE skills (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id    uuid NOT NULL,
    name           text NOT NULL,
    description    text,
    icon           text,
    display_order  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT skills_display_order_check
        CHECK (display_order >= 0),

    CONSTRAINT skills_category_name_unique
        UNIQUE (category_id, name),

    CONSTRAINT skills_category_fk
        FOREIGN KEY (category_id)
        REFERENCES skill_categories(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- 11. PROJECT <-> SKILLS
-- ============================================================

CREATE TABLE project_skills (
    project_id  uuid NOT NULL,
    skill_id    uuid NOT NULL,

    CONSTRAINT project_skills_pk
        PRIMARY KEY (project_id, skill_id),

    CONSTRAINT project_skills_project_fk
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT project_skills_skill_fk
        FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- 12. TECHNOLOGY CATEGORIES
-- ============================================================

CREATE TABLE technology_categories (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name           text NOT NULL UNIQUE,
    description    text,
    display_order  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT technology_categories_display_order_check
        CHECK (display_order >= 0)
);


-- ============================================================
-- 13. TECHNOLOGIES
-- ============================================================

CREATE TABLE technologies (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id    uuid NOT NULL,
    name           text NOT NULL,
    description    text,
    icon           text,
    display_order  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT technologies_display_order_check
        CHECK (display_order >= 0),

    CONSTRAINT technologies_category_name_unique
        UNIQUE (category_id, name),

    CONSTRAINT technologies_category_fk
        FOREIGN KEY (category_id)
        REFERENCES technology_categories(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- 14. PROJECT <-> TECHNOLOGIES
-- ============================================================

CREATE TABLE project_technologies (
    project_id     uuid NOT NULL,
    technology_id  uuid NOT NULL,

    CONSTRAINT project_technologies_pk
        PRIMARY KEY (project_id, technology_id),

    CONSTRAINT project_technologies_project_fk
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT project_technologies_technology_fk
        FOREIGN KEY (technology_id)
        REFERENCES technologies(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- 15. EXPERIENCE
-- ============================================================

CREATE TABLE experience (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name     text NOT NULL,
    company_url      text,
    position         text NOT NULL,
    employment_type  text,
    location         text,
    description      text,
    start_date       date NOT NULL,
    end_date         date,
    is_current       boolean NOT NULL DEFAULT false,
    display_order    integer NOT NULL DEFAULT 0,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT experience_employment_type_check
        CHECK (
            employment_type IS NULL
            OR employment_type IN (
                'full_time',
                'part_time',
                'internship',
                'contract',
                'freelance',
                'temporary'
            )
        ),

    CONSTRAINT experience_dates_check
        CHECK (
            end_date IS NULL
            OR end_date >= start_date
        ),

    CONSTRAINT experience_current_state_check
        CHECK (
            is_current = false
            OR end_date IS NULL
        ),

    CONSTRAINT experience_display_order_check
        CHECK (display_order >= 0)
);


-- ============================================================
-- 16. EXPERIENCE RESPONSIBILITIES
-- ============================================================

CREATE TABLE experience_responsibilities (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id  uuid NOT NULL,
    description    text NOT NULL,
    display_order  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT experience_responsibilities_display_order_check
        CHECK (display_order >= 0),

    CONSTRAINT experience_responsibilities_experience_fk
        FOREIGN KEY (experience_id)
        REFERENCES experience(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 17. EXPERIENCE ACHIEVEMENTS
-- ============================================================

CREATE TABLE experience_achievements (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id  uuid NOT NULL,
    title          text NOT NULL,
    description    text,
    display_order  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT experience_achievements_display_order_check
        CHECK (display_order >= 0),

    CONSTRAINT experience_achievements_experience_fk
        FOREIGN KEY (experience_id)
        REFERENCES experience(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 18. EXPERIENCE <-> SKILLS
-- ============================================================

CREATE TABLE experience_skills (
    experience_id  uuid NOT NULL,
    skill_id       uuid NOT NULL,

    CONSTRAINT experience_skills_pk
        PRIMARY KEY (experience_id, skill_id),

    CONSTRAINT experience_skills_experience_fk
        FOREIGN KEY (experience_id)
        REFERENCES experience(id)
        ON DELETE CASCADE,

    CONSTRAINT experience_skills_skill_fk
        FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- 19. EXPERIENCE <-> TECHNOLOGIES
-- ============================================================

CREATE TABLE experience_technologies (
    experience_id  uuid NOT NULL,
    technology_id  uuid NOT NULL,

    CONSTRAINT experience_technologies_pk
        PRIMARY KEY (experience_id, technology_id),

    CONSTRAINT experience_technologies_experience_fk
        FOREIGN KEY (experience_id)
        REFERENCES experience(id)
        ON DELETE CASCADE,

    CONSTRAINT experience_technologies_technology_fk
        FOREIGN KEY (technology_id)
        REFERENCES technologies(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- 20. EDUCATION
-- ============================================================

CREATE TABLE education (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_name  text NOT NULL,
    institution_url   text,
    degree            text NOT NULL,
    field_of_study    text,
    description       text,
    location          text,
    start_date        date,
    end_date          date,
    is_current        boolean NOT NULL DEFAULT false,
    display_order     integer NOT NULL DEFAULT 0,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT education_dates_check
        CHECK (
            end_date IS NULL
            OR start_date IS NULL
            OR end_date >= start_date
        ),

    CONSTRAINT education_current_state_check
        CHECK (
            is_current = false
            OR end_date IS NULL
        ),

    CONSTRAINT education_display_order_check
        CHECK (display_order >= 0)
);


-- ============================================================
-- 21. EDUCATION ACHIEVEMENTS
-- ============================================================

CREATE TABLE education_achievements (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    education_id   uuid NOT NULL,
    title          text NOT NULL,
    description    text,
    display_order  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT education_achievements_display_order_check
        CHECK (display_order >= 0),

    CONSTRAINT education_achievements_education_fk
        FOREIGN KEY (education_id)
        REFERENCES education(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 22. INDEXES FOR FOREIGN-KEY LOOKUPS
-- ============================================================

CREATE INDEX social_links_personal_info_idx
    ON social_links (personal_info_id);

CREATE INDEX resumes_personal_info_idx
    ON resumes (personal_info_id);

CREATE INDEX projects_display_order_idx
    ON projects (display_order);

CREATE INDEX projects_status_idx
    ON projects (status);

CREATE INDEX project_features_project_idx
    ON project_features (project_id);

CREATE INDEX project_challenges_project_idx
    ON project_challenges (project_id);

CREATE INDEX project_images_project_idx
    ON project_images (project_id);

CREATE INDEX project_links_project_idx
    ON project_links (project_id);

CREATE INDEX project_skills_skill_idx
    ON project_skills (skill_id);

CREATE INDEX project_technologies_technology_idx
    ON project_technologies (technology_id);

CREATE INDEX experience_display_order_idx
    ON experience (display_order);

CREATE INDEX experience_start_date_idx
    ON experience (start_date);

CREATE INDEX experience_responsibilities_experience_idx
    ON experience_responsibilities (experience_id);

CREATE INDEX experience_achievements_experience_idx
    ON experience_achievements (experience_id);

CREATE INDEX experience_skills_skill_idx
    ON experience_skills (skill_id);

CREATE INDEX experience_technologies_technology_idx
    ON experience_technologies (technology_id);

CREATE INDEX education_display_order_idx
    ON education (display_order);

CREATE INDEX education_start_date_idx
    ON education (start_date);

CREATE INDEX education_achievements_education_idx
    ON education_achievements (education_id);


-- ============================================================
-- 23. AUTOMATIC updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


CREATE TRIGGER personal_info_set_updated_at
BEFORE UPDATE ON personal_info
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER social_links_set_updated_at
BEFORE UPDATE ON social_links
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER resumes_set_updated_at
BEFORE UPDATE ON resumes
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER projects_set_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER project_features_set_updated_at
BEFORE UPDATE ON project_features
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER project_challenges_set_updated_at
BEFORE UPDATE ON project_challenges
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER project_images_set_updated_at
BEFORE UPDATE ON project_images
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER project_links_set_updated_at
BEFORE UPDATE ON project_links
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER skill_categories_set_updated_at
BEFORE UPDATE ON skill_categories
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER skills_set_updated_at
BEFORE UPDATE ON skills
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER technology_categories_set_updated_at
BEFORE UPDATE ON technology_categories
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER technologies_set_updated_at
BEFORE UPDATE ON technologies
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER experience_set_updated_at
BEFORE UPDATE ON experience
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER experience_responsibilities_set_updated_at
BEFORE UPDATE ON experience_responsibilities
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER experience_achievements_set_updated_at
BEFORE UPDATE ON experience_achievements
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER education_set_updated_at
BEFORE UPDATE ON education
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER education_achievements_set_updated_at
BEFORE UPDATE ON education_achievements
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 24. SINGLETON: PERSONAL INFO
-- ============================================================

-- Every row produces the same index value (TRUE),
-- therefore PostgreSQL allows only one row.
CREATE UNIQUE INDEX personal_info_singleton_idx
    ON personal_info ((true));`);

}

export async function down(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
    -- ============================================================
    -- REMOVE TRIGGERS
    -- ============================================================

    DROP TRIGGER IF EXISTS education_achievements_set_updated_at
      ON education_achievements;

    DROP TRIGGER IF EXISTS education_set_updated_at
      ON education;

    DROP TRIGGER IF EXISTS experience_technologies_set_updated_at
      ON experience_technologies;

    DROP TRIGGER IF EXISTS experience_skills_set_updated_at
      ON experience_skills;

    DROP TRIGGER IF EXISTS experience_achievements_set_updated_at
      ON experience_achievements;

    DROP TRIGGER IF EXISTS experience_responsibilities_set_updated_at
      ON experience_responsibilities;

    DROP TRIGGER IF EXISTS experience_set_updated_at
      ON experience;

    DROP TRIGGER IF EXISTS technologies_set_updated_at
      ON technologies;

    DROP TRIGGER IF EXISTS technology_categories_set_updated_at
      ON technology_categories;

    DROP TRIGGER IF EXISTS skills_set_updated_at
      ON skills;

    DROP TRIGGER IF EXISTS skill_categories_set_updated_at
      ON skill_categories;

    DROP TRIGGER IF EXISTS project_links_set_updated_at
      ON project_links;

    DROP TRIGGER IF EXISTS project_images_set_updated_at
      ON project_images;

    DROP TRIGGER IF EXISTS project_challenges_set_updated_at
      ON project_challenges;

    DROP TRIGGER IF EXISTS project_features_set_updated_at
      ON project_features;

    DROP TRIGGER IF EXISTS projects_set_updated_at
      ON projects;

    DROP TRIGGER IF EXISTS resumes_set_updated_at
      ON resumes;

    DROP TRIGGER IF EXISTS social_links_set_updated_at
      ON social_links;

    DROP TRIGGER IF EXISTS personal_info_set_updated_at
      ON personal_info;


    -- ============================================================
    -- REMOVE INDEXES
    -- ============================================================

    DROP INDEX IF EXISTS personal_info_singleton_idx;

    DROP INDEX IF EXISTS resumes_one_active_per_owner_idx;

    DROP INDEX IF EXISTS social_links_personal_info_idx;
    DROP INDEX IF EXISTS resumes_personal_info_idx;

    DROP INDEX IF EXISTS projects_display_order_idx;
    DROP INDEX IF EXISTS projects_status_idx;

    DROP INDEX IF EXISTS project_features_project_idx;
    DROP INDEX IF EXISTS project_challenges_project_idx;
    DROP INDEX IF EXISTS project_images_project_idx;
    DROP INDEX IF EXISTS project_links_project_idx;

    DROP INDEX IF EXISTS project_skills_skill_idx;
    DROP INDEX IF EXISTS project_technologies_technology_idx;

    DROP INDEX IF EXISTS experience_display_order_idx;
    DROP INDEX IF EXISTS experience_start_date_idx;

    DROP INDEX IF EXISTS experience_responsibilities_experience_idx;
    DROP INDEX IF EXISTS experience_achievements_experience_idx;
    DROP INDEX IF EXISTS experience_skills_skill_idx;
    DROP INDEX IF EXISTS experience_technologies_technology_idx;

    DROP INDEX IF EXISTS education_display_order_idx;
    DROP INDEX IF EXISTS education_start_date_idx;
    DROP INDEX IF EXISTS education_achievements_education_idx;


    -- ============================================================
    -- REMOVE TABLES
    -- Child tables first, parent tables last.
    -- ============================================================

    DROP TABLE IF EXISTS education_achievements;
    DROP TABLE IF EXISTS education;

    DROP TABLE IF EXISTS experience_technologies;
    DROP TABLE IF EXISTS experience_skills;
    DROP TABLE IF EXISTS experience_achievements;
    DROP TABLE IF EXISTS experience_responsibilities;
    DROP TABLE IF EXISTS experience;

    DROP TABLE IF EXISTS project_technologies;
    DROP TABLE IF EXISTS project_skills;

    DROP TABLE IF EXISTS project_links;
    DROP TABLE IF EXISTS project_images;
    DROP TABLE IF EXISTS project_challenges;
    DROP TABLE IF EXISTS project_features;
    DROP TABLE IF EXISTS projects;

    DROP TABLE IF EXISTS technologies;
    DROP TABLE IF EXISTS technology_categories;

    DROP TABLE IF EXISTS skills;
    DROP TABLE IF EXISTS skill_categories;

    DROP TABLE IF EXISTS resumes;
    DROP TABLE IF EXISTS social_links;
    DROP TABLE IF EXISTS personal_info;


    -- ============================================================
    -- REMOVE TRIGGER FUNCTION
    -- ============================================================

    DROP FUNCTION IF EXISTS set_updated_at();
    `);
}
