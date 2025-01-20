import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

        localStorage.setItem("userId", response.data.userId); // Simpan ID pengguna
        localStorage.setItem("userData", JSON.stringify(response.data.userData));
        localStorage.setItem("tokenUser", response.data.token);

        setShowAlert(true);
        navigate("/home");
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed");
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
          Login
        </h1>

        <Form>
          {showAlert && (
            <Alert variant="success" className="mt-3">
              Login successful! Redirecting...
            </Alert>
          )}

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <br />
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

          <br />
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Remember Me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          </Form.Group>

          <br />
          <Button
            className="text-center"
            onClick={handleSubmit}
            type="submit"
            style={{ backgroundColor: "#ff98bf", borderColor: "#ff98bf" }}
          >
            Submit
          </Button>
        </Form>

        <Row className="mt-3">
          <Col>
            <Link to="/forgot-password">Forgot Password?</Link>
          </Col>
          <Col className="text-right">
            Don't have an account? <Link to="register">Register</Link>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Login;
