import { Button, Modal } from "react-bootstrap"


export const DeleteServiceConfirmation = ({showDeleteConfirmation,setShowDeleteConfirmation,onDeleteService,service }) => {

    return (
        <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
            <Modal.Header closeButton>
                <Modal.Title style={{color : 'red'}}>Warning : </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p >Do you want to delete this service ?
                    <br></br>
                    <br></br>
                    <i style={{color:'red'}}>*Deleting this service 
                        will also delete all appointments  related to this service.
                    </i>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)} >No</Button>
                <Button variant="primary" onClick={onDeleteService} >Yes</Button>
            </Modal.Footer>
        </Modal >
    );
}