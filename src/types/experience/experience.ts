// ================================================================
//    EXPERIENCE TYPES
// ================================================================
//
// These interfaces define the contract for experience data.
//
// In other words:
//
// Controller: "Here's the data."
// Service:    "Is this data valid?"
// Repository: "I'll put it in PostgreSQL."
// TypeScript: "Are we sure this thing even exists?"
//
// ================================================================



// ================================================================
//    BASE EXPERIENCE DATA
// ================================================================
//
// The fields that describe the actual experience record.
//
// This interface represents the core experience itself.
// Related data such as skills, technologies, achievements,
// and responsibilities are defined separately below.
//
// ================================================================
export interface ExperienceData {
    // The company where the experience took place.
    company_name: string;

    // Optional because apparently not every company has a website.
    company_url?: string | null;

    // Job title / position.
    position: string;

    // e.g. full_time, part_time, internship, contract
    employment_type?: string | null;

    // Where the experience took place.
    location?: string | null;

    // General description of the experience.
    description?: string | null;

    // Start date is required.
    start_date: string;

    // Null means there is no end date.
    // Usually because the experience is still ongoing.
    end_date?: string | null;

    // Is this experience currently active?
    //
    // Because "end_date is null" alone apparently wasn't
    // enough information for us humans.
    is_current: boolean;

    // Controls the order in which experiences are displayed.
    //
    // Because chronological order is apparently too boring.
    display_order: number;
}

// ================================================================
//    CREATE EXPERIENCE
// ================================================================
//
// Creating an experience can also include its relationships.
//
// One API request can therefore create:
//
// Experience
//    ├── Skills
//    ├── Technologies
//    ├── Achievements
//    └── Responsibilities
//
// Much better than making the frontend send 5 separate requests.
//
// ================================================================
export interface CreateExperienceData extends ExperienceData {

    // IDs of existing skills to associate with this experience.
    skill_ids?: string[];

    // IDs of existing technologies to associate with this experience.
    technology_ids?: string[];

    // Achievements belonging to this experience.
    achievements?: CreateExperienceAchievementData[];

    // Responsibilities belonging to this experience.
    responsibilities?: CreateExperienceResponsibilityData[];
}

// ================================================================
//    EXPERIENCE ACHIEVEMENT
// ================================================================
//
// Something impressive that happened during the experience.
//
// Preferably something more meaningful than:
// "Successfully attended meetings."
//
// ================================================================
export interface CreateExperienceAchievementData {

    // Short title for the achievement.
    title: string;

    // Optional additional context.
    description?: string | null;

    // Controls display order.
    display_order: number;
}

// ================================================================
//    EXPERIENCE RESPONSIBILITY
// ================================================================
//
// What was actually done during the experience.
//
// The database doesn't judge.
// It simply stores the evidence.
//
// ================================================================
export interface CreateExperienceResponsibilityData {

    // Description of the responsibility.
    description: string;

    // Controls display order.
    display_order: number;
}

// ================================================================
//    UPDATE EXPERIENCE
// ================================================================
//
// Every field becomes optional for updates.
//
// Why?
//
// PUT/PATCH request:
// "Change the position."
//
// TypeScript:
// "Okay, but don't make me send the entire experience again."
//
// Partial<ExperienceData> does exactly that.
//
// ================================================================
export type UpdateExperienceData = Partial<ExperienceData>;