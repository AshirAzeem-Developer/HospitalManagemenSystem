"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatPakistaniPhone } from "@/lib/phone";
import { paginateQuery } from "@/lib/paginateQuery";



export async function getPatients({
  page = 1,
  limit = 10,
  query = "",
}: {
  page?: number;
  limit?: number;
  query?: string;
} = {}): Promise<{
  patients: any[];
  totalPatients: number;
  totalPages: number;
}> {
  const supabase = await createClient();

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  let dbQuery = supabase
    .from("patients")
    .select(
      `
        id,
        profile_id,
        blood_group,
        stay_address,
        profile:profiles (
          full_name,
          gender,
          avatar_url
        ),
        doctor:doctors (
          specialization,
          status,
          profile:profiles (
            full_name,
            avatar_url
          )
        )
      `,
      { count: "exact" },
    );

  const trimmedQuery = query?.trim();
  if (trimmedQuery) {
    const { data: profileMatches, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .ilike("full_name", `%${trimmedQuery}%`);

    if (profileError) {
      console.error("Error filtering patients by name:", profileError.message);
      throw new Error(profileError.message);
    }

    const profileIds = (profileMatches ?? []).map((profile) => profile.id);

    if (profileIds.length === 0) {
      return {
        patients: [],
        totalPatients: 0,
        totalPages: 1,
      };
    }

    dbQuery = dbQuery.in("profile_id", profileIds);
  }

  const { data, count, totalPages, error } = await paginateQuery(dbQuery, {
    page: safePage,
    limit: safeLimit,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const updatedPatients = await Promise.all(
    (data ?? []).map(async (patient: any) => {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
        patient.profile_id,
      );

      patient.phone = formatPakistaniPhone(authUser?.user?.phone);

      if (patient.profile?.[0]?.avatar_url) {
        const path = patient.profile[0].avatar_url.split("/images/")[1];

        const { data: image } = await supabase.storage
          .from("images")
          .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);

        patient.profile[0].avatar_url = image?.signedUrl ?? null;
      }

      if (patient.doctor?.[0]?.profile?.[0]?.avatar_url) {
        const path = patient.doctor[0].profile[0].avatar_url.split("/images/")[1];

        const { data: image } = await supabase.storage
          .from("images")
          .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);

        patient.doctor[0].profile[0].avatar_url = image?.signedUrl ?? null;
      }

      return patient;
    }),
  );

  return {
    patients: updatedPatients,
    totalPatients: count ?? 0,
    totalPages,
  };
}

