import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css'

function Footer() {
  return (
    <footer className="bg-dark text-light">
      <Container>

        <br />

        <Row>
          <Col md={3}>
            <p>Oak Galery</p>
            <p>Alamat: Jl. Pangrango no:08, Palangka Raya</p>
            <p>Telepon: (+62) 811-5271-199</p>
          </Col>
          <Col md={3}>
            <h6>Informasi</h6>
            <Link href="#home">Home</Link> <br />
            <Link>About Us</Link>
          </Col>
          <Col md={3}>
            <h6>Pos Baru</h6>
          </Col>
          <Col md={3}>
            <h6>Tentang Kami</h6>
          </Col>
        </Row>

        <hr />

        <Row>
          <Col md={6}>
            <p>Copyright &copy;2023 Oak Galery</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p>Contact us at info@oakgalery.com</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
