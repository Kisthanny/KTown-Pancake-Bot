import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import Tooltip from '@mui/material/Tooltip';
import Web3 from "web3";
import { useNotification } from "../Notification/NotificationProvider";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../state/index";
const web3 = new Web3(window.ethereum)

export const WithdrawButton = (props) => {
    const addNotification = useNotification()
    const { account, spender_contract, disabled } = props
    const [buttonColor, setButtonColor] = useState("primary");
    const [buttonStatus, setButtonStatus] = useState(false);
    /* using redux */
    const dispatch_redux = useDispatch()
    const { addTX } = bindActionCreators(actionCreators, dispatch_redux)
    /* using redux */

    const withdrawHandler = async () => {
        if (disabled) { return null }
        // check for pool balance
        let userInfo = await spender_contract.methods.userInfo(account.address).call()
        if (parseInt(userInfo.amount) <= 0) {
            addNotification("warning", `${account.address}: insufficient amount`, 6000)
            return null
        }

        setButtonColor("default");
        setButtonStatus(true);
        var tx = {
            from: account.address,
            to: spender_contract.options.address,
            gas: undefined,
            data: spender_contract.options.addres != '0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8' ? spender_contract.methods.withdraw(userInfo.amount).encodeABI() : spender_contract.methods.withdrawAll().encodeABI()
        };
        tx.gas = Math.floor(await web3.eth.estimateGas(tx) * 1.2);
        web3.eth.accounts.signTransaction(tx, account.privateKey).then(signedTx => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction).on("receipt", receipt => {
                addTX({
                    from: account.address,
                    status: "success",
                    txHash: receipt.transactionHash
                }, account.privateKey)
                addNotification("success", `${account.address} withdrawed`)
            }).on("error", err => {
                addTX({
                    from: account.address,
                    status: "error",
                    txHash: err[1].transactionHash
                }, account.privateKey)
                setButtonColor("primary");
                setButtonStatus(false);
                addNotification("error", err.message, 10000)
            });
        });
    }
    return (
        <Tooltip title="withdraw">
            <IconButton className="withdrawButton" color={buttonColor} onClick={withdrawHandler} disabled={buttonStatus}>
                <IndeterminateCheckBoxIcon fontSize="large" />
            </IconButton>
        </Tooltip>
    )
}