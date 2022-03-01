import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { AccountInfo } from './AccountInfo';
import { useState } from "react";
import { Tooltip } from '@mui/material';

export const WalletTable = (props) => {
    const { wallet, deleteAccount, publicAddressBook } = props
    const [checked, setChecked] = useState(false);
    function handleChange(event) {
        setChecked(event.target.checked);
    }
    if (wallet) {
        return (
            <TableContainer component={Paper}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="wallet table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>account address</TableCell>
                            <Tooltip title="or Ether depending on your network">
                                <TableCell>BNB</TableCell>
                            </Tooltip>
                            <TableCell>Pancake</TableCell>
                            <TableCell>
                                <FormControlLabel control={
                                    <Switch
                                        checked={checked}
                                        onChange={handleChange}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                } label="show balance" />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {wallet.map(account => {
                            let index = wallet.indexOf(account) + 1
                            return (
                                <AccountInfo key={account.address} index={index} account={account} deleteAccount={deleteAccount} checked={checked} />
                            )
                        })}
                        {publicAddressBook.map(account => {
                            let index = 'public ' + (publicAddressBook.indexOf(account) + 1).toString()
                            return (
                                <AccountInfo key={account.address + 'p'} index={index} account={account} deleteAccount={deleteAccount} checked={checked} />
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    } else {
        return (
            <div className="NullAccount">
                <p>input private key to add account</p>
            </div>
        )
    }

}