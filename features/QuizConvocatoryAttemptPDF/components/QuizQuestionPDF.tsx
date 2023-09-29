import { Fragment } from "react";
import { View, Text, Image as ImagePDF, StyleSheet } from "@react-pdf/renderer";

import {
  QuizQuestionOptionType,
  QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR,
} from "@/schemas";
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
    flex: 1,
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
  checkbox: {
    width: 15,
    height: 15,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  textOptionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 2.5,
    marginVertical: 7.5,
  },
  textOptionContent: {
    marginLeft: 5,
    fontSize: 12,
  },
  imageOptionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    marginHorizontal: 2.5,
    marginVertical: 7.5,
  },
  imageOptionContent: {
    marginLeft: 5,
    maxWidth: 250,
    height: 50,
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
        <Fragment key={option.id}>
          {option.type === QuizQuestionOptionType.TEXT && (
            <View style={styles.textOptionContainer}>
              <View style={styles.checkbox} />

              <Text style={styles.textOptionContent}>
                {`${index + 1}. ${option.content}`}
              </Text>
            </View>
          )}

          {option.type === QuizQuestionOptionType.IMAGE && (
            <View style={styles.imageOptionContainer}>
              <View style={styles.checkbox} />

              {option.content
                .split(QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR)
                .map((image, index) => (
                  <View key={index}>
                    <ImagePDF src={image} style={styles.imageOptionContent} />
                  </View>
                ))}
            </View>
          )}
        </Fragment>
      ))}
    </View>

    <Text style={styles.description}>{question.description}</Text>
  </View>
);

export default QuizQuestionPDF;
