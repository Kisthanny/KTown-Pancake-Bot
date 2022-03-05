import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getPrivateWallet } from "../data";

export default function SelectSingle(props) {
    const { dispatch } = props
    const privateWallet_list = getPrivateWallet()
    const address_list = privateWallet_list.map(account => {
        return account.address
    })
    const [account, setAccount] = useState('');

    const handleChange = (event) => {
        const address = event.target.value
        setAccount(address)
        dispatch({
            type: "SET_SINGLE",
            payload: privateWallet_list[address_list.indexOf(address)]
        })
    };

    return (
        <Box sx={{ minWidth: 300 }}>
            <FormControl fullWidth>
                <InputLabel id="single-account-select-label">Single</InputLabel>
                <Select
                    labelId="single-account-select-label"
                    id="single_account-select"
                    value={account}
                    label="Account"
                    onChange={handleChange}
                >
                    {address_list.map(address => {
                        return (
                            <MenuItem key={address} value={address}>{address}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </Box>
    );
}