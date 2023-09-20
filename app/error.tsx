"use client";

import { Backdrop, Button } from "@mui/material";
import { RestartAlt as ResetIcon } from "@mui/icons-material";

import { ErrorInfo } from "@/components";

interface RootErrorProps {
  error: Error;
  reset: () => void;
}

const RootError: React.FC<RootErrorProps> = ({ error, reset }) => (
  <Backdrop
    open
    invisible
    sx={{
      display: "grid",
      placeContent: "center",
      placeItems: "center",
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
  </Backdrop>
);

export default RootError;
