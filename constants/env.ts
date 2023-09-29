export const ENV = {
  // Server
  DATABASE_URL: process.env.DATABASE_URL as string,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL as string, // Optional on Vercel but required on other hosts
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID as string,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  ROOT_USER_EMAIL: process.env.ROOT_USER_EMAIL as string,
  ROOT_USER_NAME: process.env.ROOT_USER_NAME as string,

  // Client
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL as string,
} as const;

const isBrowser = typeof window !== "undefined";

const missing = isBrowser
  ? Object.entries(ENV)
      .filter(([key]) => key.startsWith("NEXT_PUBLIC"))
      .some(([, value]) => !value)
  : Object.entries(ENV)
      .filter(([key]) => key !== "NEXTAUTH_URL") // Optional on Vercel but required on other hosts
      .some(([_, value]) => !value);

if (missing) throw new Error("Missing environment variables");

export default ENV;
