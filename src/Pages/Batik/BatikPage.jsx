import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BatikPage = () => {
  const [Batik, setBatik] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products?category=Batik&limit=1000&page=1",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("tokenUser")}`,
            },
          }
        );
        setBatik(response.data?.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <h1>Daftar Batik</h1>
      <Row>
        {Batik.map((batik) => (
          <Col key={batik.id} lg={3} md={6} sm={12} className="mb-4">
            <Card>
              <Card.Img
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                maxWidth: 'content',
              }}
                variant="top"
                src={batik.ProductImages[0]?.imagePath}
                alt={`Foto ${batik.ProductImages[0]?.imagePath}`}
              />
              <Card.Body>
                <Card.Title>{batik.name}</Card.Title>
                <Card.Text>{batik.details}</Card.Text>
                <Link
                  to={`/detail/${batik.id}`}
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

export default BatikPage;
