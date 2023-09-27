import useSWR from "swr";
import { ReasonPhrases } from "http-status-codes";

import { ENDPOINTS } from "@/constants";

import { GetResponse } from "@/app/api/convocatories/[convocatory_id]/attempts/current/route";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-cache" }).then((res) => res.json());

export type QuizConvocatoryAttemptsHookParams = {
  convocatory: string;
};

export function useQuizConvocatoryAttempts(
  params?: QuizConvocatoryAttemptsHookParams | null
) {
  const {
    isLoading,
    isValidating,
    data: response,
    error,
    mutate,
  } = useSWR<GetResponse>(
    params
      ? `${ENDPOINTS.CONVOCATORIES}/${params.convocatory}/attempts/current`
      : null,
    fetcher
  );

  const message = error
    ? error instanceof Error
      ? error.message
      : ReasonPhrases.INTERNAL_SERVER_ERROR
    : response?.error ?? null;

  return {
    mutate,
    loading: isLoading,
    validating: isValidating,
    data: response?.data ?? null,
    error: message ?? null,
  };
}

export default useQuizConvocatoryAttempts;
