export interface Profile {
  full_name: string;
  gender: string | null;
  avatar_url: string | null;
  city: string | null;
}

export interface DoctorProfile {
  full_name: string;
  avatar_url: string | null;
  
}

export interface Doctor {
  specialization: string;
  profile: DoctorProfile | null;
  status: string;
}

export interface PatientRow {
  id: string;

  profile_id: string;

  date_of_birth: string;

  blood_group: string;

  primary_doctor_id: string;

  stay_address: string;

  permanent_address: string;

  profile: Profile | null;

  doctor?: Doctor | null;

  phone: string | null;
}
type CreatePatientInput = {
  email: string;
  password: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  primary_doctor_id: string;
  stay_address: string;
  permanent_address: string;
  country: string;
  state: string;
  city: string;
  imageFile: File | null;
};

// actions.ts mein createPatient signature change:
export async function createPatient(formData: FormData) {
  const full_name = formData.get("full_name") as string;
  const gender = formData.get("gender") as string;
  const date_of_birth = formData.get("date_of_birth") as string;
  const blood_group = formData.get("blood_group") as string;
  const primary_doctor_id = formData.get("primary_doctor_id") as string;
  const stay_address = formData.get("stay_address") as string;
  const permanent_address = formData.get("permanent_address") as string;
  const country = formData.get("country") as string;
  const state = formData.get("state") as string;
  const city = formData.get("city") as string;
  const imageFile = formData.get("imageFile") as File | null;

  // ... baqi upload + insert wala code same rahega, bas variable names use karo
}