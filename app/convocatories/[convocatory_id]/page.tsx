import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Container } from "@mui/material";

import { prisma } from "@/lib";
import { QuizConvocatoryAttemptLauncher } from "@/features";
import { Widget } from "@/components";
import { getShortUUID } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  GetResponse,
  QuizConvocatoryAttempt,
} from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

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

const ConvocatoryPage: React.FC<{
  params: Params;
}> = async ({ params }) => {
  const attempt = await getCurrentAttempt({
    convocatory: params.convocatory_id,
  });

  return (
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
      <Widget disableDefaultSizes>
        <QuizConvocatoryAttemptLauncher attempt={attempt} />
      </Widget>
    </Container>
  );
};

async function getCurrentAttempt(params: {
  convocatory: string;
}): Promise<QuizConvocatoryAttempt> {
  const session = await getServerSession(authOptions);

  const url = new URL(
    `${ENDPOINTS.CONVOCATORIES}/${params.convocatory}/attempts/${session?.user?.email}/current`,
    ENV.NEXT_PUBLIC_SITE_URL
  );

  const response = await fetch(url, { cache: "no-cache" });

  const { data: attempt, error }: GetResponse = await response.json();

  if (error) throw new Error(error);

  if (!attempt) return notFound();

  return attempt;
}

export default ConvocatoryPage;
