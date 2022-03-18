import { List } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { TransactionItem } from "../components/TransactionItem";
const web3 = new Web3(window.ethereum)
const MyTest = () => {
    const txList = useSelector((state) => state.txList)
    const workingList = useSelector((state) => state.workingList)
    return (
        <List sx={{ minWidth: 600, bgcolor: 'background.paper', margin: 1 }}>
            {
                txList.map(transaction => {
                    return (
                        <TransactionItem key={transaction.key} tx={transaction} />
                    )
                })
            }
        </List>
    )
}
export default MyTest