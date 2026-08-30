export interface TechnologiesCategoryData {
    name: string;
    description?: string | null;
    display_order: number
}

export type CreateTechnologiesCategoryData = TechnologiesCategoryData;

export type UpdateTechnologiesCategoryData = Partial<TechnologiesCategoryData>;