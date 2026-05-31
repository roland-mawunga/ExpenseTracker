import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SavingsIcon from "@mui/icons-material/Savings";
import CategoryIcon from "@mui/icons-material/Category";
import type { SummaryCards as SummaryCardsType } from "../api/expenses";

interface Props {
  cards: SummaryCardsType;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  //   const theme = useTheme();

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}22`,
              borderRadius: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ color }}>{icon}</Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

const formatCurrency = (amount: number) =>
  `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function SummaryCards({ cards }: Props) {
  const theme = useTheme();

  const stats: StatCardProps[] = [
    {
      title: "Total Income",
      value: formatCurrency(cards.totalIncome),
      subtitle: `${cards.totalTransactions} transactions`,
      icon: <TrendingUpIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: "Total Spent",
      value: formatCurrency(cards.totalSpent),
      subtitle: `Avg R ${cards.avgTransactionValue.toFixed(2)} per transaction`,
      icon: <TrendingDownIcon />,
      color: theme.palette.error.main,
    },
    {
      title: "Net Savings",
      value: formatCurrency(cards.netSavings),
      subtitle: `${cards.savingsRate}% savings rate`,
      icon: <SavingsIcon />,
      color:
        cards.netSavings >= 0
          ? theme.palette.secondary.main
          : theme.palette.error.main,
    },
    {
      title: "Avg Monthly Spend",
      value: formatCurrency(cards.avgMonthlySpend),
      subtitle: "across all months",
      icon: <AccountBalanceWalletIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: "Biggest Category",
      value: cards.biggestSpendCategory,
      subtitle: "most spending",
      icon: <CategoryIcon />,
      color: "#f97316",
    },
    {
      title: "Transactions",
      value: cards.totalTransactions.toString(),
      subtitle: "total imported",
      icon: <ReceiptLongIcon />,
      color: "#a855f7",
    },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.title}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
}
