import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState } from "react";
import Web3 from "web3";
import IBEP20 from "../contracts/abi/IBEP20.json";
const web3 = new Web3(window.ethereum)
export default function SelectToken(props) {
    const { dispatch } = props
    const [error, setError] = useState(false)
    const [address, setAddress] = useState("")
    const [symbol, setSymbol] = useState("token address")
    const [helperText, setHelperText] = useState("")
    const [iconColor, setIconColor] = useState("disabled")
    const [alignment, setAlignment] = useState("");
    function handleChange(e) {
        setAddress(e.target.value)
        getSymbol(e.target.value)
    }
    async function getSymbol(address) {
        if (web3.utils.isAddress(address)) {
            const token_contract = new web3.eth.Contract(IBEP20, address)
            token_contract.methods.symbol().call().then(resp => {
                setSymbol(resp)
                setError(false)
                setHelperText('')
                setIconColor("secondary")
            }).catch(err => {
                console.log(err)
                setError(true)
                setHelperText("* you should input a BEP20 token address !")
                setSymbol("token address")
                dispatch({ type: "CLEAR_TOKEN" })
                setIconColor("disabled")
            })
        } else {
            setSymbol("token address")
            dispatch({ type: "CLEAR_TOKEN" })
            setHelperText("")
            setIconColor("disabled")
        }
    }
    function inputHandler() {
        dispatch({
            type: "SET_TOKEN",
            payload: new web3.eth.Contract(IBEP20, address)
        })
        setHelperText(`${symbol} token selected`)
        setIconColor("success")
    }
    function handleToggleChange(event, newAlignment) {
        setAlignment(newAlignment);
        if (newAlignment == 'CAKE') {
            dispatch({
                type: "SET_TOKEN",
                payload: new web3.eth.Contract(IBEP20, '0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
            })
            setHelperText(`CAKE token selected`)
            setIconColor("success")
            setAddress('0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
            setError(false)
        } else if (newAlignment == 'BNB') {
            dispatch({
                type: "SET_TOKEN",
                payload: 'BNB'
            })
            setHelperText(`BNB token selected`)
            setIconColor("success")
            setAddress('BNB')
            setError(false)
        } else {
            dispatch({ type: "CLEAR_TOKEN" })
            setHelperText(``)
            setIconColor("disabled")
            setAddress('')
            setError(false)
        }
    };
    const adornment = () => {
        return (
            <InputAdornment position="end">
                <IconButton disabled={error || symbol == "token address"} onClick={inputHandler}>
                    <CheckCircleOutlineIcon edge="end" color={iconColor} />
                </IconButton>
            </InputAdornment>
        )
    }
    return (
        <Box sx={{ minWidth: 300 }}>
            <ToggleButtonGroup
                color="success"
                value={alignment}
                exclusive
                onChange={handleToggleChange}
            >
                <ToggleButton value="CAKE">CAKE</ToggleButton>
                <ToggleButton value="BNB">BNB</ToggleButton>
            </ToggleButtonGroup>
            <TextField
                value={address}
                onChange={handleChange}
                error={error}
                helperText={helperText}
                placeholder="Token Address"
                label={symbol}
                InputProps={{
                    endAdornment: adornment()
                }}
                variant='filled'
                fullWidth
            />
        </Box>
    )
}