import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Backdrop from '@mui/material/Backdrop';
import { TransactGroup } from "./TransactGroup.js";
import { useState } from "react";
import { CardContent, Typography } from '@mui/material';
import { useNotification } from './Notification/NotificationProvider';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}
export function ContractCard(props) {
    const addNotification = useNotification()
    const { contract, symbol, privateWallet } = props
    const [checked, setChecked] = useState(privateWallet);
    const [anchorEl, setAnchorEl] = useState(null);
    const [type, setType] = useState("")

    const open = Boolean(anchorEl);
    const id = open ? 'transact-popover' : undefined;

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setType(event.currentTarget.id)
        //setType(_type)
    }
    const handleTransact = () => {
        switch (type) {
            case "Approve_all":
                approveAllHandler()
                break;
            case "Deposit_all":
                depositAllHandler()
                break;
            case "Withdraw_all":
                withdrawAllHandler()
                break
            default:
                break;
        }
        handleClose()
        addNotification("info", "please wait till all transaction are done...", 10000)
    }
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    const numberOfChecked = (items) => intersection(checked, items).length;
    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    }

    async function approveAllHandler() {
        const elements = document.getElementsByClassName("approveButton")
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];

            element.click()
        }
    }
    async function depositAllHandler() {
        const elements = document.getElementsByClassName("depositButton")
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];

            element.click()
        }
    }
    async function withdrawAllHandler() {
        const elements = document.getElementsByClassName("withdrawButton")
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];

            element.click()
        }
    }
    return (
        <List sx={{ width: 800, maxWidth: 1080, bgcolor: 'background.paper' }}>
            <ListItemText
                primary={symbol}
                secondary={contract.options.address}
                sx={{ pl: 5 }}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& > *': {
                        m: 1,
                    },
                }}
            >
                <ButtonGroup variant="outlined" aria-label="multiple transact group">
                    <Button id="Approve_all" onClick={handleOpen}>Approve Selected</Button>
                    <Button id="Deposit_all" onClick={handleOpen}>Stake Selected</Button>
                    <Button id="Withdraw_all" onClick={handleOpen}>Withdraw Selected</Button>
                </ButtonGroup>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    anchorReference="anchorEl"
                    anchorPosition={{ top: 300, left: 300 }}
                    onClose={handleClose}
                >
                    <Box>
                        <Card>
                            <CardHeader
                                sx={{ px: 2, py: 1 }}
                                title={`Sure to ${type}?`}
                            />
                        </Card>
                        <CardContent>
                            <Typography variant='h6'>
                                {symbol}
                            </Typography>
                            <Typography variant="subtitle2">
                                {contract.options.address}
                            </Typography>
                            <Typography variant='h6'>
                                {`${numberOfChecked(privateWallet)} accounts`}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="outlined" color="success" onClick={handleTransact}>yes, proceed</Button>
                            <Button variant="outlined" color="error" onClick={handleClose}>No, cancel</Button>
                        </CardActions>
                    </Box>
                </Popover>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                />
            </Box>
            <ListItem>
                <CardHeader
                    sx={{ px: 2, py: 1 }}
                    avatar={
                        <Checkbox
                            onClick={handleToggleAll(privateWallet)}
                            edge="start"
                            checked={numberOfChecked(privateWallet) === privateWallet.length && privateWallet.length !== 0}
                            indeterminate={
                                numberOfChecked(privateWallet) !== privateWallet.length && numberOfChecked(privateWallet) !== 0
                            }
                            disabled={privateWallet.length === 0}
                            inputProps={{
                                'aria-label': 'all accounts selected',
                            }}
                        />
                    }
                    title="Select Multiple"
                    subheader={`${numberOfChecked(privateWallet)}/${privateWallet.length} selected`}
                />
            </ListItem>
            <Divider />
            {privateWallet.map(account => {
                return (
                    <TransactGroup key={account.address} account={account} handleToggle={handleToggle} checked={checked} contract={contract} />
                )
            })}
        </List>
    )
}