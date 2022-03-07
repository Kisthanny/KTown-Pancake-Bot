import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Web3 from "web3";
import { pancake_contract } from "../ContractLib";
import { useNotification } from "../Notification/NotificationProvider";
const web3 = new Web3(window.ethereum)

export const ApproveButton = (props) => {
    const addNotification = useNotification()
    const { account, spender_contract, disabled } = props
    const [buttonText, setButtonText] = useState("approve");
    const [buttonStatus, setButtonStatus] = useState(false);
    const limit = web3.utils.toWei('1000')

    const approveHandler = async () => {
        if (disabled) { return null }
        const allowance = await pancake_contract.methods.allowance(account.address, spender_contract.options.address).call()
        if (allowance >= parseInt(Web3.utils.toWei('100'))) {
            setButtonText("approved")
            setButtonStatus(true)
            addNotification("info", `${account.address} already approved`)
            return null
        }

        setButtonText("approving");
        setButtonStatus(true);
        var tx = {
            from: account.address,
            to: pancake_contract.options.address,
            gas: undefined,
            data: pancake_contract.methods.approve(spender_contract.options.address, limit).encodeABI()
        };
        tx.gas = Math.floor(await web3.eth.estimateGas(tx) * 1.2);
        web3.eth.accounts.signTransaction(tx, account.privateKey).then(signedTx => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction).on("receipt", receipt => {
                console.log(receipt);
                setButtonText("approved");
                addNotification("success", `${account.address} approved`)
            }).on("error", err => {
                console.log(err.message);
                setButtonText("approve again");
                setButtonStatus(false);
                addNotification("error", err.message, 10000)
            });
        });
    }
    return (
        <Button className="approveButton" variant="outlined" onClick={approveHandler} disabled={buttonStatus}>{buttonText}</Button>
    )
}