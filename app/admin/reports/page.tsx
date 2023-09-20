import { Metadata } from "next";
import { Container, Unstable_Grid2 } from "@mui/material";

import { QuizzesConvocatoriesPerMonthChart } from "@/features";
import { Widget } from "@/components";

export const metadata: Metadata = {
  title: "Reportes",
};

const ReportsPage: React.FC = () => (
  <Container
    fixed
    sx={{
      display: "grid",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "1fr",
      paddingY: 2,
    }}
  >
    <Unstable_Grid2
      container
      justifyContent="center"
      alignItems="center"
      spacing={1}
      sx={{ height: "fit-content" }}
    >
      <Unstable_Grid2 xs={12}>
        <Widget>
          <QuizzesConvocatoriesPerMonthChart />
        </Widget>
      </Unstable_Grid2>
    </Unstable_Grid2>
  </Container>
);

export default ReportsPage;
