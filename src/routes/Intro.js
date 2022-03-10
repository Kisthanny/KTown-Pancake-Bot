import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
export default function Intro() {
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
            <Box sx={{ m: 2, p: 2 }}>
                <Stack direction='row' spacing={1}>
                    <Typography variant='subtitle1'>
                        To use this site, make sure you are connecting to
                    </Typography>
                    <Typography variant='subtitle1' color="orange">
                        Binance Smart Chain
                    </Typography>
                    <Typography variant='subtitle1'>
                        via MetaMask
                    </Typography>
                </Stack>
                <Typography sx={{ fontsize: 14 }}>
                    you could install <Link underline="none" href='https://metamask.io/' target="_blank">MetaMask</Link> here
                </Typography>
                <Typography sx={{ fontsize: 14 }}>
                    If you need to do any transact on this site, you will need to add your account in the WALLET section
                </Typography>
                <Typography variant='h5' color="darkred">
                    You will be asked to provide your private key, we will not store it in any form, please think it through
                </Typography>
                <Typography variant='subtitle1' color="darkcyan">
                    Check out the demo video of how to use this site:
                </Typography>
                <Typography variant='subtitle1' color="deeppink">
                    <Link color="deeppink" underline="none" href='https://www.bilibili.com/video/BV11i4y1y7za/' target="_blank">Bilibili</Link>
                </Typography>
                <Typography variant='subtitle1' color="red">
                    <Link color="red" underline="none" href='https://www.youtube.com/watch?v=v_w86GUwjcs' target="_blank">Youtube</Link>
                </Typography>
                <Typography variant='subtitle1' color={theme.palette.primary.main}>
                    author: KK
                </Typography>
                <Typography variant='subtitle1' color={theme.palette.primary.main}>
                    email: tigerqige@gmail.com || 770998708@qq.com
                </Typography>
                <Typography variant='subtitle1' color={theme.palette.primary.main}>
                    telegram: https://t.me/Kisthanny
                </Typography>
                <Typography variant='subtitle1' color={theme.palette.primary.main}>
                    wechat: 770998708
                </Typography>
            </Box>
        </ThemeProvider>
    )
}