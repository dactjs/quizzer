import { UserStatus } from "@/types";

export function translateUserStatus(status: string): string {
  const translations: Record<string, string> = {
    [UserStatus.ENABLED]: "Habilitado",
    [UserStatus.DISABLED]: "Deshabilitado",
  };

  return translations[status] || status;
}

export default translateUserStatus;
