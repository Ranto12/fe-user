import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const JasPage = () => {
  const [Jas, setJas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products?category=Jas&limit=1000&page=1",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("tokenUser")}`,
            },
          }
        );
        setJas(response.data?.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <Container>
      <h1>Daftar Jas</h1>
      <Row>
        {Jas.map((jas) => (
          <Col key={jas.id} lg={3} md={6} sm={12} className="mb-4">
            <Card>
              <Card.Img
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  maxWidth: "content",
                }}
                variant="top"
                src={jas.ProductImages[0]?.imagePath}
                alt={`Foto ${jas.ProductImages[0]?.imagePath}`}
              />
              <Card.Body>
                <Card.Title>{jas.name}</Card.Title>
                <Card.Text>{jas.details}</Card.Text>
                <Link
                  to={`/detail/${jas.id}`}
                  className="btn btn-primary"
                  style={{ backgroundColor: "#ff98bf", borderColor: "#ff98bf" }}
                >
                  Detail
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default JasPage;
