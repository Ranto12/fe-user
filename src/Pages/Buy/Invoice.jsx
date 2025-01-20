import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

const Invoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState();
  const [idPayment, setIdpayment] = useState();
  const [titleButton, setTitleButton] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [review, setReview] = useState();
  const [writeReview, setWriteReview] = useState("");

  const handleFetchDetailInvoice = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/detail/${id}`
      );
      setInvoice(response?.data?.order);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetUlasan = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/order/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenUser")}`,
          },
        }
      );
      setReview(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchDetailInvoice();
    handleGetUlasan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (invoice?.Payments?.length > 1) {
      if (invoice.Payments[0]?.paymentStatus === "Completed") {
        console.log("betul");
        setIdpayment(1);
        setTitleButton("Bayar Lunas");
      } else {
        setIdpayment(0);
        setTitleButton("Bayar DP");
      }
    } else {
      setIdpayment(0);
      setTitleButton("Bayar Lunas");
    }
  }, [invoice]);

  function formatRupiah(amount) {
    return `Rp ${amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const getOrderStatusTranslation = (status) => {
    switch (status) {
      case "Pending":
        return "Sedang Dikemas";
      case "Shipped":
        return "Sedang Dikirim";
      case "In Transit":
        return "Dalam Perjalanan";
      case "Delivered":
        return "Terkirim";
      case "Returned":
        return "DiKembalikan";
      default:
        return "----";
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/status",
        {
          status: "Accepted",
          orderId: id,
        }
      );
      if (response.data.message === "Order status and product stock updated successfully") {
        navigate("/order-list");
        alert("pesanan di terima");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createReviewProduct = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/reviews/create",
        {
          productIds: invoice?.OrderItems?.map((item) => item.productId),
          userId: localStorage.getItem("userId"),
          reviewText: writeReview,
          orderId: id,
        }
      );
      if (
        response?.data?.message ===
        "Reviews created successfully for the given products"
      ) {
        handleFetchDetailInvoice();
        handleGetUlasan();
        alert("success menambahkan ulasan");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isAllPaymentsCompleted = invoice?.Payments?.every(
    (payment) => payment.paymentStatus === "Completed"
  );

  const buttonStyle = {
    padding: "5px 4px",
    backgroundColor: "GrayText",
    borderRadius: "8px",
    marginRight: "10px",
  };

  const containerStyle = {
    display: "flex",
    gap: "30px",
  };

  const sectionStyle = {
    marginTop: "30px",
  };

  const titleStyle = {
    fontSize: "20px",
  };

  const statusStyle = {
    fontSize: "14px",
    padding: "2px",
    backgroundColor: "ButtonHighlight",
    width: "150px",
    textAlign: "center",
    borderRadius: "10px",
  };

  const buttonStyleS = {
    height: "30px",
    display: "flex",
    alignItems: "center",
  };

  const shippingStatus = invoice?.Shipment?.shippingStatus;
  console.log(invoice?.status, invoice?.Shipment?.shippingStatus, "cek status")
  return (
    <Container className="mt-4">
      <h2>Invoice</h2>
      <Row>
        <Col>
          <h4>Invoice Information</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Customer Information</h4>
          <p>
            <strong>Name:</strong> {invoice?.customerName}
          </p>
          <p>
            <strong>Address:</strong> {invoice?.address}
          </p>
          <p>
            <strong>No Handphone:</strong>
            {invoice?.phoneNumber}
          </p>
          <p>
            <strong>Tanggal Penyewaan:</strong>
            {invoice?.rentalStartDate &&
              format(new Date(invoice?.rentalStartDate), "yyyy-MM-dd")}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Items</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.OrderItems?.map((item) => (
                <tr>
                  <td>{item.productName}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{formatRupiah(item.quantity * item.price)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3">
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>
                    {formatRupiah(
                      invoice?.OrderItems?.reduce(
                        (sum, item) =>
                          sum + item.quantity * parseFloat(item.price),
                        0
                      )
                    )}
                  </strong>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <button
        onClick={!isAllPaymentsCompleted ? handleOpenModal : undefined}
        disabled={isAllPaymentsCompleted}
        style={buttonStyle}
      >
        {isAllPaymentsCompleted ? "Lunas" : titleButton}
      </button>

      <div style={containerStyle}>
        {invoice?.status !== "Paid" && (
          <div style={sectionStyle}>
            <p style={titleStyle}>Status Pengiriman</p>
            <p style={statusStyle}>
              {getOrderStatusTranslation(shippingStatus)}
            </p>
          </div>
        )}
        {(shippingStatus === "Delivered" || invoice?.status === "Accepted") && (
          <div style={sectionStyle}>
            <p style={titleStyle}>Konfirmasi Pengiriman</p>
            <Button
              style={buttonStyleS}
              disabled={invoice?.status === "Accepted"}
              onClick={handleUpdateStatus}
            >
              Saya Diterima
            </Button>
          </div>
        )}
      </div>

      {/* comentar  */}

      {isAllPaymentsCompleted && (
        <div>
          {review?.reviews?.length > 0 ? (
            <>
              <p>{"Ulasan Anda"}</p>
              <p>{`komentar :  ${review?.reviews[0]?.reviewText}`}</p>
            </>
          ) : (
            <>
              <Form.Label>Berikan Ulasan Anda</Form.Label>
              <Form.Control
                type="text"
                value={writeReview}
                onChange={(e) => setWriteReview(e.target.value)}
                required
              />
              <Button
                style={{
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                }}
                onClick={createReviewProduct}
              >
                Kirim Ulasan
              </Button>
            </>
          )}
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detail Pembayaran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{invoice?.Payments[idPayment]?.paymentCode}</p>
          <p>{formatRupiah(parseInt(invoice?.Payments[idPayment]?.amount))}</p>
          <p>{invoice?.Payments[idPayment]?.paymentMethod}</p>
        </Modal.Body>
        <button
          style={{
            padding: "5px 4px",
            backgroundColor: "GrayText",
            borderRadius: "8px",
            marginRight: "10px",
            margin: "4px",
          }}
          onClick={() => navigate(`/payment/${id}`)}
        >
          bayar
        </button>
      </Modal>
    </Container>
  );
};

export default Invoice;
