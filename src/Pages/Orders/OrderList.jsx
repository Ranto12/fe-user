import React, { useState, useEffect } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFetchOrder = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/AllUserId/${localStorage.getItem('userId')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenUser")}`,
        }
      })
      setOrders(response.data.orders)
    } catch (error) {
      setErrorMessage("Failed to fetch orders. Please try again.");
    }
  }

  useEffect(() => {
    handleFetchOrder()
  }, []);

  
  function getPaymentStatus(payments) {
    if (!Array.isArray(payments) || payments.length === 0) {
      return "Tidak ada pembayaran.";
    }
  
    if (payments.length === 1) {
      const payment = payments[0];
      if (payment.paymentStatus === "Pending") {
        return "Menunggu Pembayaran";
      } else if (payment.paymentStatus === "Completed") {
        return "Lunas";
      }
    }
  
    if (payments.length === 2) {
      const completedPayments = payments.filter(
        (payment) => payment.paymentStatus === "Completed"
      ).length;
  
      if (completedPayments === 2) {
        return "Lunas";
      } else if (completedPayments === 1) {
        return "Sudah bayar DP";
      } else {
        return "Belum Bayar";
      }
    }
  
    return "Data pembayaran tidak valid.";
  }

  function formatRupiah(amount) {
    return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }

  return (
    <Container className="mt-4">
      <h2>Order List</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Produk</th>
            <th>Nominal</th>
            <th>Status Produk</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order?.OrderItems?.map((item) => item?.productName).join(", ")}</td>
                <td>{formatRupiah(order?.totalAmount)}</td>
                <td>{getPaymentStatus(order?.Payments)}</td>
                <td>
                  <Button variant="info" onClick={() => navigate(`/invoice/${order.id}`)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No orders available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrderList;