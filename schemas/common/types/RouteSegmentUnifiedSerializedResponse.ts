export type RouteSegmentUnifiedSerializedResponse<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export default RouteSegmentUnifiedSerializedResponse;
