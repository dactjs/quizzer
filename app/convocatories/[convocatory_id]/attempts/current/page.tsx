import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Container } from "@mui/material";

import { prisma } from "@/lib";
import { QuizConvocatoryAttemptRenderer } from "@/features";
import { Widget } from "@/components";
import { ENV, ENDPOINTS, PAGES } from "@/constants";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  GetResponse,
  QuizConvocatoryAttempt,
} from "@/app/api/convocatories/[convocatory_id]/attempts/current/route";

type Params = { convocatory_id: string };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const convocatory = await prisma.quizConvocatory.findUnique({
    where: { id: params.convocatory_id },
    include: { version: { include: { quiz: true } } },
  });

  if (!convocatory) return { title: "Convocatoria no encontrada" };

  return { title: convocatory.version.quiz.subject };
}

const CurrentAttemptPage: React.FC<{
  params: Params;
}> = async ({ params }) => {
  const attempt = await getCurrentAttempt({
    convocatory: params.convocatory_id,
  });

  return (
    <Container fixed sx={{ height: "100%", overflow: { md: "hidden" } }}>
      <Widget
        disableDefaultSizes
        sx={{ height: "100%", overflow: { md: "hidden" } }}
      >
        <QuizConvocatoryAttemptRenderer attempt={attempt} />
      </Widget>
    </Container>
  );
};

async function getCurrentAttempt(params: {
  convocatory: string;
}): Promise<QuizConvocatoryAttempt> {
  const session = await getServerSession(authOptions);

  const email = session?.user?.email;

  const url = new URL(
    `${ENDPOINTS.CONVOCATORIES}/${params.convocatory}/attempts/current`,
    ENV.NEXT_PUBLIC_SITE_URL
  );

  if (email) url.searchParams.append("email", email);

  const response = await fetch(url, { cache: "no-cache" });

  const { data: attempt, error }: GetResponse = await response.json();

  if (error) throw new Error(error);

  if (!attempt) return notFound();

  if (!attempt.submission)
    return redirect(`${PAGES.CONVOCATORIES}/${params.convocatory}`);

  return attempt;
}

export default CurrentAttemptPage;
