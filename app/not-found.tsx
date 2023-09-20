import { Metadata } from "next";
import { Container } from "@mui/material";

import { NotFound } from "@/components";
import { Layout } from "@/components/Layout";
import { PAGES } from "@/constants";

export const metadata: Metadata = {
  title: "404: Recurso no encontrado",
};

const RootNotFound: React.FC = () => (
  <Layout>
    <Container fixed sx={{ paddingY: 2 }}>
      <NotFound fallbackUrl={PAGES.ROOT} />
    </Container>
  </Layout>
);

export default RootNotFound;
