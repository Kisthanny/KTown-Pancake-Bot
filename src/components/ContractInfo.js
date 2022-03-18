import { useState, useEffect } from "react";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Web3 from "web3";
import IBEP20 from "../contracts/abi/IBEP20.json";
import { ContractCard } from "./ContractCard";
import { useNotification } from "./Notification/NotificationProvider";
const web3 = new Web3(window.ethereum)
export const ContractInfo = (props) => {
    const addNotification = useNotification()
    const [symbol, setSymbol] = useState('')
    const [blockTillStart, setBlockTillStart] = useState(0)
    const { privateWallet, contract, deleteContract } = props

    const deleteHandler = () => {
        deleteContract(contract)
    }
    const [anchorEl, setAnchorEl] = useState(null);
    async function targetHandler(event) {
        setAnchorEl(event.currentTarget)
    }
    const open = Boolean(anchorEl);
    const id = open ? 'contract-info-card-popover' : undefined;

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleListItemClick = (event) => {
        navigator.clipboard.writeText(contract.options.address)
        addNotification("info", "copied to clipboard", 2000)
    };

    function secToDay(seconds) {
        // just a function converting seconds to [day,hour,minute]
        let day = Math.floor(seconds / (86400))
        let hour = Math.floor(seconds % (86400) / 3600)
        let minute = Math.floor(seconds % 3600 / 60)
        return `${day > 0 ? day + ' day' : ''} ${hour > 0 ? hour + ' hour' : ''} ${minute > 0 ? minute + ' minute' : ''}`
    }

    useEffect(() => {
        let isSubscribed = true
        if (contract.options.address == '0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8') {
            setSymbol('IFO POOL')
            return null
        } else if (contract.options.address == '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC') {
            setSymbol('AUTO CAKE')
            return null
        } else {
            contract.methods.rewardToken().call().then(address => {
                if (!isSubscribed) { return null }
                const reward_token = new web3.eth.Contract(IBEP20, address)
                reward_token.methods.symbol().call().then(resp => {
                    if (!isSubscribed) { return null }
                    setSymbol(resp)
                })
            })
        }
        web3.eth.getBlockNumber().then(blockNum => {
            if (!isSubscribed) { return null }
            contract.methods.startBlock().call().then(startBlock => {
                if (!isSubscribed) { return null }
                setBlockTillStart(Number(startBlock) - Number(blockNum))
            })
        })
        return () => (isSubscribed = false)
    }, [])
    return (
        <ListItem
            key={contract.options.address}
            secondaryAction={
                <Box>
                    <Tooltip title="interact">
                        <IconButton edge="start" aria-label="target" color="primary" onClick={targetHandler}>
                            <GpsFixedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="delete">
                        <IconButton edge="end" aria-label="delete" onClick={deleteHandler}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            }
            disablePadding
        >
            <ListItemButton
                onClick={handleListItemClick}
                divider={true}
            >
                <ListItemText
                    primary={blockTillStart > 0 ? `${symbol} starts at approx ${secToDay(blockTillStart * 3)}` : symbol}
                    secondary={contract.options.address}
                />
            </ListItemButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 200, left: 400 }}
            >
                <ContractCard contract={contract} symbol={symbol} privateWallet={privateWallet}></ContractCard>
            </Popover>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            />
        </ListItem>
    )
}