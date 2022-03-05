import { useEffect, useState, useReducer } from "react";
import { WalletTable } from "./WalletTable";
import { AddAccountForm } from "./AddAccountForm";
import Web3 from "web3";
import { useNotification } from "./Notification/NotificationProvider";

const web3 = new Web3(window.ethereum)
export const Wallet = () => {
    const addNotification = useNotification()
    const [privateWallet, privateDispatch] = useReducer((privateWallet, action) => {
        switch (action.type) {
            case "ADD_ACCOUNT":
                return [...privateWallet, { ...action.payload }];
            case "DELETE_ACCOUNT":
                return privateWallet.filter(account => account.address != action.address)
            case "CLEAR_ACCOUNT":
                return [];
            default:
                return privateWallet
        }
    }, [])
    const [publicWallet, publicDispatch] = useReducer((publicWallet, action) => {
        switch (action.type) {
            case "ADD_ACCOUNT":
                return [...publicWallet, { ...action.payload }];
            case "DELETE_ACCOUNT":
                return publicWallet.filter(account => account.address != action.address)
            case "CLEAR_ACCOUNT":
                return [];
            default:
                return publicWallet
        }
    }, [])
    const updateLocalStorage = (item, name = 'test_Account') => {
        if (!localStorage.getItem(name)) {
            localStorage.setItem(name, JSON.stringify([item]))
        } else {
            let obj = JSON.parse(localStorage.getItem(name))
            if (obj.indexOf(item) < 0) {
                obj.push(item)
                localStorage.setItem(name, JSON.stringify(obj))
            }
        }
    }
    const addAccount = (userInput, mute = false) => {
        userInput = web3.utils.stripHexPrefix(userInput)
        if (web3.utils.isAddress(userInput)) {
            const address = web3.utils.toHex(userInput)
            // add public address
            if (publicWallet.filter(publicAccount => publicAccount.address == address).length > 0) {
                //already in public wallet
                if (!mute) { addNotification("warning", "account already existed", 6000) }
                return null
            }
            if (privateWallet.filter(privateAccount => privateAccount.address == address).length > 0) {
                //already in private wallet
                if (!mute) { addNotification("warning", "account already existed", 6000) }
                return null
            }
            updateLocalStorage(address, "KTown-Public")
            publicDispatch({
                type: "ADD_ACCOUNT",
                payload: { address: address }
            })
            if (!mute) { addNotification("success", `${address} added (public use only)`, 6000) }
            return null
        } else if (userInput.length == 64) {
            const account = web3.eth.accounts.privateKeyToAccount(userInput)
            if (publicWallet.filter(publicAccount => publicAccount.address == account.address).length > 0) {
                //already in public wallet, delete the public one first
                deleteAccount(account)
            }
            if (privateWallet.filter(privateAccount => privateAccount.address == account.address).length > 0) {
                //already in private wallet
                if (!mute) { addNotification("warning", "account already existed", 6000) }
                return null
            }
            updateLocalStorage(account.privateKey, "KTown-Private")
            privateDispatch({
                type: "ADD_ACCOUNT",
                payload: account
            })
            if (!mute) { addNotification("success", `${account.address} added`, 6000) }
            return null
        } else {
            if (!mute) { addNotification("error", "please input correct form of privateKey or address", 6000) }
            return null
        }

    }
    const addAccountGroup = (userInput_arr) => {
        userInput_arr.forEach(userInput => {
            addAccount(userInput, true)
        });
        //window.location.reload(false); useReducer acts better than useState
    }
    const deleteAccount = (account) => {
        //if account is public
        if (!account.privateKey) {
            let public_arr = JSON.parse(localStorage.getItem('KTown-Public'))
            public_arr = public_arr.filter(address => address != account.address)
            localStorage.setItem('KTown-Public', JSON.stringify(public_arr))
            publicDispatch({
                type: "DELETE_ACCOUNT",
                address: account.address
            })
            addNotification("success", `${account.address} deleted`, 6000)
            return null
        } else {
            let private_arr = JSON.parse(localStorage.getItem('KTown-Private'))
            private_arr = private_arr.filter(privateKey => privateKey != account.privateKey)
            localStorage.setItem('KTown-Private', JSON.stringify(private_arr))
            privateDispatch({
                type: "DELETE_ACCOUNT",
                address: account.address
            })
            addNotification("success", `${account.address} deleted`, 6000)
        }
    }
    const clearAccount = () => {
        localStorage.removeItem("KTown-Private")
        localStorage.removeItem("KTown-Public")
        privateDispatch({
            type: "CLEAR_ACCOUNT"
        })
        publicDispatch({
            type: "CLEAR_ACCOUNT"
        })
        addNotification("success", "all accounts removed!", 6000)
    }

    useEffect(() => {
        //localStorage.removeItem("KTown-Private")
        // set the state onMount
        const private_arr = JSON.parse(localStorage.getItem('KTown-Private'))
        if (private_arr) { addAccountGroup(private_arr) }

        const public_arr = JSON.parse(localStorage.getItem('KTown-Public'))
        if (public_arr) { addAccountGroup(public_arr) }

    }, [])

    return (
        <div className="Wallet">
            <AddAccountForm addAccount={addAccount} addAccountGroup={addAccountGroup} clearAccount={clearAccount} />
            <WalletTable privateWallet={privateWallet} publicWallet={publicWallet} deleteAccount={deleteAccount} />
        </div>
    );
}