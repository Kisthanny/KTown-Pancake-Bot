import { v4 } from "uuid";
export const addTX = (tx, privateKey, key = v4()) => {
    return (dispatch) => {
        dispatch({
            type: "ADD_TX",
            payload: {
                key: key,
                tx: tx,
                privateKey: privateKey,
                status: tx.status ? tx.status : "pending",
                txHash: tx.txHash ? tx.txHash : "0x"
            }
        })
    }
}

export const removeTX = (key) => {
    return (dispatch) => {
        dispatch({
            type: "REMOVE_TX",
            payload: key
        })
    }
}

export const updateTX = (key, newProps) => {
    return (dispatch) => {
        dispatch({
            type: "UPDATE_TX",
            payload: {
                key: key,
                ...newProps
            }
        })
    }
}

export const addWorkingAccount = (address) => {
    return (dispatch) => {
        dispatch({
            type: "ADD_ACCOUNT",
            payload: address
        })
    }
}

export const removeWorkingAccount = (address) => {
    return (dispatch) => {
        dispatch({
            type: "REMOVE_ACCOUNT",
            payload: address
        })
    }
}

export const addWork = (id) => {
    return (dispatch) => {
        dispatch({
            type: "ADD_WORK",
            payload: id
        })
    }
}

export const startTransact = () => {
    return (dispatch) => {
        dispatch({
            type: "START_WORK"
        })
    }
}

export const endTransact = () => {
    return (dispatch) => {
        dispatch({
            type: "END_WORK"
        })
    }
}

export const setTransactMode = (type) => {
    return (dispatch) => {
        dispatch({
            type: type
        })
    }
}