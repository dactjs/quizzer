import useSWR from "swr";
import { ReasonPhrases } from "http-status-codes";

import { ENDPOINTS } from "@/constants";

import { GetResponse } from "@/app/api/quizzes/versions/route";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-cache" }).then((res) => res.json());

export function useQuizzesVersions() {
  const {
    isLoading,
    isValidating,
    data: response,
    error,
    mutate,
  } = useSWR<GetResponse>(`${ENDPOINTS.QUIZZES}/versions`, fetcher);

  const message = error
    ? error instanceof Error
      ? error.message
      : ReasonPhrases.INTERNAL_SERVER_ERROR
    : response?.error ?? null;

  return {
    mutate,
    loading: isLoading,
    validating: isValidating,
    data: response?.data ?? [],
    error: message ?? null,
  };
}

export default useQuizzesVersions;
