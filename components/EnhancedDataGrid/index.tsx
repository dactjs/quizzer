"use client";

import {
  DataGrid,
  DataGridProps,
  GridToolbarQuickFilterProps,
} from "@mui/x-data-grid";

import { ErrorInfo } from "../ErrorInfo";

import {
  EnhancedDataGridLoadingOverlay,
  EnhancedDataGridToolbar,
  EnhancedDataGridNoRowsOverlay,
} from "./components";

export interface EnhancedDataGridProps
  extends Omit<DataGridProps, "components" | "slotProps"> {
  quickFilterProps?: GridToolbarQuickFilterProps;
  error?: Error | null;
}

export const EnhancedDataGrid: React.FC<EnhancedDataGridProps> = ({
  quickFilterProps: qfprops,
  error,
  ...props
}) => (
  <>
    {error && <ErrorInfo error={error} />}

    {!error && (
      <DataGrid
        slots={{
          loadingOverlay: EnhancedDataGridLoadingOverlay,
          noRowsOverlay: EnhancedDataGridNoRowsOverlay,
          noResultsOverlay: EnhancedDataGridNoRowsOverlay,
          toolbar: () => <EnhancedDataGridToolbar quickFilterProps={qfprops} />,
        }}
        {...props}
      />
    )}
  </>
);
