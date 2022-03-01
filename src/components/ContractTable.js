import List from '@mui/material/List';
import Box from '@mui/material/Box';
import { useState, useEffect } from "react";
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
    const { wallet } = props
    const [contracts, setContracts] = useState([])

    const updateLocalStorage = (contractAddress, name = 'test_Contract') => {
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
    const addContract = (address, loop = false) => {
        if (!web3.utils.isAddress(address)) {
            addNotification("error", "please input correct form of contract address", 5000)
            return null
        }
        let copy = [...contracts]
        for (let index = 0; index < copy.length; index++) {
            const element = copy[index];
            if (element.options.address == address) {
                addNotification("warning", "already added contract")
                return null
            }
        }
        var contract
        if (address == '0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8') {
            contract = new web3.eth.Contract(IFOPOOL, address)
        } else if (address == '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC') {
            contract = new web3.eth.Contract(AUTOCAKE, address)
        } else if (address == '0x73feaa1eE314F8c655E354234017bE2193C9E24E') {
            // do not support manual pool
            addNotification("warning", "we do not support Manual Cake pool", 6000)
            return null
        } else {
            try {
                contract = new web3.eth.Contract(SYRUP, address)
            } catch {
                addNotification("error", "please input correct form of contract address", 5000)
                return null
            }
        }
        if (!loop) {
            setContracts([...contracts, contract])
        }
        updateLocalStorage(address)
        return true
    }

    //contract, storageName = 'test_Contract'
    const deleteContract = (contract, storageName = 'test_Contract') => {
        let contract_arr = JSON.parse(localStorage.getItem(storageName))
        contract_arr.splice(contract_arr.indexOf(contract.options.address.toLowerCase()), 1)
        localStorage.setItem(storageName, JSON.stringify(contract_arr))
        let copy = [...contracts]
        copy.splice(copy.indexOf(contract), 1)
        setContracts(copy)
        addNotification("info", `${contract.options.address} removed`)
    }
    useEffect(() => {
        //localStorage.removeItem('test_Contract')
        const contractArr = JSON.parse(localStorage.getItem('test_Contract'))
        if (!contractArr) {
            return null
        }
        let contract_list = []
        for (let index = 0; index < contractArr.length; index++) {
            const address = contractArr[index];
            var contract
            if (address == '0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8') {
                contract = new web3.eth.Contract(IFOPOOL, address)
            } else {
                contract = new web3.eth.Contract(SYRUP, address)
            }
            contract_list.push(contract)
        }
        setContracts(contract_list)
    }, [])
    return (
        < Box sx={{ minWidth: 300, margin: 2 }}>
            <AddContractForm addContract={addContract} updateLocalStorage={updateLocalStorage} />
            <List sx={{ minWidth: 600, bgcolor: 'background.paper', margin: 1 }}>
                {contracts.map(contract => {
                    return (
                        <ContractInfo wallet={wallet} key={contract.options.address} contract={contract} deleteContract={deleteContract} wallet={wallet} />
                    )
                })}
            </List>
        </Box >
    )
}