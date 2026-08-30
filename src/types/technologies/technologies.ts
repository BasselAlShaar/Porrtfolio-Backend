export interface TechnologiesData {
    name : string;
    description? : string | null;
    icon? : string | null;
    display_order : number;
}

export type CreateTechnologiesData = TechnologiesData;

export type UpdateTechnologiesData = Partial<TechnologiesData>;