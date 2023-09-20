import { Metadata } from "next";
import { Container, Unstable_Grid2 } from "@mui/material";

import { QuizzesDataGrid } from "@/features";
import { Widget } from "@/components";
import { ENV, ENDPOINTS } from "@/constants";
import { Quiz } from "@/types";

import { GetResponse } from "@/app/api/quizzes/route";

export const metadata: Metadata = {
  title: "Exámenes",
};

const QuizzesPage: React.FC = async () => {
  const quizzes = await getQuizzes();

  const title = `Exámenes (${quizzes.length.toLocaleString()})`;

  return (
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
          <Widget height={500}>
            <QuizzesDataGrid title={title} quizzes={quizzes} />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  );
};

async function getQuizzes(): Promise<Quiz[]> {
  const url = new URL(ENDPOINTS.QUIZZES, ENV.NEXT_PUBLIC_SITE_URL);

  const response = await fetch(url, { cache: "no-cache" });

  const { data, error }: GetResponse = await response.json();

  if (error) throw new Error(error);

  return data ?? [];
}

export default QuizzesPage;
