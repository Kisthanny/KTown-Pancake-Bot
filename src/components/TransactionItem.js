import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from "react";
import { useNotification } from "./Notification/NotificationProvider";
export const TransactionItem = (props) => {
    const addNotification = useNotification()
    const { txid, transactions } = props
    const transaction = transactions.filter(tx => tx.key == txid)[0]
    const Status = () => {
        if (transaction.status == 'pending' || transaction.status == 'sent') {
            return (
                <CircularProgress style={{ color: '#009688' }} size={20} />
            )
        } else if (transaction.status == 'success') {
            return (
                <CheckIcon color="success" />
            )
        } else if (transaction.status == 'error') {
            return (
                <ClearIcon color="error" />
            )
        }

    }
    const handleClipBoard = () => {
        navigator.clipboard.writeText(transaction.transactionHash)
        addNotification("info", "txHash copied to clipboard", 2000)
    }
    return (
        <MenuItem divider onClick={handleClipBoard}>
            <Box sx={{ p: 2 }}>
                <Typography color="text.secondary" gutterBottom>
                    {transaction.fromAccount}
                </Typography>
                <Typography variant="body2">
                    TransactionHash:
                </Typography>
                <Typography sx={{ fontSize: 14, mb: 0.5 }} color="text.secondary">
                    {transaction.transactionHash}
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Status />
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        {transaction.status}
                    </Typography>
                </Stack>
            </Box>
        </MenuItem>
    )
}