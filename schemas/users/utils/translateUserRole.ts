import { UserRole } from "@/types";

export function translateUserRole(role: string): string {
  const translations: Record<string, string> = {
    [UserRole.ADMIN]: "Administrator",
    [UserRole.USER]: "Estándar",
  };

  return translations[role] || role;
}

export default translateUserRole;
