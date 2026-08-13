export function formatPakistaniPhone(
  phone: string | null | undefined
) {
  if (!phone) return "—";

  // +923163678909 → 03163678909
  if (phone.startsWith("+92")) {
    return "0" + phone.slice(3);
  }

  // 923163678909 → 03163678909
  if (phone.startsWith("92")) {
    return "0" + phone.slice(2);
  }

  // Already 03xxxxxxxxx
  if (phone.startsWith("03")) {
    return phone;
  }

  return phone;
}