'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Typography, Paper } from '@mui/material';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = () => {
        if (username === process.env.NEXT_PUBLIC_ADMIN_USERNAME && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            router.push('/admin');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} className="p-8 shadow-lg">
                <Typography variant="h4" component="h1" gutterBottom className="text-center">
                    Login
                </Typography>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    fullWidth
                    className="mt-4"
                >
                    Login
                </Button>
            </Paper>
        </Container>
    );
}
