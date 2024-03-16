import { Card, Row } from "react-bootstrap";
import { tempProps } from "./page";
import React, { useState } from "react";
import styles from "../home.module.css";
import { ProjectModal } from "./projectModal";

interface projectProps {
  data: tempProps[];
}

export interface modalProps {
  show: boolean;
  onHide: () => void;
  data: tempProps;
  imgUrl: string;
}

export const ProjectCard: React.FC<projectProps> = ({ data }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selected, setSelected] = useState<tempProps>({
    imgUrl: "",
    Title: "",
    Summary: "",
  });
  return (
    <main style={{ padding: "0 5vw 0 10vw" }}>
      <Row md={2} style={{ gap: "50px" }}>
        {data &&
          data.map((e) => (
            <>
              <Card
                className={styles.cardStyle}
                onClick={() => {
                  setSelected(e);
                  setOpenModal(true);
                }}
              >
                <Card.Body>
                  <Card.Title>{e.Title}</Card.Title>
                  <Card.Img variant="top" src={e.imgUrl}></Card.Img>
                  <Card.Text>{e.Summary}</Card.Text>
                </Card.Body>
              </Card>
            </>
          ))}
        <>
          <ProjectModal
            show={openModal}
            onHide={() => setOpenModal(false)}
            data={selected}
            imgUrl={selected.imgUrl}
          />
        </>
      </Row>
    </main>
  );
};
