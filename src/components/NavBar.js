import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { TransactionCenter } from "./TransactionCenter";
export function NavBar() {
    const pages = ['SYRUP', 'WALLET', 'TRANSFER']
    const theme = createTheme({
        palette: {
            primary: {
                main: '#009688',
            },
            secondary: {
                main: '#1de9b6',
            },
        },
    });
    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >
                            <Link to='home' style={{ textDecoration: 'none', color: '#f5f5f5' }}>
                                PancakeBot
                            </Link>
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={() => { }}
                                    sx={{ my: 2, display: 'block' }}
                                >
                                    <Link to={page.toLowerCase()} style={{ textDecoration: 'none', color: '#f5f5f5' }}>
                                        {page}
                                    </Link>
                                </Button>
                            ))}
                        </Box>
                        <TransactionCenter />
                    </Toolbar>
                </Container>
            </AppBar >
        </ThemeProvider>
    )
}