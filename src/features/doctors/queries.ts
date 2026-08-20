import { createClient } from "@/lib/supabase/server";
import type {
  Doctor,
  DoctorDetail,
  DoctorScheduleListItem,
  DoctorPatient,
  DoctorAppointment,
} from "./types";
import type {
  DoctorDashboardData,
  DashboardAppointment,
  DashboardSchedule,
} from "./dashboard-types";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { paginateQuery } from "@/lib/paginateQuery";

// export async function getDoctors(): Promise<Doctor[]> {
//   const supabase = await createClient();

//   const { data, error } = await supabase.from("doctors").select(`
//       id,
//       profile_id,
//       specialization,
//       qualification,
//       bio,
//       consultation_fee,
//       status,
//       profile:profiles!doctors_profile_id_fkey (
//         full_name,
//         avatar_url
//       )
//     `);

//   if (error) {
//     console.error("Error fetching doctors:", error.message);
//     return [];
//   }

//   return (data ?? []).map((doctor) => {
//     const profile = doctor.profile as unknown as {
//       full_name: string;
//       avatar_url: string | null;
//     } | null;

//     return {
//       id: doctor.id,
//       profile_id: doctor.profile_id,
//       specialization: doctor.specialization,
//       qualification: doctor.qualification,
//       bio: doctor.bio,
//       consultation_fee: doctor.consultation_fee,
//       status: doctor.status,

//       profile: {
//         full_name: profile?.full_name ?? "",
//         avatar_url: profile?.avatar_url ?? null,
//       },
//     };
//   });
// }

const DEFAULT_PAGE_SIZE = 10;

export function getDoctorsParams(
  searchParams: { page?: string; limit?: string; q?: string } = {},
) {
  const parsedPage = Number.parseInt(searchParams.page ?? "1", 10);
  const parsedLimit = Number.parseInt(
    searchParams.limit ?? String(DEFAULT_PAGE_SIZE),
    10,
  );
  const q = searchParams.q ?? "";

  return {
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    limit:
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? parsedLimit
        : DEFAULT_PAGE_SIZE,
    q,
  };
}

