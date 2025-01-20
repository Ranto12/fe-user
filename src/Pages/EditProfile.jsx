import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function EditProfile() {
  return (
    <Container>
      <h2>Edit Profil</h2>
      <Form>

        <Form.Group controlId="formBasicName">
          <Form.Label>Nama</Form.Label>
          <Form.Control type="text" placeholder="Masukkan nama Anda" />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Alamat Email</Form.Label>
          <Form.Control type="email" placeholder="Masukkan alamat email Anda" />
        </Form.Group>

        <Form.Group controlId="formBasicBio">
          <Form.Label>Alamat Saya</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Tulis alamat lengkap Anda" />
        </Form.Group>

        <Form.Group controlId="formBasicBio">
          <Form.Label>Tentang Saya</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Tulis sesuatu tentang diri Anda" />
        </Form.Group>

        <br />

        <Button variant='danger' type='cancel'>
            Cancel
        </Button>
        &nbsp;
        <Button variant="primary" type="submit">
          Simpan
        </Button>
      </Form>
    </Container>
  );
}

export default EditProfile;
