import { useState, useEffect, useMemo } from "react";
import { Box, Typography, CircularProgress, Grid } from "@mui/material";
import ImportCard from "./components/ImportCard";
import SummaryCards from "./components/SummaryCards";
import CategoryChart from "./components/CategoryChart";
import MonthlyChart from "./components/MonthlyChart";
import TopExpenses from "./components/TopExpenses";
import TransactionTable from "./components/TransactionsTable";
import {
  getAnalyticsSummary,
  getTransactions,
  getCategories,
} from "./api/expenses";
import type { AnalyticsSummary, Transaction, Category } from "./api/expenses";

function App() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [summaryData, transactionsData, categoriesData] = await Promise.all(
        [getAnalyticsSummary(), getTransactions(), getCategories()],
      );
      console.log("summaryData => ", summaryData);
      setSummary(summaryData);
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dataDateRange = useMemo(() => {
    if (transactions.length === 0) return null;

    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return {
      startDate: sorted[0].date,
      endDate: sorted[sorted.length - 1].date,
    };
  }, [transactions]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Expense Tracker
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Import your bank statement and track your spending
      </Typography>

      <Box mb={3}>
        <ImportCard onImportSuccess={fetchData} />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : summary ? (
        <Box display="flex" flexDirection="column" gap={3}>
          <SummaryCards
            cards={summary.cards}
            startDate={dataDateRange?.startDate}
            endDate={dataDateRange?.endDate}
          />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <CategoryChart data={summary.categoryBreakdown} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MonthlyChart data={summary.monthlyTotals} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TopExpenses data={summary.topExpenses} />
            </Grid>
          </Grid>

          <TransactionTable
            transactions={transactions}
            categories={categories}
            // onUpdate={fetchData}
          />
        </Box>
      ) : null}
    </Box>
  );
}

export default App;
