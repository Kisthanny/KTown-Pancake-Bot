import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Tooltip from '@mui/material/Tooltip';
import Web3 from "web3";
import { pancake_contract } from "../ContractLib";
import { balanceOf } from "../../Web3Client";
import { useNotification } from "../Notification/NotificationProvider";
const web3 = new Web3(window.ethereum)

export const DepositButton = (props) => {
    const addNotification = useNotification()
    const { account, spender_contract, disabled } = props
    const [buttonColor, setButtonColor] = useState("primary");
    const [buttonStatus, setButtonStatus] = useState(false);
    const amountLimit = parseInt(Web3.utils.toWei('100'))

    const depositHandler = async () => {
        if (disabled) { return null }
        console.log(account.address)
        // check for approval
        const allowance = await pancake_contract.methods.allowance(account.address, spender_contract.options.address).call()
        if (allowance < amountLimit) {
            addNotification("warning", `${account.address} need approval`, 6000)
            return null
        }
        setButtonColor("default");
        setButtonStatus(true);
        // set amount
        let amount = parseInt(Web3.utils.toWei(await balanceOf(account.address, 'pancake')))

        // check if pool has limit
        // length = 44 to determine it is syrup pool
        if (spender_contract.options.jsonInterface.length == 44) {
            let hasUserLimit = await spender_contract.methods.hasUserLimit().call()
            if (hasUserLimit) {
                let userLimit = await spender_contract.methods.poolLimitPerUser().call()
                let userInfo = await spender_contract.methods.userInfo(account.address).call()
                userLimit -= userInfo[0]
                amount = amount > userLimit ? userLimit : amount
            }
        }
        if (amount <= 0) {
            addNotification("warning", `${account.address} insufficient balance or exceeded limit`, 6000)
            return null
        }
        amount = web3.utils.toBN(amount).toString()
        var tx = {
            from: account.address,
            to: spender_contract.options.address,
            gas: undefined,
            data: spender_contract.methods.deposit(amount).encodeABI()
        };
        tx.gas = Math.floor(await web3.eth.estimateGas(tx) * 1.2);
        console.log(tx)
        web3.eth.accounts.signTransaction(tx, account.privateKey).then(signedTx => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction).on("receipt", receipt => {
                console.log(receipt);
                addNotification("success", `${account.address} staked`)
            }).on("error", err => {
                console.log(err);
                setButtonColor("primary");
                setButtonStatus(false);
                addNotification("error", err, 10000)
            });
        });
    }
    return (
        <Tooltip title="deposit">
            <IconButton size="large" className="depositButton" color={buttonColor} onClick={depositHandler} disabled={buttonStatus}>
                <AddBoxIcon fontSize="large" />
            </IconButton>
        </Tooltip>
    )
}