export async function getDoctors({
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  query = "",
}: {
  page?: number;
  limit?: number;
  query?: string;
} = {}) {
  const supabase = await createClient();

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit =
    Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_PAGE_SIZE;

  let dbQuery = supabase.from("doctors").select(
    `
      id,
      profile_id,
      specialization,
      qualification,
      bio,
      consultation_fee,
      status,
      profile:profiles!doctors_profile_id_fkey (
        full_name,
        avatar_url
      )
    `,
    { count: "exact" },
  );

  const trimmedQuery = query?.trim();
  if (trimmedQuery) {
    const { data: specializationMatches, error: specializationError } =
      await supabase
        .from("doctors")
        .select("id")
        .ilike("specialization", `%${trimmedQuery}%`);

    if (specializationError) {
      console.error(
        "Error searching doctors by specialization:",
        specializationError.message,
      );
    }

    const { data: profileMatches, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .ilike("full_name", `%${trimmedQuery}%`);

    if (profileError) {
      console.error(
        "Error searching doctors by profile name:",
        profileError.message,
      );
    }

    const matchedDoctorIds = new Set<string>([
      ...(specializationMatches ?? []).map((doctor) => String(doctor.id)),
    ]);

    if (profileMatches && profileMatches.length > 0) {
      const profileIds = profileMatches.map((profile) => profile.id);

      const { data: doctorsByProfile, error: doctorsByProfileError } =
        await supabase
          .from("doctors")
          .select("id")
          .in("profile_id", profileIds);

      if (doctorsByProfileError) {
        console.error(
          "Error matching doctors to profile names:",
          doctorsByProfileError.message,
        );
      }

      for (const doctor of doctorsByProfile ?? []) {
        matchedDoctorIds.add(String(doctor.id));
      }
    }

    if (matchedDoctorIds.size === 0) {
      return {
        doctors: [],
        totalDoctors: 0,
        totalPages: 0,
      };
    }

    dbQuery = dbQuery.in("id", [...matchedDoctorIds]);
  }

  const { data, count, totalPages, error } = await paginateQuery(dbQuery, {
    page: safePage,
    limit: safeLimit,
  });

  if (error) {
    console.error("Error fetching doctors:", error.message);

    return {
      doctors: [],
      totalDoctors: 0,
      totalPages: 0,
    };
  }

  const doctors: Doctor[] = (data ?? []).map((doctor: Record<string, any>) => {
    const profile = doctor.profile as unknown as {
      full_name: string;
      avatar_url: string | null;
    } | null;

    return {
      id: doctor.id,
      profile_id: doctor.profile_id,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      bio: doctor.bio,
      consultation_fee: doctor.consultation_fee,
      status: doctor.status,

      profile: {
        full_name: profile?.full_name ?? "",
        avatar_url: profile?.avatar_url ?? null,
      },
    };
  });

  return {
    doctors,
    totalDoctors: count ?? 0,
    totalPages,
  };
}
// export async function getDoctorById(id: string) {
//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("doctors")
//     .select(
//       `
//       id,
//       profile_id,
//       specialization,
//       qualification,
//       bio,
//       consultation_fee,
//       status,

//       profile:profiles!doctors_profile_id_fkey (
//         full_name,
//         avatar_url,
//         gender,
//         country,
//         state,
//         city
//       ),

//       doctor_schedules (
//         id,
//         day_of_week,
//         start_time,
//         end_time,
//         slot_duration_minutes,
//         is_active
//       )
//     `,
//     )
//     .eq("id", id)
//     .single();

//   if (error) {
//     console.error("Error fetching doctor:", error.message);
//     return null;
//   }

//   const profile = Array.isArray(data.profile) ? data.profile[0] : data.profile;

//   const { data: authUser, error: authError } =
//     await supabaseAdmin.auth.admin.getUserById(data.profile_id);

//   if (authError) {
//     console.error("Error fetching auth user:", authError.message);
//     return null;
//   }

//   return {
//     id: data.id,
//     profile_id: data.profile_id,
//     specialization: data.specialization,
//     email: authUser.user.email ?? "",
//     phone: authUser.user.phone ?? "",
//     qualification: data.qualification,
//     bio: data.bio,
//     consultation_fee: data.consultation_fee,
//     status: data.status,

//     profile: {
//       full_name: profile?.full_name ?? "",
//       avatar_url: profile?.avatar_url ?? null,
//       gender: profile?.gender ?? null,
//       country: profile?.country ?? null,
//       state: profile?.state ?? null,
//       city: profile?.city ?? null,
//     },

//     doctor_schedules: data.doctor_schedules ?? [],
//   };
// }

export async function getDoctorById(id: string): Promise<DoctorDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("doctors")
    .select(
      `
      id,
      profile_id,
      specialization,
      qualification,
      bio,
      consultation_fee,
      status,

      profile:profiles!doctors_profile_id_fkey (
        full_name,
        avatar_url,
        gender,
        country,
        state,
        city
      ),

      doctor_schedules (
        id,
        day_of_week,
        start_time,
        end_time,
        slot_duration_minutes,
        is_active
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching doctor:", error.message);
    return null;
  }

  // Supabase can return the relation as an array
  // even though profile_id is a single relation.
  const profile = Array.isArray(data.profile) ? data.profile[0] : data.profile;

  // Get email and phone from Supabase Auth
  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.getUserById(data.profile_id);

  if (authError) {
    console.error("Error fetching auth user:", authError.message);

    return null;
  }

  return {
    id: data.id,
    profile_id: data.profile_id,

    specialization: data.specialization,
    qualification: data.qualification,
    bio: data.bio,
    consultation_fee: data.consultation_fee,
    status: data.status,

    email: authUser.user.email ?? "",
    phone: authUser.user.phone ?? "",

    profile: {
      full_name: profile?.full_name ?? "",
      avatar_url: profile?.avatar_url ?? null,
      gender: profile?.gender ?? null,
      country: profile?.country ?? null,
      state: profile?.state ?? null,
      city: profile?.city ?? null,
    },

    doctor_schedules: (data.doctor_schedules ?? []).map((schedule) => ({
      id: schedule.id,
      dayOfWeek: schedule.day_of_week,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      slotDurationMinutes: schedule.slot_duration_minutes,
      isActive: schedule.is_active,
    })),
  };
}

export async function getDoctorScheduleList(): Promise<
  DoctorScheduleListItem[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("doctors").select(`
      id,
      profile_id,
      specialization,
      status,

      profile:profiles!doctors_profile_id_fkey (
        full_name,
        avatar_url
      ),

      doctor_schedules (
        id,
        day_of_week,
        start_time,
        end_time,
        slot_duration_minutes,
        is_active
      )
    `);

  if (error) {
    console.error("Error fetching doctor schedules:", error);
    return [];
  }

  const doctorsWithAuthData = await Promise.all(
    (data ?? []).map(async (doctor) => {
      const { data: authUser, error: authError } =
        await supabaseAdmin.auth.admin.getUserById(doctor.profile_id);

      if (authError) {
        console.error(
          `Error fetching auth user for doctor ${doctor.id}:`,
          authError.message,
        );
      }

      const profile = Array.isArray(doctor.profile)
        ? doctor.profile[0]
        : doctor.profile;

      return {
        id: doctor.id,
        specialization: doctor.specialization,
        status: doctor.status,

        email: authUser?.user?.email ?? "",
        phone: authUser?.user?.phone ?? "",

        profile: {
          full_name: profile?.full_name ?? "",
          avatar_url: profile?.avatar_url ?? null,
        },

        doctor_schedules: doctor.doctor_schedules ?? [],
      };
    }),
  );

  return doctorsWithAuthData as DoctorScheduleListItem[];
}

export async function getMyPatients(): Promise<DoctorPatient[]> {
  const supabase = await createClient();

  // ---------------------------------------
  // 1. Get currently logged-in doctor
  // ---------------------------------------

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("GET CURRENT USER ERROR:", userError?.message);

    return [];
  }

  // ---------------------------------------
  // 2. Find doctor record
  // ---------------------------------------

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (doctorError) {
    console.error("GET DOCTOR ERROR:", doctorError.message);

    return [];
  }

  if (!doctor) {
    console.error("No doctor record found for logged-in user.");

    return [];
  }

  // ---------------------------------------
  // 3. Get doctor's appointments
  // ---------------------------------------

  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      time_slot,
      status,

      patient:patients!appointments_patient_id_fkey (
        id,
        profile_id,
        date_of_birth,
        blood_group,

        profile:profiles!patients_profile_id_fkey (
          full_name,
          avatar_url,
          gender
        )
      )
    `,
    )
    .eq("doctor_id", doctor.id)
    .order("appointment_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (appointmentsError) {
    console.error("GET DOCTOR APPOINTMENTS ERROR:", appointmentsError.message);

    return [];
  }

  // ---------------------------------------
  // 4. Remove duplicate patients
  // ---------------------------------------
  //
  // Because appointments are ordered from newest
  // to oldest, the first appointment we encounter
  // for a patient is their latest appointment.
  // ---------------------------------------

  const patientsMap = new Map<string, DoctorPatient>();

  for (const appointment of appointments ?? []) {
    const patient = Array.isArray(appointment.patient)
      ? appointment.patient[0]
      : appointment.patient;

    if (!patient) {
      continue;
    }

    // If patient already exists, skip it.
    if (patientsMap.has(patient.id)) {
      continue;
    }

    const profile = Array.isArray(patient.profile)
      ? patient.profile[0]
      : patient.profile;

    patientsMap.set(patient.id, {
      id: patient.id,
      profile_id: patient.profile_id,

      full_name: profile?.full_name ?? "",
      avatar_url: profile?.avatar_url ?? null,

      date_of_birth: patient.date_of_birth ?? null,
      gender: profile?.gender ?? null,
      blood_group: patient.blood_group ?? null,
      last_appointment_id: appointment.id,
      last_appointment_date: appointment.appointment_date ?? null,
      last_appointment_time: appointment.time_slot ?? null,
      last_appointment_status: appointment.status ?? null,
    });
  }

  // ---------------------------------------
  // 5. Return unique patient list
  // ---------------------------------------

  return Array.from(patientsMap.values());
}

