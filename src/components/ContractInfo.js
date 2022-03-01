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
    const { wallet, contract, deleteContract } = props
    async function getSymbol() {
        if (contract.options.address == '0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8') {
            setSymbol('IFO POOL')
            return null
        } else if (contract.options.address == '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC') {
            setSymbol('AUTO CAKE')
            return null
        } else {
            contract.methods.rewardToken().call().then(address => {
                const reward_token = new web3.eth.Contract(IBEP20, address)
                reward_token.methods.symbol().call().then(resp => {
                    setSymbol(resp)
                })
            })
        }
    }

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
    useEffect(() => {
        getSymbol();
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
                    primary={symbol}
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
                <ContractCard contract={contract} symbol={symbol} wallet={wallet} ></ContractCard>
            </Popover>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            />
        </ListItem>
    )
}