import { withAuth } from "next-auth/middleware";

import { PAGES } from "@/constants";
import { UserStatus, UserRole } from "@/types";

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      if (!token) return false;

      if (token.status === UserStatus.DISABLED) return false;

      const isAdminSection = req.nextUrl.pathname.startsWith(PAGES.ADMIN_ROOT);

      if (isAdminSection && token.role !== UserRole.ADMIN) return false;

      return true;
    },
  },
  pages: {
    signIn: PAGES.SIGN_IN,
    error: PAGES.SIGN_IN,
  },
});

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - public (public pages)
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!public|api|_next/static|_next/image|favicon.ico).*)"],
};
