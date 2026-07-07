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
  footerText?: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({
  title,
  value,
  subtitle,
  footerText = "28 Dec 2025 - 07 Jan 2026",
  icon,
  color,
}: StatCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={2}
        >
          {/* Content */}
          <Box flex={1} minWidth={0}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{
                letterSpacing: 1,
                lineHeight: 1.2,
                display: "block",
                mb: 0.5,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ lineHeight: 1.1, mb: subtitle ? 0.75 : 0 }}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.4 }}
              >
                {subtitle}
              </Typography>
            )}

            {footerText && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1.5, lineHeight: 1.3 }}
              >
                {footerText}
              </Typography>
            )}
          </Box>

          {/* Icon */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              backgroundColor: `${color}15`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Box sx={{ fontSize: 28, display: "flex" }}>{icon}</Box>
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
