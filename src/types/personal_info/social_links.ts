export interface SocialLinksData {
    platform: string;
    label: string | null;
    url: string;
    icon?: string | null;
    display_order: number;
    is_visible: boolean;
}

export type CreateSocialLinksData = SocialLinksData;

export type UpdateSocialLinksData = Partial<SocialLinksData>;