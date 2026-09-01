export interface PersonalInfoData {
    full_name: string;
    professional_title: string;
    short_bio: string | null;
    bio: string | null;
    profile_image_url: string | null;
    location: string | null;
    email: string | null;
    phone: string | null;
    availability_status: string | null;
    availability_text: string | null ;
}

export type UpdatePersonalInfoData = Partial<PersonalInfoData>;