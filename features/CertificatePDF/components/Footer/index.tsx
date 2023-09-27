import { View, Image as ImagePDF, Text, StyleSheet } from "@react-pdf/renderer";

import { signature, stamp } from "../../assets";

const left = {
  name: "Deivis M. Adames M.",
  position: "Director de general",
  src: signature.src,
};

const right = {
  name: "Heidy M. Javier C.",
  position: "Directora",
  src: signature.src,
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 60,
  },
  signature: {
    display: "flex",
    flexDirection: "column",
    width: 225,
    textAlign: "center",
    border: "none",
  },
  signature__position: {
    fontFamily: "Times-Bold",
  },

  stamp: {
    width: 120,
    border: "none",
    transform: "rotate(-5deg)",
  },
});

export const Footer: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.signature}>
      <ImagePDF
        src={left.src}
        style={{ width: "100%", height: "auto", objectFit: "cover" }}
      />

      <View style={{ borderBottom: "2px solid black" }} />

      <Text>{left.name}</Text>
      <Text style={styles.signature__position}>{left.position}</Text>
    </View>

    <View style={styles.stamp}>
      <ImagePDF
        src={stamp.src}
        style={{ width: "100%", height: "auto", objectFit: "cover" }}
      />
    </View>

    <View style={styles.signature}>
      <ImagePDF
        src={right.src}
        style={{ width: "100%", height: "auto", objectFit: "cover" }}
      />

      <View style={{ borderBottom: "2px solid black" }} />

      <Text>{right.name}</Text>
      <Text style={styles.signature__position}>{right.position}</Text>
    </View>
  </View>
);

export default Footer;
