import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState, useRef, useEffect } from "react";
import { TransactionItem } from "./TransactionItem";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state/index";
import Web3 from "web3";
import { useNotification } from './Notification/NotificationProvider';
const web3 = new Web3(window.ethereum)
export const TransactionCenter = () => {
    const addNotification = useNotification()

    const menuRef = useRef(null);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const open = Boolean(anchorEl);

    const id = open ? 'simple-popper' : undefined;

    const handleClose = () => {
        setAnchorEl(null);
    };
    /* using redux */
    const transactMode = useSelector((state) => state.transactMode)
    const transactSwitch = useSelector((state) => state.transactSwitch)
    const workingList = useSelector((state) => state.workingList)
    //const workflow = useSelector((state) => state.workflow)
    const txList = useSelector((state) => state.txList)
    const dispatch = useDispatch()
    const { addWorkingAccount, removeWorkingAccount, addWork, updateTX, endTransact } = bindActionCreators(actionCreators, dispatch)
    /* using redux */
    let onTransact = workingList.length > 0 ? true : false

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
        if (txList.length > 0) {
            return (
                txList.map((transaction) => (
                    <TransactionItem key={transaction.key} tx={transaction} txHash={transaction.txHash} status={transaction.status} />
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
    var workingListTemp = []
    function startWork() {
        console.log("should start")
        //open the transaction center
        if (!open) { menuRef.current.click() }
        let pending = false
        //loop through the txList
        for (let index = 0; index < txList.length; index++) {
            let transaction = txList[index];
            //only deal with pending transaction
            console.log(transaction.status)
            if (transaction.status == "pending") {
                //check if this account is sending another transaction
                if (workingListTemp.indexOf(transaction.privateKey) < 0) {
                    workingListTemp.push(transaction.privateKey)
                    //now send transaction
                    web3.eth.accounts.signTransaction(transaction.tx, transaction.privateKey).then(singedTx => {
                        web3.eth.sendSignedTransaction(singedTx.rawTransaction).once("transactionHash", txHash => {
                            updateTX(transaction.key, {
                                status: "sending",
                                txHash: txHash
                            })
                        }).on("receipt", receipt => {
                            updateTX(transaction.key, {
                                status: "success"
                            })
                            addNotification("success", "transaction success", 6000)
                            workingListTemp.splice(workingListTemp.indexOf(transaction.privateKey), 1)
                        }).on("error", err => {
                            updateTX(transaction.key, {
                                status: "error"
                            })
                            workingListTemp.splice(workingListTemp.indexOf(transaction.privateKey), 1)
                            addNotification("error", err.message, 6000)
                        })
                    })
                } else { pending = true }
            }
        }
        // another loop, until there are no pending transaction
        if (pending) {
            //pending = false
            setTimeout(() => {
                console.log("another loop")
                startWork()
            }, 3000)
        }
        console.log("end work")
    }

    useEffect(() => {
        if (transactSwitch) {
            startWork()
            endTransact()
        }
    }, [transactSwitch])

    return (
        <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleClick} ref={menuRef}>
                <OpenButton />
            </IconButton>
            <Popover
                sx={{ mt: '45px' }}
                id={id}
                anchorEl={anchorEl}
                keepMounted={true}
                open={open}
                onClose={handleClose}
            >
                <Box sx={{ border: 1, bgcolor: 'background.paper' }}>
                    <TransactionList />
                </Box>
            </Popover>
        </Box>
    )
}