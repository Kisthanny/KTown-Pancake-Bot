import { useState, useReducer, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SelectSingle from "./SelectSingle";
import SelectMultiple from "./SelectMultiple";
import MultipleTransferButton from "./Buttons/MultipleTransfer";
import SelectToken from "./SelectToken";
import SetAmount from "./SetAmount";

export function Transfer() {
    const [alignment, setAlignment] = useState('s2m');
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "SET_SINGLE":
                return {
                    single: action.payload,
                    multiple: state.multiple,
                    token: state.token,
                    amount: state.amount,
                    to_offset: state.to_offset,
                    from_offset: state.from_offset
                };
            case "SET_MULTIPLE":
                return {
                    single: state.single,
                    multiple: action.payload,
                    token: state.token,
                    amount: state.amount,
                    to_offset: state.to_offset,
                    from_offset: state.from_offset
                };
            case "SET_TOKEN":
                return {
                    single: state.single,
                    multiple: state.multiple,
                    token: action.payload,
                    amount: state.amount,
                    to_offset: state.to_offset,
                    from_offset: state.from_offset
                };
            case "CLEAR_ACCOUNT":
                return {
                    single: undefined,
                    multiple: [],
                    token: state.token,
                    amount: state.amount,
                    to_offset: state.to_offset,
                    from_offset: state.from_offset
                }
            case "CLEAR_TOKEN":
                return {
                    single: state.single,
                    multiple: state.multiple,
                    token: undefined,
                    amount: state.amount,
                    to_offset: state.to_offset,
                    from_offset: state.from_offset
                }
            case "SET_AMOUNT":
                return {
                    single: state.single,
                    multiple: state.multiple,
                    token: state.token,
                    amount: action.payload,
                    to_offset: state.to_offset,
                    from_offset: state.from_offset
                }
            case "CLEAR_AMOUNT":
                return {
                    single: state.single,
                    multiple: state.multiple,
                    token: state.token,
                    amount: undefined,
                    to_offset: state.to_offset,
                    from_offset: state.from_offset
                }
            case "SET_OFFSET":
                if (alignment == "s2m") {
                    return {
                        single: state.single,
                        multiple: state.multiple,
                        token: state.token,
                        amount: '0',
                        to_offset: action.payload,
                        from_offset: undefined
                    }
                } else {
                    return {
                        single: state.single,
                        multiple: state.multiple,
                        token: state.token,
                        amount: '0',
                        to_offset: undefined,
                        from_offset: action.payload
                    }
                }
            case "CLEAR_OFFSET":
                return {
                    single: state.single,
                    multiple: state.multiple,
                    token: state.token,
                    amount: state.amount,
                    to_offset: undefined,
                    from_offset: undefined
                }
            default:
                return state;
        }
    }, {
        single: undefined,
        multiple: [],
        token: undefined,
        amount: undefined,
        to_offset: undefined,
        from_offset: undefined
    })

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
        dispatch({ type: "CLEAR_ACCOUNT" })
        if (state.amount == 'MAX') {
            dispatch({ type: "CLEAR_AMOUNT" })
        }
    };

    const customList = (alignment, side) => {
        if (alignment == "s2m") {
            if (side == "left") {
                return (<SelectSingle dispatch={dispatch} />)
            } else { return (<SelectMultiple dispatch={dispatch} alignment={alignment} />) }
        } else if (side == "left") {
            return (<SelectMultiple dispatch={dispatch} alignment={alignment} />)
        } else {
            return (<SelectSingle dispatch={dispatch} />)
        }

    };
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center" marginTop={"10px"}>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
                <Box>
                    <ToggleButtonGroup
                        orientation="vertical"
                        color="primary"
                        value={alignment}
                        exclusive
                        onChange={handleChange}
                    >
                        <ToggleButton value="s2m">Single to Multiple</ToggleButton>
                        <ToggleButton value="m2s">Multiple to Single</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Grid>
            <Grid item xs={4}><SelectToken dispatch={dispatch} /></Grid>
            <Grid item xs={4}><SetAmount alignment={alignment} dispatch={dispatch} /></Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={4}>{customList(alignment, "left")}</Grid>
            <Grid item xs={1}>
                <Grid container direction="column" alignItems="center">
                    <MultipleTransferButton state={state} alignment={alignment} />
                </Grid>
            </Grid>
            <Grid item xs={4}>{customList(alignment, "right")}</Grid>
            <Grid item xs={1}></Grid>
        </Grid >
    );
}
