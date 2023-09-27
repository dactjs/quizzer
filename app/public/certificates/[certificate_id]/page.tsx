import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

import { prisma } from "@/lib";
import { Loader, Widget } from "@/components";
import { getShortUUID } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";

import {
  GetResponse,
  CertificateWithUserAndConvocatory,
} from "@/app/api/certificates/[certificate_id]/route";

const DynamicCertificatePDF = dynamic(
  () => import("@/features/CertificatePDF"),
  {
    loading: () => <Loader fullscreen />,
    ssr: false,
  }
);

type Params = { certificate_id: string };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const certificate = await prisma.certificate.findUnique({
    where: { id: params.certificate_id },
  });

  if (!certificate) return { title: "Certificado no encontrado" };

  return { title: `Certificado: ${getShortUUID(certificate.id)}` };
}

const CertificatePage: React.FC<{
  params: Params;
}> = async ({ params }) => {
  const certificate = await getCertificate(params.certificate_id);

  return (
    <Widget
      disableDefaultSizes
      sx={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    >
      <DynamicCertificatePDF certificate={certificate} />
    </Widget>
  );
};

async function getCertificate(
  id: string
): Promise<CertificateWithUserAndConvocatory> {
  const url = new URL(
    `${ENDPOINTS.CERTIFICATES}/${id}`,
    ENV.NEXT_PUBLIC_SITE_URL
  );

  const response = await fetch(url, { cache: "no-cache" });

  const { data: certificate, error }: GetResponse = await response.json();

  if (error) throw new Error(error);

  if (!certificate) return notFound();

  return certificate;
}

export default CertificatePage;
