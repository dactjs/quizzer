import {
  User as DBUser,
  UserRole as DBUserRole,
  UserStatus as DBUserStatus,
  Quiz as DBQuiz,
  QuizVersion as DBQuizVersion,
  QuizQuestion as DBQuizQuestion,
  QuizConvocatory as DBQuizConvocatory,
  QuizSubmission as DBQuizSubmission,
  QuizSubmissionStatus as DBQuizSubmissionStatus,
  QuizSubmissionReason as DBQuizSubmissionReason,
  Certificate as DBCertificate,
} from "@prisma/client";

import { QuizQuestionOptionData, QuizQuestionResultData } from "@/schemas";

export {
  DBUserRole as UserRole,
  DBUserStatus as UserStatus,
  DBQuizSubmissionStatus as QuizSubmissionStatus,
  DBQuizSubmissionReason as QuizSubmissionReason,
};

export type User = DBUser;

export type Quiz = DBQuiz;

export type QuizVersion = DBQuizVersion;

export type QuizQuestion = Omit<DBQuizQuestion, "options" | "answer"> & {
  options: QuizQuestionOptionData[];
  answer: QuizQuestionOptionData;
};

export type QuizConvocatory = DBQuizConvocatory;

export type QuizSubmission = Omit<DBQuizSubmission, "results"> & {
  results: QuizQuestionResultData[];
};

export type Certificate = DBCertificate;
