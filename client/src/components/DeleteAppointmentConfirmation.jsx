import { Button, Modal } from "react-bootstrap"


export const DeleteAppointmentConfirmation = ({showDeleteConfirmation,setShowDeleteConfirmation,onDeleteAppointment,appointment }) => {

    return (
        <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
            <Modal.Header closeButton>
                <Modal.Title style={{color : 'red'}}>Warning : </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p >Do you want to delete this appointment ?
                    <br></br>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)} >No</Button>
                <Button variant="primary" onClick={onDeleteAppointment} >Yes</Button>
            </Modal.Footer>
        </Modal >
    );
}