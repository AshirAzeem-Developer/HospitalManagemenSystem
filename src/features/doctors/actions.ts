"use server";

import {
  contactInfoSchema,
  AddressInfoSchema,
  DoctorSchedulesSchema,
  editContactInfoSchema,
} from "./schema";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function addDoctorAction(formData: unknown) {
  try {
    // ---------------------------------------
    // 1. Get contact + address data
    // ---------------------------------------

    const data = formData as {
      contact: unknown;
      address: unknown;
      schedules: unknown;
    };

    // ---------------------------------------
    // 2. Validate contact information
    // ---------------------------------------

    const parsedContact = contactInfoSchema.safeParse(data.contact);

    if (!parsedContact.success) {
      console.log(
        "CONTACT SCHEMA ERRORS:",
        parsedContact.error.flatten().fieldErrors,
      );

      return {
        success: false,
        errors: parsedContact.error.flatten().fieldErrors,
      };
    }

    // ---------------------------------------
    // 3. Validate address information
    // ---------------------------------------

    const parsedAddress = AddressInfoSchema.safeParse(data.address);

    if (!parsedAddress.success) {
      console.log(
        "ADDRESS SCHEMA ERRORS:",
        parsedAddress.error.flatten().fieldErrors,
      );

      return {
        success: false,
        errors: parsedAddress.error.flatten().fieldErrors,
      };
    }

    // ---------------------------------------
    // 4. Validate appointment schedules
    // ---------------------------------------

    const parsedSchedules = DoctorSchedulesSchema.safeParse(data.schedules);

    if (!parsedSchedules.success) {
      console.log(
        "SCHEDULE SCHEMA ERRORS:",
        parsedSchedules.error.flatten().fieldErrors,
      );

      return {
        success: false,
        errors: parsedSchedules.error.flatten().fieldErrors,
      };
    }
    console.log("SCHEDULE DATA:", parsedSchedules.data);
    console.log("CONTACT DATA:", parsedContact.data);
    console.log("ADDRESS DATA:", parsedAddress.data);

    // ---------------------------------------
    // 4. Create Supabase client
    // ---------------------------------------

    const supabase = await createClient();

    // ---------------------------------------
    // 5. Upload profile image
    // ---------------------------------------

    const file = parsedContact.data.profileImage;

    if (!file) {
      return {
        success: false,
        error: "Profile image is required",
      };
    }

    const fileName = `${crypto.randomUUID()}-${file.name}`;
    const filePath = `Doctors/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        upsert: false,
      });

    if (uploadError) {
      console.error("IMAGE UPLOAD ERROR:", uploadError);

      return {
        success: false,
        error: uploadError.message,
      };
    }

    // ---------------------------------------
    // 6. Create signed image URL
    // ---------------------------------------

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("images")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 5);

    if (signedUrlError) {
      console.error("SIGNED URL ERROR:", signedUrlError);

      return {
        success: false,
        error: signedUrlError.message,
      };
    }

    const signedAvatarUrl = signedUrlData.signedUrl;

    // ---------------------------------------
    // 7. Format phone number
    // ---------------------------------------

    const phone = parsedContact.data.phone.trim();

    const formattedPhone = phone.startsWith("03")
      ? `+92${phone.slice(1)}`
      : phone;

    // ---------------------------------------
    // 8. Create Auth user
    // ---------------------------------------

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: parsedContact.data.email,
        password: parsedContact.data.password,
        phone: formattedPhone,
        email_confirm: true,
        user_metadata: {
          full_name: parsedContact.data.fullName,
          role: "doctor",
        },
      });

    if (authError) {
      console.error("AUTH CREATE ERROR:", authError);

      return {
        success: false,
        error: authError.message,
      };
    }

    // ---------------------------------------
    // 9. Update profile
    // ---------------------------------------

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        avatar_url: signedAvatarUrl,
        gender: parsedContact.data.gender,
        full_name: parsedContact.data.fullName,
        role: "doctor",

        // ADDRESS
        country: parsedAddress.data.country,
        state: parsedAddress.data.state,
        city: parsedAddress.data.city,
      })
      .eq("id", authUser.user.id);

    if (profileError) {
      console.error("PROFILE UPDATE ERROR:", profileError);

      return {
        success: false,
        error: profileError.message,
      };
    }

    // ---------------------------------------
    // 10. Create doctor record
    // ---------------------------------------

    // ---------------------------------------
    // 10. Create doctor record
    // ---------------------------------------

    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .insert({
        profile_id: authUser.user.id,
        specialization: parsedContact.data.specialization,
        qualification: parsedContact.data.qualification,
        consultation_fee: parsedContact.data.consultationFee,
        bio: parsedContact.data.bio,
        status: parsedContact.data.status,
      })
      .select("id")
      .single();

    if (doctorError) {
      console.error("DOCTOR INSERT ERROR:", doctorError);

      return {
        success: false,
        error: doctorError.message,
      };
    }

    // ---------------------------------------
    // 12. Create doctor schedules
    // ---------------------------------------

    const scheduleRows = parsedSchedules.data.map((schedule) => ({
      doctor_id: doctor.id,
      day_of_week: schedule.dayOfWeek,
      start_time: schedule.startTime,
      end_time: schedule.endTime,
      slot_duration_minutes: schedule.slotDurationMinutes,
      is_active: schedule.isActive,
    }));

    const { error: scheduleError } = await supabase
      .from("doctor_schedules")
      .insert(scheduleRows);

    if (scheduleError) {
      console.error("SCHEDULE INSERT ERROR:", scheduleError);

      return {
        success: false,
        error: scheduleError.message,
      };
    }

    // ---------------------------------------
    // 11. Success
    // ---------------------------------------

    return {
      success: true,
      avatarUrl: signedAvatarUrl,
    };
  } catch (err) {
    console.error("========== SERVER ACTION ERROR ==========");
    console.error(err);
    console.error("==========================================");

    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown server error",
    };
  }
}

export async function deleteDoctorAction(doctorId: string, profileId: string) {
  try {
    // ---------------------------------------
    // 1. Validate IDs
    // ---------------------------------------

    if (!doctorId || !profileId) {
      return {
        success: false,
        error: "Invalid doctor information.",
      };
    }

    // ---------------------------------------
    // 2. Delete doctor schedules
    // ---------------------------------------

    const { error: scheduleError } = await supabaseAdmin
      .from("doctor_schedules")
      .delete()
      .eq("doctor_id", doctorId);

    if (scheduleError) {
      console.error("DELETE SCHEDULE ERROR:", scheduleError);

      return {
        success: false,
        error: scheduleError.message,
      };
    }

    // ---------------------------------------
    // 3. Delete doctor record
    // ---------------------------------------

    const { error: doctorError } = await supabaseAdmin
      .from("doctors")
      .delete()
      .eq("id", doctorId);

    if (doctorError) {
      console.error("DELETE DOCTOR ERROR:", doctorError);

      if (doctorError.code === "23503") {
        return {
          success: false,
          error:
            "This doctor cannot be deleted because they are assigned to one or more patients. Please reassign the patients first.",
        };
      }

      return {
        success: false,
        error: "Unable to delete doctor. Please try again.",
      };
    }

    // ---------------------------------------
    // 4. Delete Auth user
    // ---------------------------------------

    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(profileId);

    if (authError) {
      console.error("DELETE AUTH USER ERROR:", authError);

      return {
        success: false,
        error: authError.message,
      };
    }

    // ---------------------------------------
    // 5. Success
    // ---------------------------------------

    return {
      success: true,
      message: "Doctor deleted successfully.",
    };
  } catch (error) {
    console.error("========== DELETE DOCTOR ERROR ==========");
    console.error(error);
    console.error("==========================================");

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unable to delete doctor.",
    };
  }
}


export async function updateDoctorAction(
  doctorId: string,
  profileId: string,
  formData: unknown,
) {
  try {
    // ---------------------------------------
    // 1. Validate IDs
    // ---------------------------------------

    if (!doctorId || !profileId) {
      return {
        success: false,
        error: "Invalid doctor information.",
      };
    }

    // ---------------------------------------
    // 2. Get submitted data
    // ---------------------------------------

    const data = formData as {
      contact: unknown;
      address: unknown;
      schedules: unknown;
    };

    // ---------------------------------------
    // 3. Validate contact information
    // ---------------------------------------

    const parsedContact = editContactInfoSchema.safeParse(data.contact);

    if (!parsedContact.success) {
      console.log(
        "EDIT CONTACT ERRORS:",
        parsedContact.error.flatten().fieldErrors,
      );

      return {
        success: false,
        errors: parsedContact.error.flatten().fieldErrors,
      };
    }

    // ---------------------------------------
    // 4. Validate address information
    // ---------------------------------------

    const parsedAddress = AddressInfoSchema.safeParse(data.address);

    if (!parsedAddress.success) {
      console.log(
        "EDIT ADDRESS ERRORS:",
        parsedAddress.error.flatten().fieldErrors,
      );

      return {
        success: false,
        errors: parsedAddress.error.flatten().fieldErrors,
      };
    }

    // ---------------------------------------
    // 5. Validate schedules
    // ---------------------------------------

    const parsedSchedules = DoctorSchedulesSchema.safeParse(data.schedules);

    if (!parsedSchedules.success) {
      console.log(
        "EDIT SCHEDULE ERRORS:",
        parsedSchedules.error.flatten().fieldErrors,
      );

      return {
        success: false,
        errors: parsedSchedules.error.flatten().fieldErrors,
      };
    }

    // ---------------------------------------
    // 6. Create Supabase client
    // ---------------------------------------

    const supabase = await createClient();

    // ---------------------------------------
    // 7. Update profile
    // ---------------------------------------

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: parsedContact.data.fullName,
        gender: parsedContact.data.gender,

        country: parsedAddress.data.country,
        state: parsedAddress.data.state,
        city: parsedAddress.data.city,
      })
      .eq("id", profileId);

    if (profileError) {
      console.error("EDIT PROFILE ERROR:", profileError);

      return {
        success: false,
        error: profileError.message,
      };
    }

    // ---------------------------------------
    // 8. Update doctor information
    // ---------------------------------------

    const { error: doctorError } = await supabase
      .from("doctors")
      .update({
        specialization: parsedContact.data.specialization,
        qualification: parsedContact.data.qualification,
        consultation_fee: parsedContact.data.consultationFee,
        bio: parsedContact.data.bio,
        status: parsedContact.data.status,
      })
      .eq("id", doctorId);

    if (doctorError) {
      console.error("EDIT DOCTOR ERROR:", doctorError);

      return {
        success: false,
        error: doctorError.message,
      };
    }

    // ---------------------------------------
    // 9. Update phone if needed
    // ---------------------------------------

    const phone = parsedContact.data.phone.trim();

    const formattedPhone = phone.startsWith("03")
      ? `+92${phone.slice(1)}`
      : phone;

    // ---------------------------------------
    // 10. Update Auth user
    // ---------------------------------------

    const authUpdateData: {
      phone: string;
      password?: string;
    } = {
      phone: formattedPhone,
    };

    // Only update password if admin entered one
    if (parsedContact.data.password) {
      authUpdateData.password = parsedContact.data.password;
    }

    const { error: authError } =
      await supabaseAdmin.auth.admin.updateUserById(
        profileId,
        authUpdateData,
      );

    if (authError) {
      console.error("EDIT AUTH ERROR:", authError);

      return {
        success: false,
        error: authError.message,
      };
    }

    // ---------------------------------------
    // 11. Handle profile image
    // ---------------------------------------

    const file = parsedContact.data.profileImage;

    if (file) {
      const fileName = `${crypto.randomUUID()}-${file.name}`;
      const filePath = `Doctors/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          upsert: false,
        });

      if (uploadError) {
        console.error("EDIT IMAGE UPLOAD ERROR:", uploadError);

        return {
          success: false,
          error: uploadError.message,
        };
      }

      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("images")
          .createSignedUrl(
            filePath,
            60 * 60 * 24 * 365 * 5,
          );

      if (signedUrlError) {
        console.error("EDIT SIGNED URL ERROR:", signedUrlError);

        return {
          success: false,
          error: signedUrlError.message,
        };
      }

      const { error: imageProfileError } = await supabase
        .from("profiles")
        .update({
          avatar_url: signedUrlData.signedUrl,
        })
        .eq("id", profileId);

      if (imageProfileError) {
        console.error(
          "EDIT PROFILE IMAGE ERROR:",
          imageProfileError,
        );

        return {
          success: false,
          error: imageProfileError.message,
        };
      }
    }

    // ---------------------------------------
    // 12. Replace doctor schedules
    // ---------------------------------------

    const { error: deleteScheduleError } = await supabase
      .from("doctor_schedules")
      .delete()
      .eq("doctor_id", doctorId);

    if (deleteScheduleError) {
      console.error(
        "EDIT DELETE SCHEDULE ERROR:",
        deleteScheduleError,
      );

      return {
        success: false,
        error: deleteScheduleError.message,
      };
    }

    const scheduleRows = parsedSchedules.data.map((schedule) => ({
      doctor_id: doctorId,
      day_of_week: schedule.dayOfWeek,
      start_time: schedule.startTime,
      end_time: schedule.endTime,
      slot_duration_minutes: schedule.slotDurationMinutes,
      is_active: schedule.isActive,
    }));

    const { error: scheduleError } = await supabase
      .from("doctor_schedules")
      .insert(scheduleRows);

    if (scheduleError) {
      console.error("EDIT SCHEDULE ERROR:", scheduleError);

      return {
        success: false,
        error: scheduleError.message,
      };
    }

    // ---------------------------------------
    // 13. Success
    // ---------------------------------------

    return {
      success: true,
      message: "Doctor updated successfully.",
    };
  } catch (error) {
    console.error("========== UPDATE DOCTOR ERROR ==========");
    console.error(error);
    console.error("==========================================");

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to update doctor.",
    };
  }
}