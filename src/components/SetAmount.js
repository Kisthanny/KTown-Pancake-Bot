import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
import { useState } from "react";
export default function SetAmount(props) {
    const { alignment, dispatch } = props
    const [amount, setAmount] = useState("")
    const [helperText, setHelperText] = useState("")
    const [color, setColor] = useState("primary")
    const [textType, setTextType] = useState("number")
    const [error, setError] = useState(false)
    const [visible, setVisible] = useState('hidden')
    const [offset, setOffset] = useState("")
    function handleChange(e) {
        if (e.target.value < 0) {
            dispatch({ type: "CLEAR_AMOUNT" })
            setError(true)
            setAmount("")
            setHelperText(" * cannot set amount lower than 0 !")
        } else if (e.target.value == "") {
            dispatch({ type: "CLEAR_AMOUNT" })
        } else {
            dispatch({ type: "SET_AMOUNT", payload: e.target.value })
            setError(false)
            setHelperText("")
            setColor("success")
            setAmount(e.target.value)
        }
    }
    function handleClick(e) {
        if (e.target.value == "MAX") {
            setAmount("")
            setColor("primary")
            setHelperText("")
            setTextType("number")
            dispatch({ type: "CLEAR_AMOUNT" })
        }
    }
    function handleMax() {
        setTextType("text")
        setAmount("MAX")
        setColor("success")
        setHelperText("will transfer all balance")
        dispatch({ type: "SET_AMOUNT", payload: "MAX" })
    }
    const adornment = () => {
        return (
            <InputAdornment position="end">
                <Button disabled={alignment == "m2s" ? false : true} onClick={handleMax} color={color}>MAX</Button>
            </InputAdornment>
        )
    }
    function handleAdvanceClick() {
        setVisible('visible')
    }
    function handleOffsetChange(e) {
        if (e.target.value < 0) {
            dispatch({ type: "CLEAR_OFFSET" })
            setError(true)
            setOffset("")
            setHelperText(" * cannot set amount lower than 0 !")
        } else if (e.target.value == "") {
            dispatch({ type: "CLEAR_OFFSET" })
        } else {
            dispatch({ type: "SET_OFFSET", payload: e.target.value })
            setError(false)
            setHelperText("")
            setColor("success")
            setOffset(e.target.value)
        }
        setAmount("")
    }
    return (
        <Box sx={{ minWidth: 300 }}>
            <Tooltip title="advance setting">
                <IconButton aria-label='advance-setting' color='secondary' onClick={handleAdvanceClick}>
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
            <TextField
                type='number'
                sx={{ visibility: visible, minWidth: 260 }}
                size='small'
                placeholder={alignment == 's2m' ? 'recipient top up to this value' : 'sender keep this value'}
                value={offset}
                label="offset"
                onChange={handleOffsetChange}
                color={color}
                error={error}
            />
            <TextField
                type={textType}
                value={amount}
                onChange={handleChange}
                onClick={handleClick}
                color={color}
                error={error}
                helperText={helperText}
                placeholder="Set Amount"
                label="Amount"
                InputProps={{ endAdornment: adornment() }}
                variant='filled'
                fullWidth
            />
        </Box>
    )
}