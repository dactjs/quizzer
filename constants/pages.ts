export const PAGES = {
  // Auth
  SIGN_IN: "/auth/sign-in",

  // Public
  PUBLIC_CERTIFICATES: "/public/certificates",

  // User
  ROOT: "/",
  CONVOCATORIES: "/convocatories",

  // Admin
  ADMIN_ROOT: "/admin",
  ADMIN_AGENDA: "/admin/agenda",
  ADMIN_QUIZZES: "/admin/quizzes",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_USERS: "/admin/users",
  ADMIN_SETTINGS: "/admin/settings",
} as const;

export default PAGES;
