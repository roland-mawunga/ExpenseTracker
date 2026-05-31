import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CategoryBreakdown } from "../api/expenses";

interface Props {
  data: CategoryBreakdown[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: CategoryBreakdown }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  const theme = useTheme();

  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 1.5,
      }}
    >
      <Typography variant="body2" fontWeight={600}>
        {item.categoryName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        R {item.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {item.percentage}% of spending
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {item.transactionCount} transactions
      </Typography>
    </Box>
  );
}

export default function CategoryChart({ data }: Props) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Spending by Category
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.categoryName} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value: string) => (
                <span style={{ fontSize: 13 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