//edit
export async function getPatientById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("patients")
    .select(`
      id,
      profile_id,
      date_of_birth,
      blood_group,
      stay_address,
      permanent_address,

      profile:profiles (
        full_name,
        gender,
        country,
        state,
        city,
        avatar_url
      ),

      doctor:doctors (
        id,
        specialization,
        status,
        profile:profiles (
          full_name,
          avatar_url
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  // Auth se email + phone
  const {
    data: authUser,
    error: authError,
  } = await supabaseAdmin.auth.admin.getUserById(
    data.profile_id
  );

  if (authError) {
    console.error(authError);
    throw new Error(authError.message);
  }

  const phone = formatPakistaniPhone(
    authUser.user.phone
  );

  // Normalize Supabase relations
  const profile = Array.isArray(data.profile)
    ? data.profile[0]
    : data.profile;

  const doctor = Array.isArray(data.doctor)
    ? data.doctor[0]
    : data.doctor;

  return {
    ...data,
    profile: profile ?? null,
    doctor: doctor ?? null,
    email: authUser.user.email || "",
    phone,
  };
}
export async function updatePatient(
  id: string,
  formData: any
) {
  const supabase = await createClient();


  // pehle patient update
  const { data: patient, error: patientError } =
    await supabase
      .from("patients")
      .update({
        date_of_birth: formData.date_of_birth,
        blood_group: formData.blood_group,
        primary_doctor_id: formData.primary_doctor_id || null,
        stay_address: formData.stay_address,
        permanent_address: formData.permanent_address,
      })
      .eq("id", id)
      .select("profile_id")
      .single();


  if (patientError) {
    throw new Error(patientError.message);
  }


  // phir profile update
  const { error: profileError } =
    await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        gender: formData.gender,
        country: formData.country,
        state: formData.state,
        city: formData.city,
      })
      .eq("id", patient.profile_id);


  if (profileError) {
    throw new Error(profileError.message);
  }
 // 4. Password update
  // Password empty ho to purana password same rahega
  if (formData.password) {
    const { error: passwordError } =
      await supabaseAdmin.auth.admin.updateUserById(
        patient.profile_id,
        {
          password: formData.password,
        }
      );

    if (passwordError) {
      throw new Error(passwordError.message);
    }
  }
 if (formData.phone) {
  const phone = formData.phone.startsWith("03")
    ? "+92" + formData.phone.slice(1)
    : formData.phone;

  const { error: phoneError } =
    await supabaseAdmin.auth.admin.updateUserById(
      patient.profile_id,
      {
        phone,
      }
    );

  if (phoneError) {
    throw new Error(phoneError.message);
  }
}

  return patient;

}


export async function deletePatient(id: string) {
  const supabase = await createClient();

  try {
    // 1. Get patient (profile_id)
    const { data: patient, error: patientError } =
      await supabase
        .from("patients")
        .select("profile_id")
        .eq("id", id)
        .single();

    if (patientError) {
      throw new Error(patientError.message);
    }

    // 2. Patient record delete
    const { error: deletePatientError } =
      await supabase
        .from("patients")
        .delete()
        .eq("id", id);

    if (deletePatientError) {
      throw new Error(deletePatientError.message);
    }

    // 3. Profile delete
    const { error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("id", patient.profile_id);

    if (profileError) {
      // Patient profile is linked with activity logs
      if (
        profileError.message.includes(
          "activity_logs_actor_id_fkey"
        )
      ) {
        return {
          success: false,
          error:
            "This patient cannot be deleted because their profile is linked to activity records.",
        };
      }

      throw new Error(profileError.message);
    }

    // 4. Auth user delete
    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(
        patient.profile_id
      );

    if (authError) {
      throw new Error(authError.message);
    }

    return {
      success: true,
    };
  } catch (error: any) {
    // Expected activity-log dependency error
    if (
      error?.message?.includes(
        "activity_logs_actor_id_fkey"
      )
    ) {
      return {
        success: false,
        error:
          "This patient cannot be deleted because their profile is linked to activity records.",
      };
    }

    return {
      success: false,
      error:
        error?.message ||
        "Unable to delete this patient. Please try again.",
    };
  }
}



export type Doctor = {
  id: string;
  profile: {
    full_name: string;
  }[];
};
export async function getDoctors(): Promise<Doctor[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("doctors")
    .select(`
      id,
      profile:profiles ( full_name )
    `);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
 
  return data as Doctor[];
}

type CreatePatientInput = {
  email: string;
  password: string;
  phone: string;
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


export async function createPatient(formData: CreatePatientInput) {
  console.log("FORM IMAGE:", formData.imageFile);
  const supabase = await createClient();

    const phone = formData.phone.startsWith("03")
    ? "+92" + formData.phone.slice(1)
    : formData.phone;
  const { data: authUser, error: authError } =
  await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    phone: phone,
    password: formData.password,
    email_confirm: true,
    user_metadata: {
      full_name: formData.full_name,
      role: "patient",
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }
let avatar_url = null;
  // 2. Upload Image
 if (formData.imageFile) {

  const fileExt = formData.imageFile.name.split(".").pop();

  const fileName = `Patients/${Date.now()}.${fileExt}`;


  // Upload image
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, formData.imageFile);


  if (uploadError) {
    console.error(uploadError);
    throw new Error(uploadError.message);
  }


  // Create signed URL (5 years)
  const { data: urlData, error: urlError } =
    await supabase.storage
      .from("images")
      .createSignedUrl(
        fileName,
        60 * 60 * 24 * 365 * 5
      );


  if (urlError) {
    console.error(urlError);
    throw new Error(urlError.message);
  }


  avatar_url = urlData.signedUrl;

  console.log("SIGNED IMAGE URL:", avatar_url);
}

 // 3. Update Profile
const { error: profileUpdateError } =
  await supabaseAdmin
    .from("profiles")
    .update({
      full_name: formData.full_name,
      gender: formData.gender,
      country: formData.country,
      state: formData.state,
      city: formData.city,
        ...(avatar_url && { avatar_url }),
    })
    .eq("id", authUser.user.id);

if (profileUpdateError) {
  console.error(
    "Profile Update Error:",
    profileUpdateError
  );
}

  // 4. Insert Patient Data
  console.log("Patient Insert Data:", {
    profile_id: authUser.user.id,
    primary_doctor_id: formData.primary_doctor_id,
  });



 const { data: patient, error: patientError } = await supabase
  .from("patients")
  .insert({
    profile_id: authUser.user.id,
    date_of_birth: formData.date_of_birth,
    blood_group: formData.blood_group,
    primary_doctor_id: formData.primary_doctor_id,
    stay_address: formData.stay_address,
    permanent_address: formData.permanent_address,
  })
  .select()
  .single();

  if (patientError) {
    console.error(patientError);
    throw new Error(patientError.message);
  }

  return patient;
}
// Patient Detail page
export async function getPatientDetail(id: string) {
  const supabase = await createClient();

  const { data: rawPatient, error: patientError } =
    await supabase
      .from("patients")
      .select(`
        id,
        profile_id,
        date_of_birth,
        blood_group,
        stay_address,
        permanent_address,

        profile:profiles (
          full_name,
          gender,
          country,
          state,
          city,
          avatar_url
        ),

        doctor:doctors (
          id,
          specialization,
          profile:profiles (
            full_name
          )
        )
      `)
      .eq("id", id)
      .single();

  if (patientError) {
    console.error(
      "GET PATIENT DETAIL ERROR:",
      patientError
    );

    throw new Error(patientError.message);
  }

  console.log(
    "RAW PATIENT FROM DB:",
    rawPatient
  );

  // -----------------------------------
  // 2. Supabase relation normalize
  // -----------------------------------

  const patient: any = rawPatient;

  const profile = Array.isArray(patient.profile)
    ? patient.profile[0]
    : patient.profile;

  const doctor = Array.isArray(patient.doctor)
    ? patient.doctor[0]
    : patient.doctor;

  console.log(
    "PROFILE FROM DB:",
    profile
  );

  console.log(
    "DOCTOR FROM DB:",
    doctor
  );

  console.log(
    "PROFILE ID:",
    patient.profile_id
  );

  // -----------------------------------
  // 3. Email + Phone from Auth
  // -----------------------------------

  const {
    data: authUser,
    error: authError,
  } =
    await supabaseAdmin.auth.admin.getUserById(
      patient.profile_id
    );

  if (authError) {
    console.error(
      "GET AUTH USER ERROR:",
      authError
    );
  }

  console.log(
    "AUTH USER:",
    authUser?.user
  );

  // -----------------------------------
  // 4. Latest Appointment
  // -----------------------------------

  const {
    data: latestAppointment,
    error: appointmentError,
  } = await supabase
    .from("appointments")
    .select("appointment_date")
    .eq("patient_id", id)
    .order("appointment_date", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (appointmentError) {
    console.error(
      "GET PATIENT APPOINTMENT ERROR:",
      appointmentError
    );

    throw new Error(
      appointmentError.message
    );
  }

  console.log(
    "LATEST APPOINTMENT:",
    latestAppointment
  );

  // -----------------------------------
  // 5. Latest Vitals
  // -----------------------------------

  const {
    data: prescriptions,
    error: prescriptionError,
  } =
    await supabase
      .from("prescriptions")
      .select(`
        id,
        blood_pressure,
        temperature,
        pulse_rate,
        weight,
        height,
        spo2,
        created_at
      `)
      .eq("patient_id", id)
      .order("created_at", {
        ascending: false,
      })
      .limit(1);

  if (prescriptionError) {
    console.error(
      "GET PATIENT VITALS ERROR:",
      prescriptionError
    );

    throw new Error(
      prescriptionError.message
    );
  }

  const latestVitals =
    prescriptions?.[0] ?? null;

  console.log(
    "LATEST VITALS:",
    latestVitals
  );

  // -----------------------------------
  // 6. Patient Image
  // -----------------------------------

  const avatarUrl =
    profile?.avatar_url ?? null;

  // -----------------------------------
  // 7. Final Patient Data
  // -----------------------------------

  const patientData = {
    id: patient.id,

    code: `#PT${patient.id.slice(-4)}`,

    // From profiles
    full_name:
      profile?.full_name ?? "Unknown",

    // From Supabase Storage
    avatar_url: avatarUrl,

    // From patients
    address:
      patient.stay_address ||
      patient.permanent_address ||
      "—",

    // From auth.users
    phone:
      formatPakistaniPhone(
        authUser?.user?.phone
      ),

    // From appointments
    last_visit:
      latestAppointment?.appointment_date
        ? new Date(
            latestAppointment.appointment_date
          ).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—",

    // From patients
    dob: patient.date_of_birth
      ? new Date(
          patient.date_of_birth
        ).toLocaleDateString(
          "en-US",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "—",

    // From patients
    blood_group:
      patient.blood_group ?? "—",

    // From profiles
    gender:
      profile?.gender ?? "—",

    // From auth.users
    email:
      authUser?.user?.email ?? "—",

    // Latest prescription
    vitals: {
      blood_pressure:
        latestVitals?.blood_pressure ??
        "—",

      heart_rate:
        latestVitals?.pulse_rate != null
          ? `${latestVitals.pulse_rate} Bpm`
          : "—",

      spo2:
        latestVitals?.spo2 != null
          ? `${latestVitals.spo2} %`
          : "—",

      temperature:
        latestVitals?.temperature != null
          ? `${latestVitals.temperature} F`
          : "—",

      weight:
        latestVitals?.weight != null
          ? `${latestVitals.weight} kg`
          : "—",
    },
  };

  console.log(
    "FINAL PATIENT DETAIL:",
    patientData
  );

  return patientData;
}

