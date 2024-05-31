'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import Papa from 'papaparse';
import Layout from '../../../components/Layout';

interface Noticia {
    'dia-mes-ano': string;
    autor: string;
    titulo: string;
    resumo: string;
    'imagem-link': string;
}

export default function Noticias() {
    const [data, setData] = useState<Noticia[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://cdn.jsdelivr.net/gh/alexandrenf/dataifmsabrazil/noticias.csv');
            const reader = response.body?.getReader();
            const result = await reader?.read();
            const decoder = new TextDecoder('utf-8');
            const csv = decoder.decode(result?.value);
            const parsed = Papa.parse<Noticia>(csv, { header: true });
            setData(parsed.data);
        };

        fetchData();
    }, []);

    return (
        <Layout>
            <Container>
                <Typography variant="h4" component="h1" gutterBottom>Notícias</Typography>
                <Button variant="contained" color="primary" onClick={() => router.push('/admin/noticias/create')}>
                    Add New Notícia
                </Button>
                <Paper style={{ marginTop: '20px' }}>
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
                                    <TableCell>{row['dia-mes-ano']}</TableCell>
                                    <TableCell>{row.autor}</TableCell>
                                    <TableCell>{row.titulo}</TableCell>
                                    <TableCell>{row.resumo}</TableCell>
                                    <TableCell><img src={row['imagem-link']} alt={row.titulo} width="100" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Container>
        </Layout>
    );
}
