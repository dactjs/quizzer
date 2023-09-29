import { colors } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { esES as materialEsEs } from "@mui/material/locale";
import { esES as dataGridEsEs } from "@mui/x-data-grid/locales";
import { esES as pickersEsEs } from "@mui/x-date-pickers/locales";

export const theme = createTheme(
  {
    palette: {
      mode: "dark",
      primary: colors.blueGrey,
      secondary: colors.teal,
    },
  },
  pickersEsEs,
  dataGridEsEs,
  materialEsEs
);

export default theme;
