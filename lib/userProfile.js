export async function ensureUserProfile(supabase, authUser) {
  if (!authUser?.id) {
    return { profile: null, error: new Error("Missing authenticated user") };
  }

  const passwordPlaceholder = "managed-by-supabase-auth";

  const { data: existingProfile, error: selectError } = await supabase
    .from("users")
    .select("id, role")
    .eq("email_user", authUser.id)
    .maybeSingle();

  if (selectError) {
    return { profile: null, error: selectError };
  }

  if (existingProfile) {
    return { profile: existingProfile, error: null };
  }

  const { data: insertedProfile, error: insertError } = await supabase
    .from("users")
    .insert({
      email_user: authUser.id,
      role: false,
      password: passwordPlaceholder,
    })
    .select("id, role")
    .single();

  if (insertError) {
    return { profile: null, error: insertError };
  }

  return { profile: insertedProfile, error: null };
}
