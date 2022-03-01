import { useState, useEffect } from "react"
import { balanceOf } from "../Web3Client";
import Button from "@mui/material/Button";
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { useNotification } from "./Notification/NotificationProvider";
export const AccountInfo = (props) => {
    const { index, account, deleteAccount, checked } = props
    const [balance_bnb, setBalance_bnb] = useState('#')
    const [balance_cake, setBalance_cake] = useState('#')
    const [visible, setVisible] = useState('visible')
    const addNotification = useNotification()
    const updateBalance = () => {
        balanceOf(account.address).then(balance => {
            setBalance_bnb(balance)
        }).catch(err => {
            console.log(err)
        })
        balanceOf(account.address, "pancake").then(balance => {
            setBalance_cake(balance)
        }).catch(err => {
            console.log(err)
        })
    }
    const deleteHandler = () => {
        //e.preventDefault()
        deleteAccount(account)
        setVisible('hidden')
    }
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: grey[300],
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));
    useEffect(() => {
        if (checked) {
            updateBalance()
        } else {
            setBalance_bnb('#')
            setBalance_cake('#')
        }
    }, [checked])
    return (
        <StyledTableRow sx={{ visibility: visible }}>
            <TableCell>{index}</TableCell>
            <TableCell>{account.address}</TableCell>
            <TableCell className="bnb-balance">{balance_bnb}</TableCell>
            <TableCell className="cake-balance">{balance_cake}</TableCell>
            <TableCell><Button variant="outlined" color="error" onClick={deleteHandler}>delete</Button></TableCell>
        </StyledTableRow>
    )
}