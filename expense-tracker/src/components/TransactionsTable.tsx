import { useState } from "react";
import { Card, CardContent, useTheme } from "@mui/material";
import type { Transaction, Category } from "../api/expenses";
import {
  updateTransactionCategory,
  updateTransactionNotes,
  deleteTransaction,
} from "../api/expenses";
import { AllCommunityModule, type ColDef } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";

// Row Data Interface
interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

export default function TransactionTable({ transactions, categories }: Props) {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<IRow[]>([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
  ]);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ]);

  const defaultColDef: ColDef = {
    flex: 1,
  };

  console.log("transactions => ", transactions);
  console.log("categories => ", categories);

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <AgGridProvider modules={[AllCommunityModule]}>
          <div>
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              domLayout="autoHeight"
              pagination
              paginationPageSize={10}
            />
          </div>
        </AgGridProvider>
      </CardContent>
    </Card>
  );
}
