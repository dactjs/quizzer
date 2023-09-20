"use client";

import { Session } from "next-auth";
import { Box, Paper, Stack, Typography, Avatar } from "@mui/material";

export interface AdminDashboardDrawerHeaderProps {
  session: Session;
}

export const AdminDashboardDrawerHeader: React.FC<
  AdminDashboardDrawerHeaderProps
> = ({ session }) => (
  <Box sx={{ padding: (theme) => theme.spacing(1) }}>
    <Stack
      component={Paper}
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        height: "100%",
        padding: (theme) => theme.spacing(0.75),
        borderRadius: (theme) => theme.spacing(1),
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ width: "100%", height: "100%" }}
      >
        <Avatar
          src={session.user?.image as string}
          alt={session.user?.name as string}
          sx={{ width: 40, height: 40 }}
        />

        <Stack sx={{ width: "100%" }}>
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              lineClamp: 1,
              textOverflow: "ellipsis",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {session.user?.name}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              lineClamp: 1,
              textOverflow: "ellipsis",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {session.user?.email}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  </Box>
);

export default AdminDashboardDrawerHeader;
