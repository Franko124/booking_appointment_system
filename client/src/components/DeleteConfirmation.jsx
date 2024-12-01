import { Button, Modal } from "react-bootstrap"


export const DeleteConfirmation = ({showDeleteConfirmation,setShowDeleteConfirmation,onDeleteUserData,user }) => {

    return (
        <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
            <Modal.Header closeButton>
                <Modal.Title style={{color : 'red'}}>Warning : </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p >Do you want to delete the data of this user with email : {user.email} and role : {user.role} ?
                    <br></br>
                    <br></br>
                    <i style={{color:'red'}}>*Deleting this user's data 
                        will also delete all appointments {user.role === 'provider' && 'and services '} related to this user.
                    </i>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)} >No</Button>
                <Button variant="primary" onClick={onDeleteUserData} >Yes</Button>
            </Modal.Footer>
        </Modal >
    );
}