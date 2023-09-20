export { default } from "next-auth/middleware";

export const config = { matcher: "/((?!favicon.ico|static|auth|api).*)" };
