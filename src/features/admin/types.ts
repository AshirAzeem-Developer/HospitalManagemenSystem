export type Profile = {
  id: string;
  full_name: string;
  role: "admin" | "doctor" | "patient";
  avatar_url: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  gender: "male" | "female" | "other" | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type ProfileUpdateInput = {
  full_name: string;
  country: string;
  state: string;
  city: string;
  gender: string;
};