export async function getMyAppointments(): Promise<DoctorAppointment[]> {
  const supabase = await createClient();

  // ---------------------------------------
  // 1. Get currently logged-in doctor
  // ---------------------------------------

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("GET CURRENT USER ERROR:", userError?.message);
    return [];
  }

  // ---------------------------------------
  // 2. Find doctor record
  // ---------------------------------------

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (doctorError) {
    console.error("GET DOCTOR ERROR:", doctorError.message);
    return [];
  }

  if (!doctor) {
    console.error("No doctor record found.");
    return [];
  }

  // ---------------------------------------
  // 3. Get doctor's appointments
  // ---------------------------------------

  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `
      id,
      patient_id,
      doctor_id,
      appointment_date,
      time_slot,
      status,
      reason_of_visit,
      notes,

      patient:patients!appointments_patient_id_fkey (
        id,
        profile_id,
        date_of_birth,
        blood_group,

        profile:profiles!patients_profile_id_fkey (
          full_name,
          avatar_url,
          gender
        )
      )
      `,
    )
    .eq("doctor_id", doctor.id)
    .order("appointment_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (appointmentsError) {
    console.error("GET DOCTOR APPOINTMENTS ERROR:", appointmentsError.message);

    return [];
  }

  // ---------------------------------------
  // 4. Normalize appointment data
  // ---------------------------------------

  return (appointments ?? [])
    .map((appointment) => {
      const patient = Array.isArray(appointment.patient)
        ? appointment.patient[0]
        : appointment.patient;

      if (!patient) {
        return null;
      }

      const profile = Array.isArray(patient.profile)
        ? patient.profile[0]
        : patient.profile;

      return {
        id: appointment.id,

        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,

        appointment_date: appointment.appointment_date,
        time_slot: appointment.time_slot,

        status: appointment.status,

        reason_of_visit: appointment.reason_of_visit ?? null,
        notes: appointment.notes ?? null,

        patient: {
          id: patient.id,
          profile_id: patient.profile_id,

          full_name: profile?.full_name ?? "",
          avatar_url: profile?.avatar_url ?? null,

          date_of_birth: patient.date_of_birth ?? null,
          gender: profile?.gender ?? null,
          blood_group: patient.blood_group ?? null,
        },
      };
    })
    .filter(
      (appointment): appointment is DoctorAppointment => appointment !== null,
    );
}

