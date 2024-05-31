'use client';

import Layout from '../../components/Layout';
import { Container, Typography } from '@mui/material';

export default function Admin() {
    return (
        <Layout>
            <Container>
                <Typography variant="h4" component="h1" gutterBottom>
                    Admin Dashboard
                </Typography>
                <Typography variant="body1">
                    Welcome to the admin panel. Use the sidebar to navigate through different sections.
                </Typography>
            </Container>
        </Layout>
    );
}
