"use client";
import { Box, SxProps, Theme } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowIdGetter,
  GridToolbar,
} from "@mui/x-data-grid";
import { DataGridLocale } from "@/components/SmallComponents/Table/DataGridLocale";

interface TableProps {
  rows: readonly any[];
  columns: readonly GridColDef<any>[];
  pageSize?: number;
  loading?: boolean;
  autoHeight?: boolean;
  disableRowSelectionOnClick?: boolean;
  sx?: SxProps<Theme>;
  getRowId?: GridRowIdGetter<any> | undefined;
}

const Table: React.FC<TableProps> = ({
  rows,
  columns,
  pageSize = 10,
  loading,
  autoHeight = true,
  disableRowSelectionOnClick = true,
  sx,
  getRowId = undefined,
}) => {
  return (
    <Box height="100%" my={4}>
      <DataGrid
        getRowId={getRowId}
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
            },
          },
        }}
        sx={
          sx
            ? sx
            : {
                bgcolor: "common.white",
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "divider",
                },
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                  outline: "none !important",
                },
                "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus": {
                  outline: "none !important",
                },
              }
        }
        loading={loading || false}
        autoHeight={autoHeight}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        localeText={DataGridLocale}
      />
    </Box>
  );
};

export default Table;
