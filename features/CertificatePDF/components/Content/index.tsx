import { View, Text, StyleSheet, Font } from "@react-pdf/renderer";

import { CertificateWithUserAndConvocatory } from "@/app/api/certificates/[certificate_id]/route";

Font.register({
  family: "Tangerine-Regular",
  src: "/assets/fonts/Tangerine-Regular.ttf",
});

Font.register({
  family: "Tangerine-Bold",
  src: "/assets/fonts/Tangerine-Bold.ttf",
});

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    paddingHorizontal: 35,
    gap: 10,
  },
  title: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  subject: {
    fontFamily: "Helvetica-BoldOblique",
    fontSize: 30,
    marginBottom: 10,
  },
  user: {
    paddingBottom: 2.5,
    marginHorizontal: 40,
    fontFamily: "Tangerine-Regular",
    fontSize: 50,
    borderBottom: `2px solid black`,
  },
  content: {
    fontSize: 10,
  },
});

export interface ContentProps {
  certificate: CertificateWithUserAndConvocatory;
}

export const Content: React.FC<ContentProps> = ({ certificate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Otorga la certificación</Text>

      <Text style={styles.subject}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </Text>

      <Text style={styles.user}>{certificate.user.name}</Text>

      <Text style={styles.content}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
        cupiditate, quidem ducimus, est odit doloremque nemo culpa ut aperiam
        impedit vero, cum reiciendis hic ipsum explicabo quam ab et illo.Lorem
        ipsum dolor sit amet consectetur adipisicing elit. Sapiente cupiditate,
        quidem ducimus, est odit doloremque nemo culpa ut aperiam impedit vero,
        cum reiciendis hic ipsum explicabo quam ab et illo.
      </Text>
    </View>
  );
};

export default Content;
