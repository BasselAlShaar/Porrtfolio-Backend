import type { UUID } from "node:crypto";

export interface SocialLinksData {
    id: UUID;
    platform: string;
    label?: string | null;
    url: string;
    icon?: string | null;
    display_order: number;
    is_visible: boolean;
}

export type CreateSocialLinksData = SocialLinksData;

export type UpdateSocialLinksData = Omit<Partial<SocialLinksData>, "id">;