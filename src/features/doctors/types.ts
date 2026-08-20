export interface Doctor {
  id: string;
  profile_id: string;

  specialization: string;
  qualification: string;
  bio: string;

  consultation_fee: number;

  status: string;

  profile: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface DoctorDetail {
  id: string;
  profile_id: string;

  specialization: string;
  qualification: string;
  bio: string | null;

  consultation_fee: number;

  status: string;

  email: string;
  phone: string;

  profile: {
    full_name: string;
    avatar_url: string | null;

    gender: string | null;
    country: string | null;
    state: string | null;
    city: string | null;
  };

  doctor_schedules: DoctorSchedule[];
}

export type ContactInfo = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  specialization: string;
  qualification: string;
  consultationFee: number | "";
  status: string;
  bio: string;
  profileImage: File | null;
};

export type AddressInfo = {
  country: string;
  state: string;
  city: string;
};

export type DoctorSchedule = {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isActive: boolean;
};

export type DoctorScheduleForm = Omit<DoctorSchedule, "slotDurationMinutes"> & {
  slotDurationMinutes: number | "";
};

export type DoctorScheduleListItem = {
  id: string;
  specialization: string;
  email: string;
  phone: string;
  status: string;
  profile: {
    full_name: string;
    avatar_url: string | null;
  };
  doctor_schedules: {
    id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    slot_duration_minutes: number;
    is_active: boolean;
  }[];
};

export interface DoctorPatient {
  id: string;
  profile_id: string;

  full_name: string;
  avatar_url: string | null;

  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;

  last_appointment_id: string | null;
  last_appointment_date: string | null;
  last_appointment_time: string | null;
  last_appointment_status: string | null;
}

export interface DoctorAppointment {
  id: string;
  patient_id: string;
  doctor_id: string;

  appointment_date: string;
  time_slot: string;
  status: string;

  reason_of_visit: string | null;
  notes: string | null;

  patient: {
    id: string;
    profile_id: string;

    full_name: string;
    avatar_url: string | null;

    date_of_birth: string | null;
    gender: string | null;
    blood_group: string | null;
  };
}

export type DoctorDashboardAppointment = {
  id: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  reason_of_visit: string | null;

  patient: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
    prescriptionId?: string | null;

};

export type DoctorTopPatient = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  appointmentCount: number;
};

export type DashboardDoctorSchedule = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
};