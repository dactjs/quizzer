"use client";

import { Paper, Typography } from "@mui/material";

export const Footer: React.FC = () => (
  <Paper
    sx={{
      width: "100%",
      height: "100%",
      padding: (theme) => theme.spacing(2),
      borderTopLeftRadius: (theme) => theme.spacing(1.5),
      borderTopRightRadius: (theme) => theme.spacing(1.5),
    }}
  >
    <Typography textAlign="center" fontWeight="bold">
      © Quizzer {new Date().getFullYear()}
    </Typography>
  </Paper>
);

export default Footer;
