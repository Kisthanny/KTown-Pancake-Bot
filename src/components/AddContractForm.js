import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Web3 from "web3";
import { useState } from "react";
import { ChefButton } from "./Buttons/ChefButton";
const web3 = new Web3(window.ethereum)
export const AddContractForm = (props) => {
    const { addContract, updateLocalStorage } = props
    const [contractAddress, setContractAddress] = useState('')
    const [iconColor, setIconColor] = useState("default")
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'add-account-popover' : undefined;

    const handleClose = () => {
        setAnchorEl(null);
    };
    const inputHandler = (e) => {
        setContractAddress(e.target.value)
        web3.utils.isAddress(e.target.value) ? setIconColor("secondary") : setIconColor("default")
    }
    const submitHandler = (e) => {
        e.preventDefault()
        addContract(contractAddress)
        setContractAddress('')
    }

    const addContractButton = () => {
        return (
            <InputAdornment position="end">
                <IconButton onClick={submitHandler}>
                    <AddCircleIcon edge="end" color={iconColor} />
                </IconButton>
            </InputAdornment>
        )
    }
    return (
        <Box sx={{ minWidth: 300 }}>
            <Button
                color="success"
                startIcon={<AddCircleIcon />}
                fullWidth
                variant="contained"
                onClick={handleClick}
                sx={{ mx: 1 }}
            >
                Add Contract
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 100, left: 200 }}
            >
                <Box sx={{ borderBottom: 1, borderColor: 'divider', m: 2 }}>
                    <ChefButton updateLocalStorage={updateLocalStorage} />
                    <TextField
                        value={contractAddress}
                        onChange={inputHandler}
                        id="contract_address"
                        placeholder="Enter Syrup Pool Address"
                        label="add Syrup Pool"
                        sx={{ minWidth: 660, padding: 1 }}
                        InputProps={{
                            endAdornment: addContractButton()
                        }}
                        helperText="the green CHEF button automatically import fresh SYRUP in 2 weeks from CHEF contract"
                    />
                </Box>
            </Popover>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            />
        </Box>
    )
}