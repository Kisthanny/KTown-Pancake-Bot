import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import emitter from "../events/events";
import { useEffect, useReducer, useState, useRef } from "react";
import { TransactionItem } from "./TransactionItem";
import { v4 } from "uuid";
import Web3 from "web3";
const web3 = new Web3(window.ethereum)
export const TransactionCenter = () => {
    const [testState, setTest] = useState(0)

    const menuRef = useRef(null);

    const [anchorElTransaction, setAnchorElTransaction] = useState(null);

    const [onTransact, setOnTransact] = useState(false)

    const handleOpenUserMenu = (event) => {
        setAnchorElTransaction(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElTransaction(null)
    };
    const [transactions, dispatch] = useReducer((transactions, action) => {
        switch (action.type) {
            case "ADD_TRANSACTION":
                return [...transactions, { ...action.payload }];
            case "DELETE_TRANSACTION":
                return transactions.filter(transaction => transaction.signedTx.transactionHash != action.tx);
            case "UPDATE_STATUS":
                var updatedObj = transactions.filter(tx => tx.key == action.payload.key)[0]
                var index = transactions.indexOf(updatedObj)
                updatedObj.status = action.payload.status
                var copy = transactions
                copy[index] = updatedObj
                return copy;
            case "UPDATE_HASH":
                var updatedObj = transactions.filter(tx => tx.key == action.payload.key)[0]
                var index = transactions.indexOf(updatedObj)
                updatedObj.transactionHash = action.payload.transactionHash
                var copy = transactions
                copy[index] = updatedObj
                return copy;
            default:
                return transactions;
        }
    }, [])

    var taskFlow = []
    var addressInWorking = []
    function requestWork() {
        taskFlow.forEach(task => {
            if (addressInWorking.indexOf(task.fromAccount) >= 0) {
                // this address is sending another transaction, it should wait
            } else {
                addressInWorking.push(task.fromAccount)
                taskFlow.splice(taskFlow.indexOf(task), 1)
                web3.eth.accounts.signTransaction(task.tx, task.privateKey).then(signedTx => {
                    web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('transactionHash', hash => {
                        dispatch({
                            type: "UPDATE_HASH",
                            payload: {
                                key: task.key,
                                transactionHash: hash
                            }
                        })
                        dispatch({
                            type: "UPDATE_STATUS",
                            payload: {
                                key: task.key,
                                status: 'sent'
                            }
                        })
                        setOnTransact(true)
                    }
                    ).on('receipt', receipt => {
                        dispatch({
                            type: "UPDATE_STATUS",
                            payload: {
                                key: task.key,
                                status: 'success'
                            }
                        })
                        setOnTransact(false)
                        addressInWorking.splice(addressInWorking.indexOf(task.fromAccount), 1)
                    }).on('error', err => {
                        dispatch({
                            type: "UPDATE_STATUS",
                            payload: {
                                key: task.key,
                                status: 'error'
                            }
                        })
                        console.log(err.message)
                        setOnTransact(false)
                        addressInWorking.splice(addressInWorking.indexOf(task.fromAccount), 1)
                    })
                })
            }
        })
        if (taskFlow.length > 0) {
            setTimeout(() => {
                setOnTransact(true)
                requestWork()
            }, 2000);
        }
    }

    useEffect(() => {
        emitter.addListener('addTask', (task) => {
            dispatch({
                type: 'ADD_TRANSACTION',
                payload: task
            })
            taskFlow.push(task)
        })
        emitter.addListener('startTask', () => {
            setOnTransact(true)
            requestWork()
            menuRef.current.click()
        })
        return () => {
            emitter.removeListener('addTask')
            emitter.removeListener('startTask')
        }
    }, [])



    const OpenButton = () => {
        if (onTransact) {
            return (
                <CircularProgress style={{ color: '#f5f5f5' }} />
            )
        } else {
            return (
                <ReceiptLongIcon style={{ color: '#f5f5f5' }} />
            )
        }
    }
    const TransactionList = () => {
        if (transactions.length > 0) {
            return (
                transactions.map((transaction) => (
                    <TransactionItem key={transaction.key} txid={transaction.key} transactions={transactions} />
                ))
            )
        } else {
            return (
                <Box sx={{ p: 2 }}>
                    <Typography variant="body2" gutterBottom>
                        Looks like there is no record of any transaction here
                    </Typography>
                </Box>
            )
        }
    }
    return (
        <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} ref={menuRef}>
                <OpenButton />
            </IconButton>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElTransaction}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElTransaction)}
                onClose={handleCloseUserMenu}
            >
                <TransactionList />
            </Menu>
        </Box>
    )
}