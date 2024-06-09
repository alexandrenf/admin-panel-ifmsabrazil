'use client';

import Layout from '../../components/Layout';
import { Container, Typography } from '@mui/material';

export default function Admin() {
    return (
        <Layout>
            <Container>
                <Typography variant="h4" component="h1" gutterBottom>
                    Seja bem vindo à area de administrdor da IFMSA Brazil!
                </Typography>
                <Typography variant="body1">
                    Aqui você vai poder editar áreas do site como: notícias, painel de EB e outras configurações.
                </Typography>
            </Container>
        </Layout>
    );
}
