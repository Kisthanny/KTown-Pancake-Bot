import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import { getPrivateWallet, getPublicWallet } from "../data";
import { useState } from 'react';
function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}
export default function SelectMultiple(props) {
    const { dispatch, alignment } = props
    const privateWallet_list = getPrivateWallet()
    const publicWallet_list = alignment == "s2m" ? getPublicWallet() : []
    const items = privateWallet_list.concat(publicWallet_list).map(account => {
        return account.address
    })
    const [checked, setChecked] = useState([]);
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        if (alignment == "s2m") {
            dispatch({
                type: "SET_MULTIPLE",
                payload: newChecked.map(address => { return { address: address } })
            })
        } else if (alignment == "m2s") {
            dispatch({
                type: "SET_MULTIPLE",
                payload: newChecked.map(address => {
                    return privateWallet_list[items.indexOf(address)]
                })
            })
        }
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
            dispatch({
                type: "SET_MULTIPLE",
                payload: []
            })
        } else {
            setChecked(union(checked, items));
            if (alignment == "s2m") {
                dispatch({
                    type: "SET_MULTIPLE",
                    payload: items.map(address => { return { address: address } })
                })
            } else {
                dispatch({
                    type: "SET_MULTIPLE",
                    payload: privateWallet_list
                })
            }
        }
    };
    return (
        <Card sx={{ minWidth: 300 }}>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title="Select Multiple"
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    width: "100%",
                    height: 800,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`Account ${items.indexOf(value) + 1} ${value}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    )
}