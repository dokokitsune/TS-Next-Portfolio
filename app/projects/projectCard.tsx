import { Card, Row } from "react-bootstrap";
import { tempProps } from "./page";
import React from "react";
import styles from '../home.module.css'

interface projectProps {
    data: tempProps[];
}



export  const ProjectCard : React.FC<projectProps> = ({data}) =>  {
    return (
        <main style={{padding: "0 5vw 0 10vw"}}>
        <Row md={2} style={{gap: "30px"}}>
            {data && data.map((e) => (
                <>
                <Card className={styles.cardStyle}>
                    <Card.Body>
                        <Card.Title>
                            {e.Title}
                        </Card.Title>
                        <Card.Img variant="top" src={e.imgUrl}></Card.Img>
                        <Card.Text>{e.Summary}</Card.Text>
                    </Card.Body>

                </Card>

                </>
            ))}
        

            
                
        </Row>
        </main>
    )

}