export async function getDoctorDashboard(): Promise<DoctorDashboardData | null> {
  const supabase = await createClient();

  // ---------------------------------------
  // 1. Get logged-in user
  // ---------------------------------------

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("GET DASHBOARD USER ERROR:", userError?.message);
    return null;
  }

  // ---------------------------------------
  // 2. Get doctor
  // ---------------------------------------

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select(
      `
      id,
      profile_id,
      specialization,
      qualification,
      consultation_fee,
      status,

      profile:profiles!doctors_profile_id_fkey (
        full_name,
        avatar_url
      )
    `,
    )
    .eq("profile_id", user.id)
    .maybeSingle();

  if (doctorError) {
    console.error("GET DASHBOARD DOCTOR ERROR:", doctorError.message);
    return null;
  }

  if (!doctor) {
    console.error("No doctor found for dashboard.");
    return null;
  }

  const profile = Array.isArray(doctor.profile)
    ? doctor.profile[0]
    : doctor.profile;

  // ---------------------------------------
  // 3. Get appointments
  // ---------------------------------------

  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      time_slot,
      status,
      reason_of_visit,

      patient:patients!appointments_patient_id_fkey (
        id,

        profile:profiles!patients_profile_id_fkey (
          full_name,
          avatar_url
        )
      )
    `,
    )
    .eq("doctor_id", doctor.id)
    .order("appointment_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (appointmentsError) {
    console.error(
      "GET DASHBOARD APPOINTMENTS ERROR:",
      appointmentsError.message,
    );

    return null;
  }

  // ---------------------------------------
  // 4. Normalize appointments
  // ---------------------------------------

  const normalizedAppointments: DashboardAppointment[] = (appointments ?? [])
    .map((appointment) => {
      const patient = Array.isArray(appointment.patient)
        ? appointment.patient[0]
        : appointment.patient;

      if (!patient) {
        return null;
      }

      const patientProfile = Array.isArray(patient.profile)
        ? patient.profile[0]
        : patient.profile;

      return {
        id: appointment.id,
        appointment_date: appointment.appointment_date,
        time_slot: appointment.time_slot,
        status: appointment.status,
        reason_of_visit: appointment.reason_of_visit,

        patient: {
          id: patient.id,
          full_name: patientProfile?.full_name ?? "",
          avatar_url: patientProfile?.avatar_url ?? null,
        },
      };
    })
    .filter(
      (appointment): appointment is DashboardAppointment =>
        appointment !== null,
    );

  // ---------------------------------------
  // 5. Statistics
  // ---------------------------------------

  const totalAppointments = normalizedAppointments.length;

  const completedAppointments = normalizedAppointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;

  const cancelledAppointments = normalizedAppointments.filter(
    (appointment) => appointment.status === "cancelled",
  ).length;

  const pendingAppointments = normalizedAppointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;

  // ---------------------------------------
  // 6. Upcoming appointments
  // ---------------------------------------

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = normalizedAppointments
    .filter((appointment) => {
      const appointmentDate = new Date(
        `${appointment.appointment_date}T00:00:00`,
      );

      return (
        appointmentDate >= today &&
        appointment.status !== "cancelled" &&
        appointment.status !== "completed"
      );
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.appointment_date}T${a.time_slot}`).getTime();

      const dateB = new Date(`${b.appointment_date}T${b.time_slot}`).getTime();

      return dateA - dateB;
    });

  // ---------------------------------------
  // 7. Recent appointments
  // ---------------------------------------

  const recentAppointments = [...normalizedAppointments]
    .sort((a, b) => {
      const dateA = new Date(`${a.appointment_date}T${a.time_slot}`).getTime();

      const dateB = new Date(`${b.appointment_date}T${b.time_slot}`).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  // ---------------------------------------
  // 8. Appointment status statistics
  // ---------------------------------------

  const appointmentStats = {
    pending: normalizedAppointments.filter(
      (appointment) => appointment.status === "pending",
    ).length,

    confirmed: normalizedAppointments.filter(
      (appointment) => appointment.status === "confirmed",
    ).length,

    completed: normalizedAppointments.filter(
      (appointment) => appointment.status === "completed",
    ).length,

    cancelled: normalizedAppointments.filter(
      (appointment) => appointment.status === "cancelled",
    ).length,
  };

  // ---------------------------------------
  // 9. Monthly appointment statistics
  // ---------------------------------------

  const monthlyAppointments: {
    month: string;
    count: number;
  }[] = [];

  const todayForMonths = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      todayForMonths.getFullYear(),
      todayForMonths.getMonth() - i,
      1,
    );

    const year = date.getFullYear();
    const monthIndex = date.getMonth();

    const monthName = date.toLocaleString("en-US", {
      month: "short",
    });

    const count = normalizedAppointments.filter((appointment) => {
      const appointmentDate = new Date(
        `${appointment.appointment_date}T00:00:00`,
      );

      return (
        appointmentDate.getFullYear() === year &&
        appointmentDate.getMonth() === monthIndex
      );
    }).length;

    monthlyAppointments.push({
      month: monthName,
      count,
    });
  }
  // ---------------------------------------
  // 10. Doctor schedules
  // ---------------------------------------

  const { data: schedules, error: schedulesError } = await supabase
    .from("doctor_schedules")
    .select(
      `
      id,
      day_of_week,
      start_time,
      end_time,
      slot_duration_minutes,
      is_active
    `,
    )
    .eq("doctor_id", doctor.id)
    .order("day_of_week", { ascending: true });

  if (schedulesError) {
    console.error("GET DASHBOARD SCHEDULE ERROR:", schedulesError.message);
  }

  // ---------------------------------------
  // 11. Top patients
  // ---------------------------------------

  const patientCounts = new Map<
    string,
    {
      id: string;
      full_name: string;
      avatar_url: string | null;
      appointmentCount: number;
    }
  >();

  for (const appointment of normalizedAppointments) {
    const patient = appointment.patient;

    const existing = patientCounts.get(patient.id);

    if (existing) {
      existing.appointmentCount += 1;
    } else {
      patientCounts.set(patient.id, {
        id: patient.id,
        full_name: patient.full_name,
        avatar_url: patient.avatar_url,
        appointmentCount: 1,
      });
    }
  }

  const topPatients = Array.from(patientCounts.values())
    .sort((a, b) => b.appointmentCount - a.appointmentCount)
    .slice(0, 5);

  // ---------------------------------------
  // 12. Return dashboard data
  // ---------------------------------------

  return {
    doctor: {
      id: doctor.id,
      profile_id: doctor.profile_id,
      full_name: profile?.full_name ?? "",
      avatar_url: profile?.avatar_url ?? null,
      specialization: doctor.specialization,
      qualification: doctor.qualification ?? null,
      consultation_fee: Number(doctor.consultation_fee),
      status: doctor.status,
    },

    statistics: {
      totalAppointments,
      upcomingAppointments: upcomingAppointments.length,
      completedAppointments,
      cancelledAppointments,
      pendingAppointments,
    },

    upcomingAppointments: upcomingAppointments.slice(0, 1),

    recentAppointments,

    appointmentStats,

    monthlyAppointments,

    schedules: (schedules ?? []) as DashboardSchedule[],

    topPatients,
  };
}
