import React, { useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }
  
    try {
      const respose = await axios.post("http://localhost:5000/api/auth/register", {
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });
      alert("Registration successful");
      navigate("/"); // Redirect to login page or handle as needed
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.message); // Menampilkan pesan error dari backend
      } else {
        alert("Registration failed");
      }
    }
  };
  

  return (
    <Container className="container-sm d-flex justify-content-center align-items-center vh-100">
      <Container
        className="m-10 p-5 border rounded"
        style={{
          marginLeft: "200px",
          marginRight: "200px",
        }}
      >
        <h1 className="text-center mb-4" style={{ color: "#ff98bf" }}>
          Register
        </h1>

        <Form onSubmit={handleSubmit}>
          <p>{msg}</p>
          <Form.Group controlId="formBasicName">
            <Form.Label>Nama Lengkap</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukkan nama Anda"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Alamat Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Masukkan Email Anda"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <br />
          <Row>
            <Col>
              <Button
                style={{ backgroundColor: "#ff98bf", borderColor: "#ff98bf" }}
                type="submit"
              >
                Register
              </Button>
            </Col>

            <Col>
              <p className="text-right">
                Already have an account? <Link to="/">Login</Link>
              </p>
            </Col>
          </Row>
        </Form>

        {showAlert && (
          <Alert variant="success" className="mt-3">
            Registration successful! Redirect or display a success message here.
          </Alert>
        )}
      </Container>
    </Container>
  );
};

export default Register;
