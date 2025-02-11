import axios from "axios";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Districts } from "../utils"; // Ensure Districts data is correctly imported
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [kecamatanOptions, setKecamatanOptions] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    address: "",
    about: "",
    sub_district: "",
    district: "",
  });

  // Handle kabupaten selection
  const handleKabupatenChange = (selectedOption) => {
    setSelectedKabupaten(selectedOption);
    setSelectedKecamatan(null); // Reset kecamatan when kabupaten changes
    setUserData({
      ...userData,
      district: selectedOption ? selectedOption.value : "",
      sub_district: "",
    });

    // Set kecamatan options based on selected kabupaten
    if (selectedOption) {
      setKecamatanOptions(selectedOption.kecamatan);
    } else {
      setKecamatanOptions([]);
    }
  };

  // Handle kecamatan selection
  const handleKecamatanChange = (selectedOption) => {
    setSelectedKecamatan(selectedOption);
    setUserData({
      ...userData,
      sub_district: selectedOption ? selectedOption.value : "",
    });
  };

  // Fetch user data and initialize kabupaten/kecamatan
  const getDatauserById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/users/${localStorage.getItem("userId")}`
      );
      const user = response.data;

      // Set basic user data
      setUserData({
        name: user.name,
        email: user.email,
        address: user.address,
        about: user.about,
        sub_district: user.sub_district,
        district: user.district,
      });

      // Find the selected kabupaten and kecamatan from Districts data
      const initialKabupaten = Districts.find(
        (kab) => kab.value === user.district
      );
      const initialKecamatan = initialKabupaten?.kecamatan.find(
        (kec) => kec.value === user.sub_district
      );

      // Set initial values for kabupaten and kecamatan
      setSelectedKabupaten(initialKabupaten || null);
      setSelectedKecamatan(initialKecamatan || null);
      setKecamatanOptions(initialKabupaten?.kecamatan || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handle update user data
  const handleUpdate = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/auth/update/${localStorage.getItem("userId")}`,
        userData
      );
      alert("Update successful");
      navigate("/Profile");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Update failed");
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    getDatauserById();
  }, []);

  return (
    <Container>
      <h2>Edit Profil</h2>
      <Form>
        {/* Name Field */}
        <Form.Group controlId="formBasicName" className="mb-3">
          <Form.Label>Nama</Form.Label>
          <Form.Control
            type="text"
            placeholder="Masukkan nama Anda"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        </Form.Group>

        {/* Kabupaten Select */}
        <Form.Group className="mb-3">
          <Form.Label>Kabupaten</Form.Label>
          <Select
            options={Districts}
            value={selectedKabupaten}
            onChange={handleKabupatenChange}
            placeholder="Pilih Kabupaten..."
            isClearable
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
          />
        </Form.Group>

        {/* Kecamatan Select */}
        <Form.Group className="mb-3">
          <Form.Label>Kecamatan</Form.Label>
          <Select
            options={kecamatanOptions}
            value={selectedKecamatan}
            onChange={handleKecamatanChange}
            placeholder="Pilih Kecamatan..."
            isDisabled={!selectedKabupaten}
            isClearable
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
          />
        </Form.Group>

        {/* Email Field */}
        <Form.Group controlId="formBasicEmail" className="mb-3">
          <Form.Label>Alamat Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Masukkan alamat email Anda"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
        </Form.Group>

        {/* Address Field */}
        <Form.Group controlId="formBasicAddress" className="mb-3">
          <Form.Label>Alamat Saya</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Tulis alamat lengkap Anda"
            value={userData.address}
            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
          />
        </Form.Group>

        {/* About Field */}
        <Form.Group controlId="formBasicAbout" className="mb-3">
          <Form.Label>Tentang Saya</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Tulis sesuatu tentang diri Anda"
            value={userData.about}
            onChange={(e) => setUserData({ ...userData, about: e.target.value })}
          />
        </Form.Group>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <Button variant="danger" onClick={() => navigate("/Profile")}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Simpan
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default EditProfile;