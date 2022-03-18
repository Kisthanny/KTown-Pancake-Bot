const reducer = (state = [], action) => {
    switch (action.type) {
        case "ADD_ACCOUNT":
            return [...state, action.payload]
        case "REMOVE_ACCOUNT":
            return state.filter(address => address !== action.payload)
        default:
            return state
    }
}

export default reducer