"use client";

import { SessionProvider } from "next-auth/react";

export const SessionContext: React.FC<React.PropsWithChildren> = ({
  children,
}) => <SessionProvider>{children}</SessionProvider>;

export default SessionContext;
