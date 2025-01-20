import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Container, Row, Col } from "react-bootstrap";
import { FaLocationDot } from "react-icons/fa6";

const Maps = () => {
  return (
    <Container>
      <Row>
        <Col md={6}>
          <h1>Lihat lokasi kami di sini !</h1>
        </Col>
        <Col md={6}></Col>
        <Row>
          <MapContainer
            center={[-2.2074095, 113.9108346]}
            zoom={13}
            style={{ height: "200px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <Marker 
            position={[-2.2074095, 113.9108346]}
            >
              <Popup>
              <FaLocationDot size={30} color="red" /> {/* Ikon lokasi */}
                Oak Galery</Popup>
            </Marker>
          </MapContainer>
        </Row>
      </Row>
    </Container>
  );
};

export default Maps;
