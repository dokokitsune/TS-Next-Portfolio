import React from "react";
import { modalProps } from "./projectCard";
import { Button, Modal, Image} from "react-bootstrap";

export const ProjectModal: React.FC<modalProps> = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      arial-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.data.Title}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
      <Image width="300px" height="350px" src={props.imgUrl} alt="IMG Load Error"/>
        {props.data.Summary}</Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
