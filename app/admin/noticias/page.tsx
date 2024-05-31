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
} from "@mui/material";
import Papa from "papaparse";
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
  const router = useRouter();
  const pathname = usePathname();

  const fetchData = async () => {
    console.log("Fetching data...");
    try {
      const response = await fetch("/api/fetch-noticias");
      console.log("Fetch response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const csvContent = result.csvContent;
      console.log("CSV data:", csvContent);

      const parsed = Papa.parse<Noticia>(csvContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value, header) => value.trim(),
      });
      console.log("Parsed data:", parsed);

      if (parsed.errors.length > 0) {
        console.error("Parsing errors:", parsed.errors);
      }

      setData(parsed.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pathname]); // Re-fetch data when the pathname changes

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
        <Paper style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Summary</TableCell>
                <TableCell>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row["dia-mes-ano"]}</TableCell>
                  <TableCell>{row.autor}</TableCell>
                  <TableCell>{row.titulo}</TableCell>
                  <TableCell>{row.resumo}</TableCell>
                  <TableCell>
                    <img
                      src={row["imagem-link"]}
                      alt={row.titulo}
                      width="100"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Layout>
  );
}
