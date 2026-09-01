export interface SocialLinksData {
    personal_info_id: string;
    platform: string;
    label: string | null;
    url: string;
    icon?: string | null;
    display_order: number;
    is_visible: boolean;
}

export type CreateSocialLinksData = SocialLinksData;

export type UpdateSocialLinksData = Omit<Partial<SocialLinksData>, 'personal_info_id'>;