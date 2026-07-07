import { useState } from "react";
import { Card, CardContent } from "@mui/material";
import type { Transaction, Category } from "../api/expenses";
import { AllCommunityModule, type ColDef } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

export default function TransactionTable({ transactions, categories }: Props) {
  // Column Definitions: Defines & controls grid columns.
  const [colDefs] = useState<ColDef<Transaction>[]>([
    {
      field: "date",
      headerName: "Date",
      valueFormatter: ({ value }) =>
        new Date(value).toLocaleDateString("en-ZA"),
    },
    {
      field: "description",
      headerName: "Description",
    },
    {
      field: "amount",
      headerName: "Amount",
      valueFormatter: ({ value }) =>
        `R ${Number(value).toLocaleString("en-ZA", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      field: "type",
      headerName: "Type",
    },
    {
      field: "categoryName",
      headerName: "Category",
    },
    {
      field: "notes",
      headerName: "Notes",
    },
  ]);

  const defaultColDef: ColDef<Transaction> = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
  };

  console.log("transactions => ", transactions);
  console.log("categories => ", categories);

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <AgGridProvider modules={[AllCommunityModule]}>
          <div style={{ height: 500 }}>
            <AgGridReact<Transaction>
              rowData={transactions}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
            />
          </div>
        </AgGridProvider>
      </CardContent>
    </Card>
  );
}
