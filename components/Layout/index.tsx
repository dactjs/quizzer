"use client";

import { Box } from "@mui/material";

import { Header, Footer } from "./components";
import { LAYOUT_SIZES } from "./config";

export interface LayoutProps {
  hideFooter?: boolean;
}

export const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  hideFooter = false,
  children,
}) => (
  <Box
    sx={{
      position: "relative",
      display: "grid",
      gridTemplateColumns: "1fr",
      gridTemplateRows: !hideFooter
        ? `${LAYOUT_SIZES.HEADER_HEIGHT} 1fr auto`
        : `${LAYOUT_SIZES.HEADER_HEIGHT} 1fr`,

      width: "100vw",
      height: "100vh",
      overflow: "hidden",
    }}
  >
    <Header />

    <Box sx={{ display: "grid", height: "100%", overflow: "auto" }}>
      {children}
    </Box>

    {!hideFooter && <Footer />}
  </Box>
);

export * from "./config";
