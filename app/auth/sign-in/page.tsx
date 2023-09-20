"use client";

import { useCallback } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import {
  Box,
  Paper,
  Unstable_Grid2,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import {
  LockOutlined as LockOutlinedIcon,
  GitHub as GitHubIcon,
  Google as GoogleIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

import { sideImage__dark } from "./_assets";

interface SignInPageProps {
  searchParams: Record<string, string>;
}

const SignInPage: React.FC<SignInPageProps> = ({ searchParams }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleSignIn = useCallback(
    async (provider: "github" | "google") => {
      try {
        const response = await signIn(provider, {
          ...("callbackUrl" in searchParams && {
            callbackUrl: searchParams.callbackUrl,
          }),
        });

        if (response?.error) {
          enqueueSnackbar(response.error, { variant: "error" });
          return;
        }
      } catch (error) {
        enqueueSnackbar(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error al iniciar sesión, inténtelo de nuevo. Si el error persiste, contacte al soporte",
          { variant: "error" }
        );
      }
    },
    [searchParams, enqueueSnackbar]
  );

  return (
    <Unstable_Grid2
      container
      sx={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    >
      <Unstable_Grid2
        xs={0}
        sm={6}
        md={8}
        sx={{ position: "relative", backgroundColor: "grey.50" }}
      >
        <Image
          priority
          alt="Imagen de fondo del inicio de sesión"
          src={sideImage__dark}
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </Unstable_Grid2>

      <Unstable_Grid2
        component={Paper}
        square
        xs={12}
        sm={6}
        md={4}
        elevation={6}
        sx={{ position: "relative", paddingX: 4 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            marginTop: 8,
            marginBottom: 6,
          }}
        >
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>

          <Typography variant="h5" align="center">
            Iniciar sesión
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Button
            size="large"
            variant="contained"
            endIcon={<GitHubIcon fontSize="large" />}
            onClick={() => handleSignIn("github")}
            sx={{
              color: "white",
              backgroundColor: "grey.900",
              ":hover": {
                color: "white",
                backgroundColor: "grey.900",
                opacity: 0.5,
              },
            }}
          >
            Iniciar sesión con GitHub
          </Button>

          <Button
            size="large"
            variant="contained"
            endIcon={<GoogleIcon fontSize="large" />}
            onClick={() => handleSignIn("google")}
            sx={{
              color: "white",
              backgroundColor: "tomato",
              ":hover": {
                color: "white",
                backgroundColor: "tomato",
                opacity: 0.5,
              },
            }}
          >
            Iniciar sesión con Google
          </Button>

          <Typography
            variant="body1"
            align="center"
            fontWeight="bold"
            sx={{ display: "block", marginTop: 2 }}
          >
            Al iniciar sesión, aceptas nuestros términos y condiciones y
            política de privacidad.
          </Typography>
        </Box>

        <Box sx={{ marginTop: 5 }}>
          <Typography
            variant="caption"
            align="center"
            fontWeight="bolder"
            color="GrayText"
            sx={{ display: "block" }}
          >
            {`© ${new Date().getFullYear()} - Todos los derechos reservados`}
          </Typography>
        </Box>
      </Unstable_Grid2>
    </Unstable_Grid2>
  );
};

export default SignInPage;
