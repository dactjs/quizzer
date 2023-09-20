"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ThemeProvider, CssBaseline, GlobalStyles } from "@mui/material";
import {
  Cancel as CancelIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ConfirmProvider } from "material-ui-confirm";
import { SnackbarProvider } from "notistack";
import { CacheProvider } from "@emotion/react";
import createCache, { Options as CacheOptions } from "@emotion/cache";
import dateFnsEs from "date-fns/locale/es";

import theme from "./theme";

export interface ThemeRegistryProps {
  options: CacheOptions;
}

export const ThemeRegistry: React.FC<
  React.PropsWithChildren<ThemeRegistryProps>
> = ({ options, children }) => {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache(options);

    cache.compat = true;

    const prevInsert = cache.insert;

    let inserted: string[] = [];

    cache.insert = (...args) => {
      const serialized = args[1];

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }

      return prevInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;

      inserted = [];

      return prevInserted;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();

    if (names.length === 0) return null;

    let styles = "";

    for (const name of names) {
      styles += cache.inserted[name];
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={dateFnsEs}
        >
          <CssBaseline />

          <GlobalStyles
            styles={{
              "*": {
                "&::-webkit-scrollbar": {
                  width: theme.spacing(0.75),
                  height: theme.spacing(0.75),
                  backgroundColor: theme.palette.background.paper,
                },

                "&::-webkit-scrollbar-track": {
                  borderRadius: theme.spacing(1),
                  backgroundColor: theme.palette.background.paper,
                },

                "&::-webkit-scrollbar-thumb": {
                  borderRadius: theme.spacing(1),
                  backgroundColor: theme.palette.primary.main,
                },
              },
            }}
          />

          <ConfirmProvider
            defaultOptions={{
              dialogProps: { maxWidth: "xs" },
              contentProps: { dividers: true },

              cancellationText: "Cancelar",
              cancellationButtonProps: {
                variant: "contained",
                size: "small",
                color: "error",
                endIcon: <CancelIcon fontSize="small" />,
              },

              confirmationText: "Aceptar",
              confirmationButtonProps: {
                variant: "contained",
                size: "small",
                color: "primary",
                endIcon: <CheckIcon fontSize="small" />,
              },
            }}
          >
            <SnackbarProvider>{children}</SnackbarProvider>
          </ConfirmProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default ThemeRegistry;
