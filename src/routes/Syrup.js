import { ContractTable } from "../components/ContractTable";
import { getWallet } from "../data";
export default function Syrup() {
    const wallet = getWallet()
    return (
        <ContractTable wallet={wallet}></ContractTable>
    );
}