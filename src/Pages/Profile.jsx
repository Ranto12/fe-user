import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import avatarImage from "../Assets/Images/Avatar.jpg"; // Ganti dengan URL gambar avatar Anda
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";

const Profile = ({ currentAvatar, onEditAvatar }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Container className="Profile">
      <h2>Profil Saya</h2>
      <Row>
        <Col md={4} className="text-center">
          {/* <Link to="/editAvatar/:id"> */}
            <Image
              src={avatarImage}
              alt="Foto Profil"
              roundedCircle
              style={{ width: "200px", height: "200px", cursor: 'pointer' }}
              onClick={openModal}
            />

            <Modal show={showModal} onHide={closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Avatar</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                
                <Image onClick={() => onEditAvatar()} src={avatarImage} width={50} roundedCircle
                  style={{cursor: 'pointer'}}/>
                  &nbsp;
                <Image onClick={() => onEditAvatar()} src={avatarImage} width={50} roundedCircle
                  style={{cursor: 'pointer'}}/>
                  &nbsp;
                <Image onClick={() => onEditAvatar()} src={avatarImage} width={50} roundedCircle
                  style={{cursor: 'pointer'}}/>
                  &nbsp;

              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Tutup
                </Button>
              </Modal.Footer>
            </Modal>

          {/* </Link> */}

          <br /> <br />
          <Link to="/editProfile/:id">
            <Button style={{backgroundColor: "#ff98bf", borderColor: '#ff98bf'}}>Edit Profile</Button>
          </Link>
        </Col>
        <Col md={8}>
          <Table style={{ border: "none" }}>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Nama Anda</th>
              </tr>

              <tr>
                <th>Alamat Email</th>
                <th>email@email.com</th>
              </tr>

              <tr>
                <th>Alamat</th>
                <th>Alamat</th>
              </tr>

              <tr>
                <th>Tetang Saya</th>
                <th>Deskripsi</th>
              </tr>
            </thead>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
