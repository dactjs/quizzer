import { Container, Typography } from "@mui/material";

import { Layout } from "@/components/Layout";

const RootPage: React.FC = () => (
  <Layout>
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
    </Container>
  </Layout>
);

export default RootPage;
