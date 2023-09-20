import { Container, Typography } from "@mui/material";

const DashboardPage: React.FC = () => (
  <Container
    fixed
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 0.25,
      paddingY: 2,
    }}
  >
    <Typography variant="h4" align="center" fontWeight="bolder">
      Bienvenido a Quizzer 📝
    </Typography>

    <Typography variant="body1" align="center" color="text.secondary">
      Para comenzar, selecciona una opción del menú lateral.
    </Typography>
  </Container>
);

export default DashboardPage;
