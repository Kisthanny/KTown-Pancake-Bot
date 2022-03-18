import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Tooltip from '@mui/material/Tooltip';
import Web3 from "web3";
import { pancake_contract } from "../ContractLib";
import { balanceOf } from "../../Web3Client";
import { useNotification } from "../Notification/NotificationProvider";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../state/index";
const web3 = new Web3(window.ethereum)

const specialPools = ["0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8", "0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC"]
export const DepositButton = (props) => {
    const addNotification = useNotification()
    const { account, spender_contract, disabled } = props
    const [buttonColor, setButtonColor] = useState("primary");
    const [buttonStatus, setButtonStatus] = useState(false);
    const amountLimit = parseInt(Web3.utils.toWei('100'))

    /* using redux */
    const dispatch_redux = useDispatch()
    const { addTX } = bindActionCreators(actionCreators, dispatch_redux)
    /* using redux */

    const depositHandler = async () => {
        if (disabled) { return null }
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
            if (specialPools.indexOf(spender_contract.options.address) == -1) {
                let hasUserLimit = await spender_contract.methods.hasUserLimit().call()
                if (hasUserLimit) {
                    let userLimit = await spender_contract.methods.poolLimitPerUser().call()
                    let userInfo = await spender_contract.methods.userInfo(account.address).call()
                    userLimit -= userInfo[0]
                    amount = amount > userLimit ? userLimit : amount
                }
            }
        } else {
            console.log("not syrup")
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
        web3.eth.accounts.signTransaction(tx, account.privateKey).then(signedTx => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction).on("receipt", receipt => {
                addTX({
                    from: account.address,
                    status: "success",
                    txHash: receipt.transactionHash
                }, account.privateKey)
                addNotification("success", `${account.address} staked`)
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
        <Tooltip title="deposit">
            <IconButton size="large" className="depositButton" color={buttonColor} onClick={depositHandler} disabled={buttonStatus}>
                <AddBoxIcon fontSize="large" />
            </IconButton>
        </Tooltip>
    )
}