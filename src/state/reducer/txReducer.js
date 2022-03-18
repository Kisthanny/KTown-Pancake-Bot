const reducer = (state = [], action) => {
    switch (action.type) {
        case "ADD_TX":
            /* if (state.filter(transaction => transaction.key == action.payload.key).length > 0) { return state } */
            return [...state, action.payload]
        case "REMOVE_TX":
            return state.filter(transaction => transaction.key != action.payload)
        case "UPDATE_TX":
            var objNeedUpdate = state.filter(transaction => transaction.key == action.payload.key)[0]
            const index = state.indexOf(objNeedUpdate)
            var temp = state
            temp[index] = { ...objNeedUpdate, ...action.payload }
            return temp
        default:
            return state
    }
}

export default reducer