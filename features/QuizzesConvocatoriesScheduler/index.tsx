"use client";

import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent, RemoteQuery } from "@aldabil/react-scheduler/types";
import { useSnackbar } from "notistack";
import dateFnsEs from "date-fns/locale/es";

import { ENV, ENDPOINTS } from "@/constants";

import { GetResponse } from "@/app/api/convocatories/route";
import { DeleteResponse } from "@/app/api/convocatories/[convocatory_id]/route";

import { CustomEditor, ViewerExtraComponent } from "./components";
import { TRANSLATIONS, VIEW_OPTIONS } from "./config";

export const QuizzesConvocatoriesScheduler: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const getRemoteEvents = async (
    query: RemoteQuery
  ): Promise<ProcessedEvent[] | void> => {
    try {
      const url = new URL(ENDPOINTS.CONVOCATORIES, ENV.NEXT_PUBLIC_SITE_URL);

      url.searchParams.append("startAt", query.start.toISOString());
      url.searchParams.append("endAt", query.end.toISOString());

      const response = await fetch(url, {
        method: "GET",
        cache: "no-cache",
      });

      const { data, error }: GetResponse = await response.json();

      if (error) {
        enqueueSnackbar(error, { variant: "error" });
        return;
      }

      const convocatories = data ?? [];

      const events: ProcessedEvent[] = convocatories.map((convocatory) => ({
        event_id: convocatory.id,
        title: convocatory.version.quiz.subject,
        start: new Date(convocatory.startAt),
        end: new Date(convocatory.endAt),
        data: convocatory,
      }));

      return events;
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error al cargar las convocatorias",
        { variant: "error" }
      );
    }
  };

  const onDelete = async (id: string): Promise<string | void> => {
    try {
      const url = new URL(
        `${ENDPOINTS.CONVOCATORIES}/${id}`,
        ENV.NEXT_PUBLIC_SITE_URL
      );

      const response = await fetch(url, {
        method: "DELETE",
        cache: "no-cache",
      });

      const { data: deleted, error }: DeleteResponse = await response.json();

      if (error) {
        enqueueSnackbar(error, { variant: "error" });
        return;
      }

      if (!deleted) return;

      return deleted.id;
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error al eliminar la convocatoria",
        { variant: "error" }
      );
    }
  };

  return (
    <Scheduler
      view="month"
      locale={dateFnsEs}
      translations={TRANSLATIONS}
      day={VIEW_OPTIONS.day}
      week={VIEW_OPTIONS.week}
      month={VIEW_OPTIONS.month}
      getRemoteEvents={getRemoteEvents}
      onDelete={onDelete}
      customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
      viewerExtraComponent={(_, event) => (
        <ViewerExtraComponent convocatory={event.data} />
      )}
    />
  );
};
