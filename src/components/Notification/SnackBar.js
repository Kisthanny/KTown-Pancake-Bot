import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { useState, useEffect } from "react";

export function MySnackbar(props) {

    const { id, severity, message, duration, dispatch } = props
    const [progress, setProgress] = useState(0)
    const [intervalID, setIntervalID] = useState(null)

    const handleStartTimer = () => {
        const id = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + 1
                }
                return prev
            })
        }, duration / 100)
        setIntervalID(id)
    }

    const handlePauseTimer = () => {
        clearInterval(intervalID)
    }

    const handleExit = () => {
        handlePauseTimer()
        dispatch({
            type: "REMOVE_NOTIFICATION",
            id: id,
        })
    }
    useEffect(() => {
        handleStartTimer()
    }, [])

    return (
        <Slide onExit={handleExit} direction="up" in={progress < 100 ? true : false} mountOnEnter unmountOnExit >
            <Alert onMouseEnter={handlePauseTimer} onMouseLeave={handleStartTimer} className='notification-item' variant="filled" severity={severity}>{message}</Alert>
        </Slide>
    );
}