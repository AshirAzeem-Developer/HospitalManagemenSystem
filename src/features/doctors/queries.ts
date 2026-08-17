import { createClient } from "@/lib/supabase/server";
import { paginateQuery } from "@/lib/paginateQuery";
import type { Doctor, DoctorDetail, DoctorScheduleListItem } from "./types";
import { supabaseAdmin } from "@/lib/supabase/admin";

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

const DEFAULT_PAGE_SIZE = 9;

export function getDoctorsParams(searchParams: { page?: string; limit?: string; q?: string } = {}) {
  const parsedPage = Number.parseInt(searchParams.page ?? "1", 10);
  const parsedLimit = Number.parseInt(searchParams.limit ?? String(DEFAULT_PAGE_SIZE), 10);
  const q = searchParams.q ?? "";

  return {
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    limit: Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : DEFAULT_PAGE_SIZE,
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
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_PAGE_SIZE;

  let dbQuery = supabase
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
        avatar_url
      )
    `,
      { count: "exact" },
    );

  const trimmedQuery = query?.trim();
  if (trimmedQuery) {
    const { data: specializationMatches, error: specializationError } = await supabase
      .from("doctors")
      .select("id")
      .ilike("specialization", `%${trimmedQuery}%`);

    if (specializationError) {
      console.error("Error searching doctors by specialization:", specializationError.message);
    }

    const { data: profileMatches, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .ilike("full_name", `%${trimmedQuery}%`);

    if (profileError) {
      console.error("Error searching doctors by profile name:", profileError.message);
    }

    const matchedDoctorIds = new Set<string>([
      ...((specializationMatches ?? []).map((doctor) => String(doctor.id))),
    ]);

    if (profileMatches && profileMatches.length > 0) {
      const profileIds = profileMatches.map((profile) => profile.id);

      const { data: doctorsByProfile, error: doctorsByProfileError } = await supabase
        .from("doctors")
        .select("id")
        .in("profile_id", profileIds);

      if (doctorsByProfileError) {
        console.error("Error matching doctors to profile names:", doctorsByProfileError.message);
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

  const { data, error } = await supabase
    .from("doctors")
    .select(`
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