import axios from "axios";
import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const Payment = () => {
  const { id } = useParams();
  const [paymentMethod, setPaymentMethod] = useState();
  const [amount, setAmount] = useState();
  const [paymentCode, setPaymentCode] = useState();

  const navigate = useNavigate()

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/payment/create",
        {
          paymentMethod,
          amount,
          orderId: id,
          paymentCode,
        }
      );
      if (response.data.message === "Payment processed successfully and order marked as paid") {
        navigate('/order-list')
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container>
      <p
        style={{
          margin: "50px 0",
        }}
      >
        Pembayaran
      </p>
      <Form>
        <Form.Group controlId="customerName">
          <Form.Label>paymentCode</Form.Label>
          <Form.Control
            type="text"
            value={paymentCode}
            onChange={(e) => setPaymentCode(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="customerName">
          <Form.Label>Total biaya</Form.Label>
          <Form.Control
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="field">
          <Form.Label>Pembayaran</Form.Label>
          <Form.Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="">Pilih Kategori</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="E-Wallet">E-Wallet</option>
          </Form.Select>
        </Form.Group>
        <button style={{
          padding: "5px 4px",
          backgroundColor: "GrayText",
          borderRadius: "8px",
          marginRight: "10px",
          margin: "4px"
        }} onClick={handlePayment}>
          bayar
        </button>
      </Form>
    </Container>
  );
};

export default Payment;
