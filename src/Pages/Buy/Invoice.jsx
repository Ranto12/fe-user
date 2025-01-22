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
  FloatingLabel,
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
  const [paymentType, setPaymentType] = useState("");
  const [noResi, setNoresi] = useState("");
  const [alamat, setAlamat] = useState(
    "jl. Pangrango no 08 Desa Palangka Kecamatan Jekan Raya Kota Palangka Raya Provinsi Kalimantan Tengah"
  );

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
      if (
        response.data.message ===
        "Order status and product stock updated successfully"
      ) {
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
  const determinePaymentType = () => {
    if (invoice?.paymentMethod === "Two-Installments") {
      const firstPayment = invoice?.Payments[0];
      const hasPaidDP = firstPayment?.paymentStatus === "Completed";

      if (
        !hasPaidDP &&
        (!firstPayment?.images || firstPayment?.images.length === 0)
      ) {
        return "Bayar DP";
      } else if (hasPaidDP && invoice?.Payments[1]?.images.length === 0) {
        return "Bayar Pelunasan";
      }
      return "Tunggu Verifikasi";
    }

    const allPaymentsCompleted = invoice?.Payments?.every(
      (payment) => payment.paymentStatus === "Completed"
    );

    if (invoice?.paymentMethod !== "Two-Installments") {
      if (!allPaymentsCompleted && invoice?.Payments[0]?.images?.length !== 0) {
        return "Tunggu Verifikasi";
      } else if (
        !allPaymentsCompleted &&
        invoice?.Payments[0]?.images?.length === 0
      ) {
      }
      return "Bayar Lunas";
    }

    return "Tidak Diketahui";
  };

  const handleCreateReturnShipment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shipments/create/return",
        {
          noResi: noResi,
          address: alamat,
          orderId: id,
        }
      );

      if (response.data.message === "Return shipment created successfully") {
        alert("success mengembalikan barang");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (invoice) {
      const paymentResult = determinePaymentType();
      setPaymentType(paymentResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice]);

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
                <td>Ongkir</td>
                <td></td>
                <td></td>
                <td>
                  {formatRupiah(
                    invoice?.Payments?.reduce(
                      (sum, item) => sum + parseInt(item.amount),
                      0
                    ) -
                      invoice?.OrderItems?.reduce(
                        (sum, item) =>
                          sum + item.quantity * parseFloat(item.price),
                        0
                      )
                  )}
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>
                    {formatRupiah(
                      invoice?.Payments?.reduce(
                        (sum, item) => sum + parseInt(item.amount),
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
        disabled={isAllPaymentsCompleted || paymentType === "Tunggu Verifikasi"}
        style={buttonStyle}
      >
        {isAllPaymentsCompleted
          ? "Lunas"
          : paymentType === "Tunggu Verifikasi"
          ? "Tunggu Verifikasi"
          : titleButton}
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
              disabled={
                invoice?.status === "Accepted" ||
                invoice?.status === "Completed"
              }
              onClick={handleUpdateStatus}
            >
              Saya Diterima
            </Button>
          </div>
        )}
      </div>

      {/* comentar  */}

      {invoice?.status === "Accepted" && !invoice?.ReturnShipment && (
        <>
          <p
            style={{
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            Form Pengembalian
          </p>
          <Form.Group className="field">
            <Form.Label>No Resi</Form.Label>
            <Form.Control
              type="text"
              className="input"
              value={noResi}
              onChange={(e) => setNoresi(e.target.value)}
              placeholder="No resi"
              required
            />
          </Form.Group>
          <Form.Group className="field">
            <Form.Label>Alamat</Form.Label>
            <FloatingLabel controlId="floatingTextarea2">
              <Form.Control
                as="textarea"
                placeholder="Alamat lengkap"
                style={{ height: "100px" }}
                disabled
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>
          <Button
            onClick={() => handleCreateReturnShipment()}
            style={{
              marginTop: "10px",
            }}
          >
            kembalikan
          </Button>
        </>
      )}

      {invoice?.status === "Completed" && (
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