// pateint grid view
export async function getPatientsForGrid() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("patients")
    .select(`
      id,
      blood_group,
      stay_address,
      profile:profiles (
        full_name,
        gender,
        avatar_url
      )
    `);

  if (error) {
    console.error("GET PATIENTS FOR GRID ERROR:", error);
    throw new Error(error.message);
  }

  const updatedPatients = await Promise.all(
    data.map(async (patient: any) => {
      // Profile relation ko object mein normalize karo
      const profile = Array.isArray(patient.profile)
        ? patient.profile[0]
        : patient.profile;

      // Patient image
      if (profile?.avatar_url) {
        const path = profile.avatar_url.split("/images/")[1];

        if (path) {
          const { data: image } = await supabase.storage
            .from("images")
            .createSignedUrl(
              path,
              60 * 60 * 24 * 365 * 5
            );

          if (image?.signedUrl) {
            profile.avatar_url = image.signedUrl;
          }
        }
      }

      // Last visit
      const { data: latestAppointment } = await supabase
        .from("appointments")
        .select("appointment_date")
        .eq("patient_id", patient.id)
        .order("appointment_date", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      const last_visit = latestAppointment?.appointment_date
        ? new Date(
            latestAppointment.appointment_date
          ).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—";

      return {
        id: patient.id,
        profile: profile ?? null,
        blood_group: patient.blood_group ?? "—",
        stay_address: patient.stay_address ?? "—",
        last_visit,
      };
    })
  );

  console.log("GRID PATIENTS:", updatedPatients);

  return updatedPatients;
}