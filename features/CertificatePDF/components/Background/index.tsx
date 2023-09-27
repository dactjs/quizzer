import { View, Image as ImagePDF, StyleSheet } from "@react-pdf/renderer";

import { background } from "../../assets";

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    border: "none",
  },
});

export const Background: React.FC = () => (
  <View style={styles.background}>
    <ImagePDF
      src={background.src}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </View>
);

export default Background;
