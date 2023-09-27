import { View, Image as ImagePDF, Text, StyleSheet } from "@react-pdf/renderer";
import QRCode from "qrcode";

import { PAGES } from "@/constants";

import { CertificateWithUserAndConvocatory } from "@/app/api/certificates/[certificate_id]/route";

import { logo } from "../../assets";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 35,
    paddingVertical: 30,
    gap: 10,
  },
  logo: { width: 75, border: "none" },
  qr: { width: 75, border: "none" },
  brand: {
    textAlign: "center",
    fontFamily: "Times-Bold",
    fontSize: 35,
    fontWeight: "bold",
  },
});

export interface HeaderProps {
  certificate: CertificateWithUserAndConvocatory;
}

export const Header: React.FC<HeaderProps> = ({ certificate }) => {
  const QR = QRCode.toDataURL(`${PAGES.PUBLIC_CERTIFICATES}/${certificate.id}`);

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <ImagePDF
          src={logo.src}
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </View>

      <Text style={styles.brand}>SIVIEDEIF HOLDING GROUPS</Text>

      <View style={styles.qr}>
        <ImagePDF
          src={QR}
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </View>
    </View>
  );
};

export default Header;
