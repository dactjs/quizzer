import useSWR from "swr";
import { ReasonPhrases } from "http-status-codes";

import { ENV, ENDPOINTS } from "@/constants";

import { GetResponse } from "@/app/api/convocatories/route";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-cache" }).then((res) => res.json());

export type QuizzesConvocatoriesHookParams = {
  start: Date;
  end: Date;
};

export function useQuizzesConvocatories(
  params: QuizzesConvocatoriesHookParams
) {
  const url = new URL(ENDPOINTS.CONVOCATORIES, ENV.NEXT_PUBLIC_SITE_URL);

  url.searchParams.append("startAt", params.start.toISOString());
  url.searchParams.append("endAt", params.end.toISOString());

  const {
    isLoading,
    isValidating,
    data: response,
    error,
    mutate,
  } = useSWR<GetResponse>(url.toString(), fetcher);

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

export default useQuizzesConvocatories;
