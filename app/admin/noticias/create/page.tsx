'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Paper, Typography, FormControlLabel, Switch } from '@mui/material';
import Layout from '../../../../components/Layout';

export default function CreateNoticia() {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [markdown, setMarkdown] = useState('');
    const [resumo, setResumo] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [forcarPaginaInicial, setForcarPaginaInicial] = useState(false);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        const processedTitle = title
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-zA-Z0-9 ]/g, '') // Remove non-alphanumeric characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .toLowerCase()
            .slice(0, 15);

        const filename = `${date.replace(/\s/g, '')}-${processedTitle}.md`;
        const imageFilename = `img${date.replace(/\s/g, '')}-${processedTitle}${image ? image.name.slice(image.name.lastIndexOf('.')) : ''}`;

        const formData = new FormData();
        formData.append('title', title); // Use the title as typed for CSV
        formData.append('filename', filename); // Use processed filename for markdown
        formData.append('date', date);
        formData.append('markdown', markdown);
        formData.append('resumo', resumo);
        formData.append('image', image || '');
        formData.append('imageFilename', imageFilename);
        formData.append('forcarPaginaInicial', forcarPaginaInicial ? 'sim' : '');

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Notícia created successfully!');
            router.push('/admin/noticias');
        } else {
            alert('Failed to create notícia');
        }
    };

    return (
        <Layout>
            <Container component="main" maxWidth="md">
                <Paper elevation={3} className="p-8 shadow-lg">
                    <Typography variant="h4" component="h1" gutterBottom className="text-center">
                        Create New Notícia
                    </Typography>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Date (DD MM YYYY)"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Resumo"
                        value={resumo}
                        onChange={(e) => setResumo(e.target.value)}
                        inputProps={{ maxLength: 150 }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Markdown"
                        multiline
                        rows={10}
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <input type="file" onChange={handleImageChange} />
                    <FormControlLabel
                        control={<Switch checked={forcarPaginaInicial} onChange={(e) => setForcarPaginaInicial(e.target.checked)} />}
                        label="Forçar Página Inicial"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                        className="mt-4"
                    >
                        Submit
                    </Button>
                </Paper>
            </Container>
        </Layout>
    );
}
