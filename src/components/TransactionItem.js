import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNotification } from "./Notification/NotificationProvider";
import Web3 from "web3";
import { useEffect, useState } from "react";
const web3 = new Web3(window.ethereum)
export const TransactionItem = (props) => {
    const addNotification = useNotification()

    const { tx, txHash, status } = props
    const account = web3.eth.accounts.privateKeyToAccount(tx.privateKey)

    const Status = () => {
        if (status == 'pending' || status == 'sent' || status == "sending") {
            return (
                <CircularProgress style={{ color: '#009688' }} size={20} />
            )
        } else if (status == 'success') {
            return (
                <CheckIcon color="success" />
            )
        } else if (status == 'error') {
            return (
                <ClearIcon color="error" />
            )
        }
    }

    const handleClipBoard = () => {
        navigator.clipboard.writeText(txHash)
        addNotification("info", "txHash copied to clipboard", 2000)
    }

    useEffect(() => {
        console.log("props updated, why not fucking render")
    }, [txHash, status])
    return (
        <Card onClick={handleClipBoard}>
            <CardContent>
                <Box sx={{ p: 2 }}>
                    <Typography color="text.secondary" gutterBottom>
                        {account.address}
                    </Typography>
                    <Typography variant="body2">
                        TransactionHash:
                    </Typography>
                    <Typography sx={{ fontSize: 14, mb: 0.5 }} color="text.secondary">
                        {txHash}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Status />
                        <Typography sx={{ fontSize: 14 }} color="text.secondary">
                            {status}
                        </Typography>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    )
}