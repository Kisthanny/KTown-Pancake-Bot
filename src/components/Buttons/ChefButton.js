import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Web3 from "web3";
import { useState, useEffect } from "react";
import { useNotification } from '../Notification/NotificationProvider';
const web3 = new Web3(window.ethereum)
export const ChefButton = (props) => {
    const addNotification = useNotification()
    const [chefAddress, setChefAddress] = useState("")
    const [inputText, setInputText] = useState("")
    const [open, setOpen] = useState(false);
    const [buttonStatus, setButtonStatus] = useState(false)
    const { updateLocalStorage } = props
    async function fetchAsync(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }
    const updateChef = () => {
        setButtonStatus(true)
        setOpen(true)
        web3.eth.getBlockNumber()
            .then(currentHeight => {
                const startBlock = currentHeight - 600000
                const url = `https://api.bscscan.com/api?module=account&action=txlistinternal&address=${chefAddress}&startblock=` + startBlock.toString() + "&endblock=" + currentHeight.toString() + "&page=1&offset=10&sort=asc&apikey=" + process.env.REACT_APP_BSCSCAN_API_KEY
                fetchAsync(url).then(data => {
                    data.result.reverse().map(tx => {
                        console.log(tx.contractAddress)
                        updateLocalStorage(tx.contractAddress)
                    })
                    setButtonStatus(false)
                    setOpen(false)
                    window.location.reload(false);
                })
            })
    }
    const title = `update from CHEF: ${chefAddress}`
    function changeChefHandler() {
        if (web3.utils.isAddress(inputText)) {
            localStorage.setItem("pancake_chef_address", inputText)
            setChefAddress(inputText)
            addNotification("success", `CHEF changed to ${inputText}`, 6000)
            setInputText("")
        } else {
            addNotification("error", "please enter the correct form of CHEF address", 10000)
        }
    }
    const changeChefButton = () => {
        return (
            <InputAdornment position="end">
                <IconButton onClick={changeChefHandler}>
                    <AddCircleIcon edge="end" color="secondary" />
                </IconButton>
            </InputAdornment>
        )
    }
    const inputHandler = (e) => {
        setInputText(e.target.value)
    }
    const [requireChange, setRequireChange] = useState(false)
    const changeChefDom = () => {
        if (!requireChange) {
            return (
                <Button onClick={() => { setRequireChange(true) }}>change chef</Button>
            )
        } else {
            return (
                <TextField
                    id='change_chef'
                    value={inputText}
                    onChange={inputHandler}
                    placeholder="Enter new CHEF address"
                    hiddenLabel
                    variant="filled"
                    size="small"
                    InputProps={{
                        endAdornment: changeChefButton()
                    }}
                    sx={{ minWidth: 500, padding: 1 }}
                />
            )
        }
    }

    useEffect(() => {
        setChefAddress(localStorage.getItem("pancake_chef_address"))
    }, [])
    return (
        <div>
            <Tooltip title={title}>
                <IconButton onClick={updateChef} disabled={buttonStatus}>
                    <SoupKitchenIcon color="success" />
                </IconButton>
            </Tooltip>
            {changeChefDom()}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}