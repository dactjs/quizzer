import {
  PDFViewer,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

import { QuizConvocatoryAttempt } from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

import { QuizQuestionPDF } from "./components";

const styles = StyleSheet.create({
  viewer: {
    width: "100%",
    height: "100%",
    border: 0,
    fontFamily: "Helvetica",
  },
  page: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottom: 1,
    borderBottomStyle: "dotted",
    borderBottomColor: "black",
  },
  user: {
    flex: 1,
    marginRight: 5,
    fontFamily: "Courier-BoldOblique",
    fontSize: 14,
  },
  subject: {
    flex: 2,
    marginLeft: 5,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  content: {
    marginTop: 5,
  },
  footer: {
    marginTop: "auto",
    textAlign: "right",
    fontFamily: "Helvetica-BoldOblique",
    fontSize: 10,
  },
});

export interface QuizConvocatoryAttemptPDFProps {
  attempt: QuizConvocatoryAttempt;
}

export const QuizConvocatoryAttemptPDF: React.FC<
  QuizConvocatoryAttemptPDFProps
> = ({ attempt }) => (
  <PDFViewer showToolbar style={styles.viewer}>
    <Document title={attempt.convocatory.version.quiz.subject}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.user}>{attempt.user.name}</Text>

          <Text style={styles.subject}>
            {attempt.convocatory.version.quiz.subject}
          </Text>
        </View>

        {attempt.submission && (
          <View style={styles.content}>
            {attempt.submission.questions.map((question, index) => (
              <QuizQuestionPDF
                key={question.id}
                index={index}
                question={question}
              />
            ))}
          </View>
        )}

        <View fixed style={styles.footer}>
          <Text>
            {`Intento: ${attempt.number} / ${attempt.convocatory.attempts}`}
          </Text>
        </View>
      </Page>
    </Document>
  </PDFViewer>
);
