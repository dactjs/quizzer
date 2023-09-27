"use client";

import { PDFViewer, Document, Page, StyleSheet } from "@react-pdf/renderer";

import { getShortUUID } from "@/schemas";

import { CertificateWithUserAndConvocatory } from "@/app/api/certificates/[certificate_id]/route";

import { Background, Header, Content, Footer } from "./components";

const styles = StyleSheet.create({
  viewer: {
    width: "100%",
    height: "100%",
    border: 0,
  },
  page: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
});

export interface CertificatePDFProps {
  certificate: CertificateWithUserAndConvocatory;
}

export const CertificatePDF: React.FC<CertificatePDFProps> = ({
  certificate,
}) => (
  <PDFViewer showToolbar style={styles.viewer}>
    <Document title={`Certificado ${getShortUUID(certificate.id)}`}>
      <Page orientation="landscape" size="A4" style={styles.page}>
        <Background />
        <Header certificate={certificate} />
        <Content certificate={certificate} />
        <Footer />
      </Page>
    </Document>
  </PDFViewer>
);

export default CertificatePDF;
