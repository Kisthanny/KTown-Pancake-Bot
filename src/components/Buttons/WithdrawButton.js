import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import Tooltip from '@mui/material/Tooltip';
import Web3 from "web3";
import { useNotification } from "../Notification/NotificationProvider";
import { v4 } from "uuid";
import emitter from "../../events/events";
const web3 = new Web3(window.ethereum)

export const WithdrawButton = (props) => {
    const addNotification = useNotification()
    const { account, spender_contract, disabled } = props
    const [buttonColor, setButtonColor] = useState("primary");
    const [buttonStatus, setButtonStatus] = useState(false);

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
        emitter.emit('addTask', {
            tx: tx,
            fromAccount: account.address,
            privateKey: account.privateKey,
            key: v4(),
            transactionHash: '0x',
            status: "pending"
        })
        /* web3.eth.accounts.signTransaction(tx, account.privateKey).then(signedTx => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction).on("receipt", receipt => {
                console.log(receipt);
                addNotification("success", `${account.address} successfully withdraw`)
            }).on("error", err => {
                console.log(err);
                setButtonColor("primary");
                setButtonStatus(false);
                addNotification("error", err, 10000)
            });
        }); */
    }
    return (
        <Tooltip title="withdraw">
            <IconButton className="withdrawButton" color={buttonColor} onClick={withdrawHandler} disabled={buttonStatus}>
                <IndeterminateCheckBoxIcon fontSize="large" />
            </IconButton>
        </Tooltip>
    )
}