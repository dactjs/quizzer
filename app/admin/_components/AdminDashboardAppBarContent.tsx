"use client";

import { useRouter } from "next/navigation";
import { Stack, IconButton, Tooltip } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

export const AdminDashboardAppBarContent: React.FC = () => {
  const router = useRouter();

  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      sx={{ width: "100%" }}
    >
      <Tooltip title="Refrescar datos">
        <IconButton size="small" onClick={() => router.refresh()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default AdminDashboardAppBarContent;
