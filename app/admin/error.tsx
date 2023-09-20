"use client";

import { Box, Button } from "@mui/material";
import { RestartAlt as ResetIcon } from "@mui/icons-material";

import { ErrorInfo } from "@/components";

interface AdminErrorProps {
  error: Error;
  reset: () => void;
}

const AdminError: React.FC<AdminErrorProps> = ({ error, reset }) => (
  <Box
    sx={{
      display: "grid",
      placeContent: "center",
      placeItems: "center",
      width: "100%",
      height: "100%",
      padding: (theme) => theme.spacing(4),
      overflow: "auto",
    }}
  >
    <ErrorInfo error={error} />

    <Button
      variant="contained"
      size="small"
      endIcon={<ResetIcon />}
      onClick={reset}
    >
      Intentar otra vez
    </Button>
  </Box>
);

export default AdminError;
