import { fund_me_contract } from "./ContractLib";
import Web3 from "web3";
import { useState } from "react";
export const FundButton = () => {
    const [buttonStatus, setButtonStatus] = useState(false);
    const [buttonText, setButtonText] = useState('Fund Me');
    const web3 = new Web3(window.ethereum);

    const account = web3.eth.accounts.privateKeyToAccount("b6a5989142fa2d8307ed62dbee4627cbdc26a00a56c341f8d1e1e8ec39685b48");

    var tx = {
        from: account.address,
        to: fund_me_contract.options.address,
        value: Web3.utils.toWei("0.01", "ether"),
        data: fund_me_contract.methods.fund().encodeABI(),
        gas: undefined
    };
    async function setGas() {
        const gas = await web3.eth.estimateGas(tx);
        tx.gas = Math.floor(gas * 1.2);
    }
    setGas()

    const fundHandler = () => {
        web3.eth.accounts.signTransaction(tx, account.privateKey).then((signedTx) => {
            console.log(signedTx)
            setButtonStatus(true)
            setButtonText("sending...")
            web3.eth.sendSignedTransaction(signedTx.rawTransaction).on("receipt", receipt => {
                console.log(receipt)
                setButtonStatus(false)
                setButtonText("Fund Again")
            }).on("error", error => {
                console.log(error)
            });
        })
    };

    return (
        <div className="FundButton">
            <button onClick={fundHandler} disabled={buttonStatus}>{buttonText}</button>
        </div>
    )
}