import { useNotification } from "../Notification/NotificationProvider";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Backdrop from '@mui/material/Backdrop';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import Web3 from "web3";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../state/index";
const web3 = new Web3(window.ethereum)

export default function MultipleTransferButton(props) {
    /* using redux */
    const dispatch_redux = useDispatch()
    const { addTX, startTransact, setTransactMode } = bindActionCreators(actionCreators, dispatch_redux)
    /* using redux */
    const { state, alignment } = props
    const addNotification = useNotification()
    const [anchorEl, setAnchorEl] = useState(null);
    const [abort, setAbort] = useState(false)
    const [buttonText, setButtonText] = useState("transfer")
    const [buttonEnable, setEnable] = useState(true)

    const open = Boolean(anchorEl);
    const id = open ? 'add-account-popover' : undefined;

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }

    async function transfer(from, to, token_contract, amount, to_offset = null, from_offset = null) {
        if (from.address == to.address) {
            addNotification("warning", "cannot transfer to yourself", 2000)
            return null
        }
        // get from account balance
        let from_balance = 0
        let to_balance = 0
        if (token_contract == "BNB") {
            from_balance = await web3.eth.getBalance(from.address)
            to_balance = await web3.eth.getBalance(to.address)
        } else {
            from_balance = await token_contract.methods.balanceOf(from.address).call()
            to_balance = await token_contract.methods.balanceOf(to.address).call()
        }
        if (from_balance <= 0) {
            addNotification("warning", `${from.address} insufficient balance`)
            return null
        }
        // set amount, revert if insufficient amount
        // if user defines offset
        if (to_offset) {
            amount = to_offset - to_balance
            console.log(amount)
        } else if (from_offset) {
            amount = from_balance - from_offset
            console.log(amount)
        }

        if (amount == 'MAX') {
            amount = from_balance
        } else if (parseInt(from_balance) < parseInt(amount)) {
            addNotification("warning", `${from.address} insufficient balance`)
            return null
        } else if (parseInt(amount) <= 0) {
            addNotification("warning", "amount should be more than 0")
            return null
        }
        amount = amount.toString()
        var tx
        if (token_contract == 'BNB') {
            tx = {
                from: from.address,
                to: to.address,
                value: amount,
                gas: undefined,
            }
        } else {
            tx = {
                from: from.address,
                to: token_contract.options.address,
                gas: undefined,
                data: token_contract.methods.transfer(to.address, amount).encodeABI()
            };
        }
        tx.gas = Math.floor(await web3.eth.estimateGas(tx) * 1.2);

        /* using redux */
        addTX(tx, from.privateKey)
    }
    async function singleToMultiple(from, to_arr, token, amount, to_offset = null) {
        setTransactMode("SYNC")
        amount = web3.utils.toWei(amount)
        if (to_offset) {
            to_offset = web3.utils.toWei(to_offset)
        }
        for (let index = 0; index < to_arr.length; index++) {
            if (abort) {
                console.log("should break")
                break
            }
            const to_account = to_arr[index];
            await transfer(from, to_account, token, amount, to_offset, undefined)
        }
        startTransact()
        handleClose()
    }

    async function multipleToSingle(from_arr, to, token, amount, from_offset = null) {
        setTransactMode("ASYNC")
        amount = amount == 'MAX' ? amount : web3.utils.toWei(amount)
        if (from_offset) {
            from_offset = web3.utils.toWei(from_offset)
        }
        for (let index = 0; index < from_arr.length; index++) {
            if (abort) { handleClose(); break }
            const from_account = from_arr[index];
            await transfer(from_account, to, token, amount, undefined, from_offset)
        }
        startTransact()
    }

    const handleTransfer = () => {
        addNotification("info", "sending transactions, don't close or refresh this tab", 10000)
        setButtonText("sending...")
        setEnable(false)
        handleClose()
        if (alignment == "s2m") {
            singleToMultiple(state.single, state.multiple, state.token, state.amount, state.to_offset)
        } else {
            multipleToSingle(state.multiple, state.single, state.token, state.amount, state.from_offset)
        }
    }
    const handleAbort = () => {
        setAbort("true")
        window.location.reload(false);
        addNotification("warning", "transaction canceled", 6000)
    }

    const popoverContent = () => {
        return (
            <Box sx={{ minWidth: 200 }}>
                <Card>
                    <CardHeader
                        sx={{ px: 2, py: 1 }}
                        title="Sure to transact?"
                    />
                    <CardContent>
                        <Typography variant="h6">
                            from
                        </Typography>
                        <Typography variant="subtitle2">
                            {alignment == "s2m" ? state.single ? state.single.address : "undefined" : `${state.multiple.length} accounts`}
                        </Typography>
                        <Typography variant="h6">
                            to
                        </Typography>
                        <Typography variant="subtitle2">
                            {alignment == "m2s" ? state.single ? state.single.address : "undefined" : `${state.multiple.length} accounts`}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" color="success" onClick={handleTransfer}>yes, proceed</Button>
                        <Button variant="outlined" color="error" onClick={handleClose}>No, cancel</Button>
                    </CardActions>
                </Card>
            </Box>
        )
    }
    return (

        <Box>
            <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                disabled={!(buttonEnable && state.single && state.multiple.length > 0 && state.token && (state.amount || state.to_offset || state.from_offset))}
                aria-label="transfer icon"
                onClick={handleOpen}
            >
                {buttonText}
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 300, left: 300 }}
            >
                {popoverContent()}
            </Popover>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            />
        </Box>
    )
}
