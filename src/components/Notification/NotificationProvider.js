import { v4 } from "uuid";
import { MySnackbar } from "./SnackBar";
import Stack from '@mui/material/Stack';
import { createContext, useContext, useReducer } from "react";
const NotificationContext = createContext()
const NotificationProvider = (props) => {

    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "ADD_NOTIFICATION":
                return [...state, { ...action.payload }];
            case "REMOVE_NOTIFICATION":
                return state.filter(el => el.id !== action.id);
            default:
                return state;
        }
    }, [])

    return (
        <NotificationContext.Provider value={dispatch}>
            <Stack direction="column-reverse" position="fixed" bottom="10px" spacing={2} sx={{ maxWidth: 600, zIndex: 'tooltip' }} className="notification-container">
                {state.map(note => {
                    return <MySnackbar {...note} dispatch={dispatch} key={note.id} />
                })}
            </Stack>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    const dispatch = useContext(NotificationContext);

    return (severity = "info", message = "new message", duration = 3000) => {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                id: v4(),
                severity: severity,
                message: message,
                duration: duration,
            }
        })
    }
}

export default NotificationProvider;