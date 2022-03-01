import Button from 'react-bootstrap/Button';

export const DeleteAccountButton = ({ deleteAccount }) => {
    return (
        <Button onClick={deleteAccount}>delete</Button>
    )
}