const reducer = (state = false, action) => {
    switch (action.type) {
        case "ASYNC":
            return "async"
        case "SYNC":
            return "sync"
        default:
            return state
    }
}

export default reducer