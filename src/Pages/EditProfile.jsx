import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function EditProfile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    about: ''
  })
  const getDatauserById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/users/${localStorage.getItem("userId")}`)
      setUserData(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdate = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/update/${localStorage.getItem("userId")}`, userData)
      setUserData(response.data)
      alert("update succes")
      getDatauserById()   
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
      getDatauserById()   
  },[])

  return (
    <Container>
      <h2>Edit Profil</h2>
      <Form>

        <Form.Group controlId="formBasicName">
          <Form.Label>Nama</Form.Label>
          <Form.Control type="text" placeholder="Masukkan nama Anda" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Alamat Email</Form.Label>
          <Form.Control type="email" placeholder="Masukkan alamat email Anda" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value}) } />
        </Form.Group>

        <Form.Group controlId="formBasicBio">
          <Form.Label>Alamat Saya</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Tulis alamat lengkap Anda" value={userData.address} onChange={(e) => setUserData({...userData, address: e.target.value}) } />
        </Form.Group>

        <Form.Group controlId="formBasicBio">
          <Form.Label>Tentang Saya</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Tulis sesuatu tentang diri Anda" value={userData.about} onChange={(e) => setUserData({...userData, about: e.target.value}) } />
        </Form.Group>

        <br />

        <Button variant='danger' type='cancel'>
            Cancel
        </Button>
        &nbsp;
        <Button variant="primary" onClick={handleUpdate}>
          Simpan
        </Button>
      </Form>
    </Container>
  );
}

export default EditProfile;
