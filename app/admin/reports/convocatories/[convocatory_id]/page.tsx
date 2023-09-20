import { Metadata } from "next";
import { Container, Unstable_Grid2 } from "@mui/material";

import { prisma } from "@/lib";
import { QuizConvocatoryCard, QuizConvocatoryStats } from "@/features";
import { Widget } from "@/components";
import { getShortUUID } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { QuizSubmissionStatus } from "@/types";

import {
  GetResponse as ConvocatoryGetResponse,
  QuizConvocatoryWithVersionAndUsers,
} from "@/app/api/convocatories/[convocatory_id]/route";
import {
  GetResponse as ConvocatorySubmissionsGetResponse,
  QuizSubmissionWithConvocatoryAndUser,
} from "@/app/api/convocatories/[convocatory_id]/submissions/route";

type Params = { convocatory_id: string };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const convocatory = await prisma.quizConvocatory.findUnique({
    where: { id: params.convocatory_id },
  });

  if (!convocatory) return { title: "Convocatoria no encontrada" };

  return { title: `Convocatoria: ${getShortUUID(convocatory.id)}` };
}

const ConvocatorySubmissionsPage: React.FC<{
  params: Params;
}> = async ({ params }) => {
  const convocatory = await getConvocatory(params.convocatory_id);

  const submissions = await getConvocatorySubmissions({
    convocatory: params.convocatory_id,
  });

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
          <Widget disableDefaultSizes>
            <QuizConvocatoryCard convocatory={convocatory} />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12}>
          <Widget disableDefaultSizes>
            <QuizConvocatoryStats submissions={submissions} />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  );
};

async function getConvocatory(
  id: string
): Promise<QuizConvocatoryWithVersionAndUsers> {
  const url = new URL(
    `${ENDPOINTS.CONVOCATORIES}/${id}`,
    ENV.NEXT_PUBLIC_SITE_URL
  );

  const response = await fetch(url, { cache: "no-cache" });

  const { data, error }: ConvocatoryGetResponse = await response.json();

  if (error) throw new Error(error);

  return data as QuizConvocatoryWithVersionAndUsers;
}

async function getConvocatorySubmissions(params: {
  convocatory: string;
}): Promise<QuizSubmissionWithConvocatoryAndUser[]> {
  const url = new URL(
    `${ENDPOINTS.CONVOCATORIES}/${params.convocatory}/submissions`,
    ENV.NEXT_PUBLIC_SITE_URL
  );

  const response = await fetch(url, { cache: "no-cache" });

  const { data, error }: ConvocatorySubmissionsGetResponse =
    await response.json();

  if (error) throw new Error(error);

  if (!data) return [];

  const submissions = data.filter(
    ({ status }) => status === QuizSubmissionStatus.SUBMITTED
  );

  return submissions;
}

export default ConvocatorySubmissionsPage;
