import { Metadata } from "next";
import { Container } from "@mui/material";

import { QuizzesConvocatoriesScheduler } from "@/features";
import { Widget } from "@/components";

export const metadata: Metadata = {
  title: "Agenda",
};

const AgendaPage: React.FC = () => (
  <Container
    fixed
    sx={{
      display: "grid",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "1fr",
      paddingY: 2,
    }}
  >
    <Widget disableDefaultSizes>
      <QuizzesConvocatoriesScheduler />
    </Widget>
  </Container>
);

export default AgendaPage;
