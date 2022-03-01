import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tooltip from '@mui/material/Tooltip';
import Backdrop from '@mui/material/Backdrop';
import Web3 from "web3";
import { useState } from "react";
const web3 = new Web3(window.ethereum)
export const AddAccountForm = ({ addAccount, addAccountGroup, clearAccount }) => {
    const [privateKey, setPrivateKey] = useState("")
    const [privateKeyGroup, setPrivateKeyGroup] = useState("")
    const [iconColor, setIconColor] = useState("default")
    const [anchorEl, setAnchorEl] = useState(null);
    const [value, setValue] = useState('1');

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'add-account-popover' : undefined;

    const handleClose = () => {
        setAnchorEl(null);
    };
    const inputHandler = (e) => {
        if (e.target.id == 'private_key') {
            setPrivateKey(e.target.value)
        } else if (e.target.id == 'private_key_group') {
            setPrivateKeyGroup(e.target.value)
        }
        if (e.target.value.length >= 64) {
            setIconColor("secondary")
        } else {
            setIconColor("default")
        }
    }
    const addAccountHandler = (e) => {
        e.preventDefault()
        addAccount(privateKey)
        setPrivateKey('')
    }
    const addGroupHandler = (e) => {
        e.preventDefault()
        const pk_arr = privateKeyGroup.replaceAll(/\s/g, '').split(',')
        addAccountGroup(pk_arr)
        setPrivateKeyGroup('')
    }
    const clearAccountHandler = (e) => {
        e.preventDefault()
        clearAccount()
    }
    const addAccountButton = () => {
        return (
            <InputAdornment position="end">
                <IconButton onClick={addAccountHandler}>
                    <AddCircleIcon edge="end" color={iconColor} />
                </IconButton>
            </InputAdornment>
        )
    }
    const addMultipleButton = () => {
        return (
            <InputAdornment position="end">
                <IconButton onClick={addGroupHandler}>
                    <AddCircleIcon edge="end" color={iconColor} />
                </IconButton>
            </InputAdornment>
        )
    }
    return (
        <Box sx={{ minWidth: 300, margin: 2 }}>
            <Tooltip title="this will clear your local storage" followCursor arrow placement="bottom-start">
                <Button
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    fullWidth
                    variant='outlined'
                    onClick={clearAccountHandler}
                    sx={{ m: 1 }}
                >
                    Clear All Accounts
                </Button>
            </Tooltip>
            <Button
                color="success"
                startIcon={<AddCircleIcon />}
                fullWidth
                variant="contained"
                onClick={handleClick}
                sx={{ mx: 1 }}
            >
                Add Account
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 100, left: 200 }}
            >
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleTabChange} aria-label="add account tabs" centered>
                            <Tab label="Add Single Account" value="1" />
                            <Tab label="Add Multiple Account" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Tooltip title={"public address => read-only account, private key => payable account"}>
                            <TextField
                                id='private_key'
                                value={privateKey}
                                onChange={inputHandler}
                                placeholder="Enter Your Private Key To Add a Payable Account"
                                helperText="public address => read-only account, private key => payable account"
                                label="add account"
                                InputProps={{
                                    endAdornment: addAccountButton()
                                }}
                                sx={{ minWidth: 660, padding: 1 }}
                            />
                        </Tooltip>
                    </TabPanel>
                    <TabPanel value="2">
                        <TextField onChange={inputHandler}
                            id="private_key_group"
                            value={privateKeyGroup}
                            onChange={inputHandler}
                            helperText="use comma( , ) to seperate your keys"
                            label="add multiple accounts"
                            placeholder={"privateKey_1, \nprivateKey_2, \n... , \nprivatekey_n"}
                            multiline
                            minRows={5}
                            InputProps={{
                                endAdornment: addMultipleButton()
                            }}
                            sx={{ minWidth: 660, padding: 1 }}
                        />
                    </TabPanel>
                </TabContext>
            </Popover>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            />
        </Box>
    )
}