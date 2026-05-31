import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { importCsv } from "../api/expenses";

interface Props {
  onImportSuccess: () => void;
}

export default function ImportCard({ onImportSuccess }: Props) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imported: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const data = await importCsv(file);
        setResult(data);
        onImportSuccess();
      } catch (err: any) {
        console.error("Import error:", err);
        setError(
          err?.response?.data ||
            err?.message ||
            "Failed to import file. Make sure it is a valid CSV.",
        );
      } finally {
        setLoading(false);
      }
    },
    [onImportSuccess],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
    disabled: loading,
  });

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Import Bank Statement
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            border: `2px dashed`,
            borderColor: isDragActive
              ? theme.palette.primary.main
              : theme.palette.divider,
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: isDragActive
              ? `${theme.palette.primary.main}11`
              : "transparent",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor: `${theme.palette.primary.main}11`,
            },
          }}
        >
          <input {...getInputProps()} />

          {loading ? (
            <CircularProgress size={36} />
          ) : result ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <CheckCircleOutlineIcon
                sx={{ fontSize: 36, color: theme.palette.secondary.main }}
              />
              <Typography variant="body1" fontWeight={600} color="secondary">
                {result.imported} transactions imported
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Drop another file to import more
              </Typography>
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <UploadFileIcon
                sx={{ fontSize: 36, color: theme.palette.text.secondary }}
              />
              <Typography variant="body1" fontWeight={500}>
                {isDragActive
                  ? "Drop your CSV here"
                  : "Drag & drop your CSV here"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
              <Button variant="outlined" size="small" component="span">
                Browse File
              </Button>
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
