import { View, Text, StyleSheet } from "@react-pdf/renderer";

import { QuizQuestion } from "@/types";

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingBottom: 20,
    borderBottom: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "black",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prompt: {
    marginRight: 5,
    fontFamily: "Times-Bold",
    fontSize: 16,
  },
  category: {
    marginLeft: 5,
    padding: 10,
    textAlign: "right",
    fontFamily: "Courier-BoldOblique",
    fontSize: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  content: {
    margin: 7.5,
  },
  option: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 2.5,
  },
  checkbox: {
    width: 15,
    height: 15,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  answer: {
    marginLeft: 5,
    fontSize: 12,
  },
  description: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#666",
  },
});

export interface QuizQuestionPDFProps {
  index: number;
  question: QuizQuestion;
}

export const QuizQuestionPDF: React.FC<QuizQuestionPDFProps> = ({
  index,
  question,
}) => (
  <View wrap={false} style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.prompt}>{`${index + 1}. ${question.prompt}`}</Text>

      <Text style={styles.category}>{question.category}</Text>
    </View>

    <View style={styles.content}>
      {question.options.map((option, index) => (
        <View key={`${index}.${option}`} style={styles.option}>
          <View style={styles.checkbox} />

          <Text style={styles.answer}>{`${index + 1}. ${option}`}</Text>
        </View>
      ))}
    </View>

    <Text style={styles.description}>{question.description}</Text>
  </View>
);

export default QuizQuestionPDF;
