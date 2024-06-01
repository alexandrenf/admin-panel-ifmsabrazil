"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Layout from "../../../components/Layout";

interface Noticia {
  "dia-mes-ano": string;
  autor: string;
  titulo: string;
  resumo: string;
  link: string;
  "imagem-link": string;
  "forcar-pagina-inicial": string;
}

export default function Noticias() {
  const [data, setData] = useState<Noticia[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchData = async () => {
    try {
      const response = await fetch("/api/fetch-noticias");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.csvData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (index: number) => {
    try {
      const response = await fetch("/api/delete-noticia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index }),
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error("Failed to delete notícia");
      }
    } catch (error) {
      console.error("Error deleting notícia:", error);
    }
  };

  const handleOpenDialog = (index: number) => {
    setDeleteIndex(index);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setDeleteIndex(null);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      handleDelete(deleteIndex);
    }
    handleCloseDialog();
  };

  useEffect(() => {
    fetchData();
  }, [pathname]);

  return (
    <Layout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Notícias
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/admin/noticias/create")}
        >
          Add New Notícia
        </Button>
        <Paper style={{ marginTop: "20px", overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Summary</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={row.link}>
                  <TableCell>{row["dia-mes-ano"]}</TableCell>
                  <TableCell>{row.autor}</TableCell>
                  <TableCell>{row.titulo}</TableCell>
                  <TableCell>{row.resumo}</TableCell>
                  <TableCell>
                    <img
                      src={row["imagem-link"]}
                      alt={row.titulo}
                      width="100"
                      loading="lazy"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenDialog(index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Dialog
          open={open}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this notícia?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
