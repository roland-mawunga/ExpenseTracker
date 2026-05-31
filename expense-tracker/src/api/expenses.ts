import client from "./client";

export interface SummaryCards {
  totalSpent: number;
  totalIncome: number;
  netSavings: number;
  savingsRate: number;
  avgMonthlySpend: number;
  avgTransactionValue: number;
  totalTransactions: number;
  biggestSpendCategory: string;
}

export interface CategoryBreakdown {
  categoryName: string;
  color: string;
  total: number;
  transactionCount: number;
  percentage: number;
}

export interface MonthlyTotal {
  month: string;
  totalSpent: number;
  totalIncome: number;
  net: number;
}

export interface TopTransaction {
  description: string;
  amount: number;
  date: string;
  categoryName: string;
  color: string;
}

export interface AnalyticsSummary {
  cards: SummaryCards;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTotals: MonthlyTotal[];
  topExpenses: TopTransaction[];
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: string;
  categoryId: number | null;
  categoryName: string | null;
  categoryColor: string | null;
  notes: string | null;
  importedAt: string;
}

export interface Category {
  id: number;
  name: string;
  keywords: string;
  color: string;
}

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const res = await client.get("/analytics/summary");
  return res.data;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const res = await client.get("/transactions");
  return res.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await client.get("/categories");
  return res.data;
};

export const importCsv = async (file: File): Promise<{ imported: number }> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await client.post("/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateTransactionCategory = async (
  id: number,
  categoryId: number | null,
): Promise<void> => {
  await client.put(`/transactions/${id}/category`, categoryId);
};

export const updateTransactionNotes = async (
  id: number,
  notes: string,
): Promise<void> => {
  await client.put(`/transactions/${id}/notes`, JSON.stringify(notes), {
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await client.delete(`/transactions/${id}`);
};
