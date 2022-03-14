import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import ButtonGroup from '@mui/material/ButtonGroup';
import { ApproveButton } from "./Buttons/ApproveButton"
import { DepositButton } from "./Buttons/DepositButton.js"
import { WithdrawButton } from "./Buttons/WithdrawButton.js"
import { useState, useEffect } from "react";
import Web3 from 'web3';
import { pancake_contract } from "./ContractLib";
export const TransactGroup = (props) => {
    const { account, handleToggle, checked, contract } = props
    var disabled = checked.indexOf(account) == -1
    const [userAmount, setUserAmount] = useState(0)
    const [userAllowance, setAllowance] = useState(0)
    const [reward, setReward] = useState(0)

    const SecondaryNode = () => {
        if (userAllowance >= parseInt(Web3.utils.toWei('100'))) {
            return (
                <ButtonGroup edge="end" variant="outlined" size="small" color="secondary" aria-label="single transact group">
                    <DepositButton account={account} spender_contract={contract} disabled={disabled} />
                    <WithdrawButton account={account} spender_contract={contract} disabled={disabled} />
                </ButtonGroup>
            )
        } else {
            return (
                <ButtonGroup edge="end" variant="outlined" size="small" color="secondary" aria-label="single transact group">
                    <ApproveButton account={account} spender_contract={contract} disabled={disabled} />
                </ButtonGroup>
            )
        }
    }
    const specialPools = ["0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8", "0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC"]
    useEffect(() => {
        let isSubscribed = true

        contract.methods.userInfo(account.address).call().then(userInfo => {
            if (!isSubscribed) { return null }
            setUserAmount(parseFloat(Web3.utils.fromWei(userInfo[0])).toFixed(2))
        })

        pancake_contract.methods.allowance(account.address, contract.options.address).call().then(allowance => {
            if (!isSubscribed) { return null }
            setAllowance(allowance)
        })

        if (specialPools.indexOf(contract.options.address) == -1) {
            contract.methods.pendingReward(account.address).call().then(pendingReward => {
                if (!isSubscribed) { return null }
                setReward(parseFloat(Web3.utils.fromWei(pendingReward)).toFixed(2))
            })
        }

        return () => (isSubscribed = false)
    }, [])
    return (
        <ListItem
            secondaryAction={
                <SecondaryNode />
            }
        >
            <ListItemButton role={undefined} onClick={handleToggle(account)} dense>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={checked.indexOf(account) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': account.address }}
                    />
                </ListItemIcon>
                <ListItemText id={account.address} primary={account.address} secondary={`amount: ${userAmount} --- reward: ${reward}`} />
            </ListItemButton>
        </ListItem>
    )
}