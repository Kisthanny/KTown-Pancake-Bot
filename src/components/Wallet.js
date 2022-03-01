import { useEffect, useState } from "react";
import { WalletTable } from "./WalletTable";
import { AddAccountForm } from "./AddAccountForm";
import { getWallet, getAddressBook } from "../data";
import Web3 from "web3";
import { useNotification } from "./Notification/NotificationProvider";

const web3 = new Web3(window.ethereum)
export const Wallet = () => {
    const addNotification = useNotification()
    const [wallet, setWallet] = useState([])
    const [publicAddressBook, setPublicAddressBook] = useState([])
    const updateLocalStorage = (pk, name = 'test_Account') => {
        if (!localStorage.getItem(name)) {
            localStorage.setItem(name, JSON.stringify([pk]))
        } else {
            let obj = JSON.parse(localStorage.getItem(name))
            if (obj.indexOf(pk) < 0) {
                obj.push(pk)
                localStorage.setItem(name, JSON.stringify(obj))
            }
        }
    }
    const addAccount = (pk, loop = false) => {
        pk = web3.utils.stripHexPrefix(pk)
        let account
        if (web3.utils.isAddress(pk)) {
            pk = web3.utils.toHex(pk)
            // add public address
            let copy = [...publicAddressBook]
            for (let index = 0; index < copy.length; index++) {
                const element = copy[index];
                if (element.address == pk) {
                    addNotification("warning", "account already exist", 3000)
                    return null
                }
            }
            account = { address: pk }
            if (wallet.filter(el => web3.utils.toHex(el.address) == account.address).length > 0) {
                addNotification("warning", "private account already exist", 3000)
                return null
            }
            if (!loop) {
                copy.push(account)
                setPublicAddressBook(copy)
            }
            updateLocalStorage(pk, "public_address")
            addNotification("info", `${account.address} added (public use only)`, 3000)
            return ['public_address', account]
        } else if (pk.length == 64) {
            account = web3.eth.accounts.privateKeyToAccount(pk)
            let copy = [...wallet]
            for (let index = 0; index < copy.length; index++) {
                const element = copy[index];
                if (element.address == account.address) {
                    addNotification("warning", "account already exist", 3000)
                    return null
                }
            }
            if (publicAddressBook.filter(el => web3.utils.toHex(el.address) == web3.utils.toHex(account.address)).length > 0) {
                console.log("should delete the public address")
                deleteAccount({ address: web3.utils.toHex(account.address) }, 'public_address')
            }
            if (!loop) {
                copy.push(account)
                setWallet(copy)
            }
            updateLocalStorage(account.privateKey)
            addNotification("info", `${account.address} added`, 3000)
            return ['private_account', account]
        } else {
            addNotification("error", "please input correct form of privateKey or address", 6000)
            return null
        }

    }
    const addAccountGroup = (pk_arr) => {
        let wallet_temp = wallet
        let address_book_temp = publicAddressBook
        for (let index = 0; index < pk_arr.length; index++) {
            let pk = pk_arr[index];
            const newAccount = addAccount(pk, true)
            if (!newAccount) { continue }
            if (newAccount[0] == 'private_account') {
                wallet_temp.push(newAccount)
            } else if (newAccount[0] == 'public_address') {
                address_book_temp.push(newAccount)
            }
        }
        //setWallet(wallet_temp)
        //setPublicAddressBook(address_book_temp)
        window.location.reload(false);
    }
    const deleteAccount = (account, storageName = 'test_Account') => {
        if (!account.privateKey) {
            let address_arr = JSON.parse(localStorage.getItem('public_address'))
            address_arr.splice(address_arr.indexOf(account.address), 1)
            localStorage.setItem('public_address', JSON.stringify(address_arr))
            publicAddressBook.splice(publicAddressBook.indexOf(account), 1)
            setPublicAddressBook(publicAddressBook)
            addNotification("info", `${account.address} removed`, 3000)
            return true
        }
        let pk_arr = JSON.parse(localStorage.getItem(storageName))
        pk_arr.splice(pk_arr.indexOf(account.privateKey), 1)
        localStorage.setItem(storageName, JSON.stringify(pk_arr))
        wallet.splice(wallet.indexOf(account), 1)
        setWallet(wallet)
        addNotification("info", `${account.address} removed`, 3000)
    }
    const clearAccount = () => {
        setWallet([])
        setPublicAddressBook([])
        localStorage.removeItem('test_Account')
        localStorage.removeItem('public_address')
        addNotification("info", "all accounts removed!")
    }

    useEffect(() => {
        const account_list = getWallet()
        setWallet(account_list)
        const address_book = getAddressBook()
        setPublicAddressBook(address_book)
    }, [])

    return (
        <div className="Wallet">
            <AddAccountForm addAccount={addAccount} addAccountGroup={addAccountGroup} clearAccount={clearAccount} />
            <WalletTable wallet={wallet} publicAddressBook={publicAddressBook} deleteAccount={deleteAccount} />
        </div>
    );
}