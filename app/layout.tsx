import { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeRegistry } from "@/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quizzer",
  viewport: "initial-scale=1, width=device-width",
};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <html lang="es">
    <body className={inter.className}>
      <ThemeRegistry options={{ key: "mui" }}>{children}</ThemeRegistry>
    </body>
  </html>
);

export default RootLayout;
