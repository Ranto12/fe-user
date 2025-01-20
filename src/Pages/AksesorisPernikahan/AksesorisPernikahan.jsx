import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AksesorisPage = () => {
  const [aksesoris, setAksesoris] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products?category=Aksesoris Pernikahan&limit=1000&page=1",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("tokenUser")}`,
            },
          }
        );
        setAksesoris(response.data?.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <h1>Daftar Aksesoris Pernikahan</h1>
      <Row>
        {aksesoris.map((aksesoris) => (
          <Col key={aksesoris.id} lg={3} md={6} sm={12} className="mb-4">
            <Card>
              <Card.Img
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                maxWidth: 'content',
              }}
                variant="top"
                src={aksesoris.ProductImages[0]?.imagePath}
                alt={`Foto ${aksesoris.ProductImages[0]?.imagePath}`}
              />
              <Card.Body>
                <Card.Title>{aksesoris.name}</Card.Title>
                <Card.Text>{aksesoris.details}</Card.Text>
                <Link
                  to={`/detail/${aksesoris.id}`}
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

export default AksesorisPage;
