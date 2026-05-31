import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import type { TopTransaction } from "../api/expenses";

interface Props {
  data: TopTransaction[];
}

export default function TopExpenses({ data }: Props) {
  const theme = useTheme();

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Top Expenses
        </Typography>

        <Box display="flex" flexDirection="column" gap={0}>
          {data.map((transaction, index) => (
            <Box key={index}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1.5}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={0.5}
                  flex={1}
                  mr={2}
                >
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 220,
                    }}
                  >
                    {transaction.description}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={transaction.categoryName}
                      size="small"
                      sx={{
                        backgroundColor: `${transaction.color}22`,
                        color: transaction.color,
                        fontWeight: 600,
                        fontSize: 11,
                        height: 20,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {transaction.date}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="error"
                  whiteSpace="nowrap"
                >
                  - R{" "}
                  {transaction.amount.toLocaleString("en-ZA", {
                    minimumFractionDigits: 2,
                  })}
                </Typography>
              </Box>

              {index < data.length - 1 && (
                <Divider sx={{ borderColor: theme.palette.divider }} />
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
