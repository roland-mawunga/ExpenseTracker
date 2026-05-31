import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  useTheme,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import type { Transaction, Category } from "../api/expenses";
import {
  updateTransactionCategory,
  updateTransactionNotes,
  deleteTransaction,
} from "../api/expenses";

interface Props {
  transactions: Transaction[];
  categories: Category[];
  onUpdate: () => void;
}

export default function TransactionTable({
  transactions,
  categories,
  onUpdate,
}: Props) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [noteValue, setNoteValue] = useState("");

  const filtered = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.categoryName ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleCategoryChange = async (
    id: number,
    categoryId: number | null,
  ) => {
    await updateTransactionCategory(id, categoryId);
    onUpdate();
  };

  const handleNoteSave = async (id: number) => {
    await updateTransactionNotes(id, noteValue);
    setEditingNoteId(null);
    onUpdate();
  };

  const handleDelete = async (id: number) => {
    await deleteTransaction(id);
    onUpdate();
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight={600}>
            Transactions
          </Typography>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 220 }}
          />
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "Description",
                  "Amount",
                  "Type",
                  "Category",
                  "Notes",
                  "",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 600,
                      fontSize: 12,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((t) => (
                <TableRow
                  key={t.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}08`,
                    },
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <TableCell sx={{ fontSize: 13, whiteSpace: "nowrap" }}>
                    {new Date(t.date).toLocaleDateString("en-ZA")}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 13,
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Tooltip title={t.description}>
                      <span>{t.description}</span>
                    </Tooltip>
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color:
                        t.type === "debit"
                          ? theme.palette.error.main
                          : theme.palette.secondary.main,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.type === "debit" ? "-" : "+"} R{" "}
                    {t.amount.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={t.type}
                      size="small"
                      sx={{
                        fontSize: 11,
                        height: 20,
                        backgroundColor:
                          t.type === "debit"
                            ? `${theme.palette.error.main}22`
                            : `${theme.palette.secondary.main}22`,
                        color:
                          t.type === "debit"
                            ? theme.palette.error.main
                            : theme.palette.secondary.main,
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Select
                      size="small"
                      value={t.categoryId ?? ""}
                      onChange={(e) =>
                        handleCategoryChange(
                          t.id,
                          e.target.value === 0 ? null : Number(e.target.value),
                        )
                      }
                      displayEmpty
                      sx={{
                        fontSize: 12,
                        minWidth: 130,
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        backgroundColor: t.categoryColor
                          ? `${t.categoryColor}22`
                          : `${theme.palette.divider}`,
                        color: t.categoryColor ?? theme.palette.text.secondary,
                        fontWeight: 600,
                      }}
                    >
                      <MenuItem value="">
                        <em>Uncategorized</em>
                      </MenuItem>
                      {categories.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  <TableCell sx={{ minWidth: 160 }}>
                    {editingNoteId === t.id ? (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <TextField
                          size="small"
                          value={noteValue}
                          onChange={(e) => setNoteValue(e.target.value)}
                          autoFocus
                          sx={{ fontSize: 12 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleNoteSave(t.id)}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          {t.notes ?? "—"}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingNoteId(t.id);
                            setNoteValue(t.notes ?? "");
                          }}
                        >
                          <EditNoteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>

                  <TableCell>
                    <Tooltip title="Delete record">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(t.id)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{ borderTop: `1px solid ${theme.palette.divider}`, mt: 1 }}
        />
      </CardContent>
    </Card>
  );
}
