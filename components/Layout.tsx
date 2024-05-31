'use client';

import { AppBar, Toolbar, Drawer, List, ListItem, ListItemText, CssBaseline } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const drawerWidth = 240;

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>Admin Panel</Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <List>
                    {['Notícias', 'EBs', 'Páginas'].map((text) => (
                        <ListItem button key={text} onClick={() => handleNavigation(`/admin/${text.toLowerCase().replace('í', 'i').replace('ã', 'a')}`)}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <main style={{ marginLeft: drawerWidth, padding: '20px', width: `calc(100% - ${drawerWidth}px)` }}>
                <Toolbar />
                {children}
            </main>
        </>
    );
}
