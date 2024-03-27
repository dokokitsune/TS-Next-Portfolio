import React from "react";
import { modalProps } from "./projectCard";
import { Button, Modal, Image, Container, Row, Carousel} from "react-bootstrap";

import styles from "../home.module.css"

export const ProjectModal: React.FC<modalProps> = (props) => {
  interface picGallery {
    original: string;
  }

  const images: picGallery[] = [];
  props.data.imgUrls.forEach((e) => {
    images.push({ original: e });
  });
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton >
        <Modal.Title id="contained-modal-title-vcenter" >
          {props.data.Title}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className={styles.modelBody}>
        <Container>
          <Row>
           
            <Carousel>
              {images.map((e, index) => {
                return (
                  <Carousel.Item key={index}>
                    <Image src={e.original} alt="IMG Load Error" fluid/>
                  </Carousel.Item>
                );
              }
              )}
              
            </Carousel>
            <a style={{textAlign: "center", margin: '10px'}}><b>{props.data.Skills.join(", ")}</b></a>
            <a style={{textAlign: "center"}}>{props.data.Description}</a>
       

          </Row>
      

        </Container>
     </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
