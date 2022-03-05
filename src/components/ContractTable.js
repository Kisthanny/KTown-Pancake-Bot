import List from '@mui/material/List';
import Box from '@mui/material/Box';
import { useState, useEffect, useReducer } from "react";
import Web3 from "web3";
import SYRUP from "../contracts/abi/SYRUP.json";
import IFOPOOL from "../contracts/abi/IFOPOOL.json";
import AUTOCAKE from "../contracts/abi/AUTOCAKE.json";
import { AddContractForm } from "./AddContractForm";
import { ContractInfo } from "./ContractInfo";
import { useNotification } from './Notification/NotificationProvider';
const web3 = new Web3(window.ethereum)
export const ContractTable = (props) => {
    const addNotification = useNotification()
    const { privateWallet } = props
    const [contracts, contractDispatch] = useReducer((contracts, action) => {
        switch (action.type) {
            case "ADD_CONTRACT":
                return [...contracts, { ...action.payload }]
            case "DELETE_CONTRACT":
                return contracts.filter(contract => contract.options.address != action.address)
            default:
                return contracts
        }
    }, [])

    const updateLocalStorage = (contractAddress, name = 'KTown-Contracts') => {
        if (!localStorage.getItem(name)) {
            localStorage.setItem(name, JSON.stringify([contractAddress]))
        } else {
            let obj = JSON.parse(localStorage.getItem(name))
            if (obj.indexOf(contractAddress) < 0) {
                obj.push(contractAddress)
                localStorage.setItem(name, JSON.stringify(obj))
            }
        }
    }
    const addContract = (address, mute = false) => {
        if (!web3.utils.isAddress(address)) {
            if (!mute) { addNotification("error", "please input correct form of contract address", 6000) }
            return null
        }
        address = web3.utils.toHex(address)
        //contract already added
        if (contracts.filter(contract => contract.options.address.toLowerCase() == address).length > 0) {
            if (!mute) { addNotification("warning", "contract already exist", 6000) }
            return null
        }
        var contract
        if (address == '0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8') {
            contract = new web3.eth.Contract(IFOPOOL, address)
        } else if (address == '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC') {
            contract = new web3.eth.Contract(AUTOCAKE, address)
        } else if (address == '0x73feaa1eE314F8c655E354234017bE2193C9E24E') {
            // do not support manual pool
            if (!mute) { addNotification("warning", "we do not support Manual Cake pool", 6000) }
            return null
        } else {
            try {
                contract = new web3.eth.Contract(SYRUP, address)
            } catch {
                if (!mute) { addNotification("error", "please input correct form of contract address", 6000) }
                return null
            }
        }
        updateLocalStorage(address)
        contractDispatch({
            type: "ADD_CONTRACT",
            payload: contract
        })
        return true
    }

    //contract, storageName = 'test_Contract'
    const deleteContract = (contract, storageName = 'KTown-Contracts') => {
        let contract_arr = JSON.parse(localStorage.getItem(storageName))
        contract_arr.splice(contract_arr.indexOf(contract.options.address.toLowerCase()), 1)
        localStorage.setItem(storageName, JSON.stringify(contract_arr))
        contractDispatch({
            type: "DELETE_CONTRACT",
            address: contract.options.address
        })
        addNotification("info", `${contract.options.address} removed`)
    }
    useEffect(() => {
        localStorage.removeItem('test_Contract')
        const contractArr = JSON.parse(localStorage.getItem('KTown-Contracts'))
        if (!contractArr) {
            return null
        } else {
            contractArr.forEach(address => {
                addContract(address, true)
            });
        }
    }, [])
    return (
        < Box sx={{ minWidth: 300, margin: 2 }}>
            <AddContractForm addContract={addContract} updateLocalStorage={updateLocalStorage} />
            <List sx={{ minWidth: 600, bgcolor: 'background.paper', margin: 1 }}>
                {contracts.map(contract => {
                    return (
                        <ContractInfo privateWallet={privateWallet} key={contract.options.address} contract={contract} deleteContract={deleteContract} />
                    )
                })}
            </List>
        </Box >
    )
}