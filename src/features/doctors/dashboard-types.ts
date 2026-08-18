export interface DashboardAppointment {
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
}

export interface DashboardSchedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
}

export interface DoctorDashboardData {
  doctor: {
    id: string;
    profile_id: string;
    full_name: string;
    avatar_url: string | null;
    specialization: string;
    qualification: string | null;
    consultation_fee: number;
    status: string;
  };

  statistics: {
    totalAppointments: number;
    upcomingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    pendingAppointments: number;
  };

  upcomingAppointments: DashboardAppointment[];

  recentAppointments: DashboardAppointment[];

  appointmentStats: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };

  monthlyAppointments: {
    month: string;
    count: number;
  }[];

  schedules: DashboardSchedule[];

  topPatients: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    appointmentCount: number;
  }[];
}
