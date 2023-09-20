"use client";

import { Box, Typography } from "@mui/material";

import { LAYOUT_SIZES } from "../config";

export const Header: React.FC = () => (
  <Box
    sx={{
      position: "sticky",
      top: 0,
      zIndex: (theme) => theme.zIndex.modal - 1,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: (theme) => theme.spacing(2),
      height: LAYOUT_SIZES.HEADER_HEIGHT,
      padding: (theme) => theme.spacing(2, 4),
      borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      backgroundColor: "transparent",
      backdropFilter: "blur(8px)",
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontFamily: "monospace",
        fontWeight: "bolder",
        letterSpacing: "0.1em",
      }}
    >
      📝 Quizzer
    </Typography>
  </Box>
);

export default Header;
