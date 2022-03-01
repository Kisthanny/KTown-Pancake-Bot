import { useState } from "react";
import Button from "@mui/material/Button";
import Web3 from "web3";
import { pancake_contract } from "../ContractLib";
import { useNotification } from "../Notification/NotificationProvider";
const web3 = new Web3(window.ethereum)

export const WithdrawButton = (props) => {
    const addNotification = useNotification()
    const { account, spender_contract } = props
    const [buttonText, setButtonText] = useState("withdraw");
    const [buttonStatus, setButtonStatus] = useState(false);

    const withdrawHandler = async () => {
        // check for pool balance
        let userInfo = await spender_contract.methods.userInfo(account.address).call()
        if (parseInt(userInfo.amount) <= 0) {
            addNotification("warning", `${account.address}: insufficient amount`, 6000)
            return null
        }

        setButtonText("withdrawing");
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
                console.log(receipt);
                setButtonText("harvested");
                addNotification("success", `${account.address} successfully withdraw`)
            }).on("error", err => {
                console.log(err);
                setButtonText("withdraw again");
                setButtonStatus(false);
                addNotification("error", err, 10000)
            });
        });
    }
    return (
        <Button className="withdrawButton" variant="outlined" onClick={withdrawHandler} disabled={buttonStatus}>{buttonText}</Button>
    )
}