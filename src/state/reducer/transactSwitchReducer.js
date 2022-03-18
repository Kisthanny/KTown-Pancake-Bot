const reducer = (state = false, action) => {
    switch (action.type) {
        case "START_WORK":
            return true
        case "END_WORK":
            return false
        default:
            return state
    }
}

export default reducer