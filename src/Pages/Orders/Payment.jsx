import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Camera from "../../Components/Icon/Camera";

const Payment = () => {
  const { id } = useParams();
  const [foto, setFoto] = useState();
  const [order, setOrder] = useState();
  const [idPayment, setIdPayment] = useState("");
  const [paymentType, setPaymentType] = useState(""); // Menyimpan tipe pembayaran
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setFoto(null);
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
    }
  };

  const handleFetchDetailOrder = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/detail/${id}`
      );
      setOrder(response?.data?.order);
    } catch (error) {
      console.log(error);
    }
  };

  const determinePaymentType = () => {
    if (order?.paymentMethod === "Two-Installments") {
      const firstPayment = order?.Payments[0];
      const hasPaidDP = firstPayment?.paymentStatus === "Completed";

      if (
        !hasPaidDP &&
        (!firstPayment?.images || firstPayment?.images.length === 0)
      ) {
        setIdPayment(firstPayment?.id);
        return "Bayar DP";
      } else if (hasPaidDP) {
        setIdPayment(order?.Payments[1]?.id);
        return "Bayar Pelunasan";
      }
      return "Tunggu Verifikasi";
    }

    const allPaymentsCompleted = order?.Payments?.every(
      (payment) => payment.paymentStatus === "Completed"
    );

    if (order?.paymentMethod !== "Two-Installments") {
      if (!allPaymentsCompleted || !order?.Payments[0]?.images?.length) {
        setIdPayment(order?.Payments[0]?.id);
        return "Tunggu Verifikasi";
      }
      return "Bayar Lunas";
    }

    return "Tidak Diketahui";
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("paymentId", idPayment);
    formData.append("image", foto);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/imagesPayment/create",
        formData
      );
      if (response.data.message === "Image uploaded successfully") {
        navigate("/order-list");
      }
      console.log(response, "cek response")
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchDetailOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (order) {
      const paymentResult = determinePaymentType();
      setPaymentType(paymentResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]); // Hanya dipanggil ketika `order` berubah

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
        <Form.Group>
          <Form.Label
            style={{
              fontWeight: "bold",
            }}
          >
            Upload Struk Pembayaran
          </Form.Label>
          <div className="preview-container">
            {foto && (
              <div>
                <img
                  style={{
                    minWidth: "400px",
                    borderRadius: "8px",
                  }}
                  src={URL.createObjectURL(foto)}
                  alt={`Preview foto`}
                  width="100"
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setFoto(null)}
                  style={{
                    marginTop: "10px",
                    marginBottom: "30px",
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
          <Button
            onClick={() => document.getElementById("mainPhoto").click()}
            style={{
              marginTop: "5px",
              padding: "0px",
              backgroundColor: "white",
            }}
          >
            <Camera />
          </Button>
          <Form.Control
            type="file"
            id="mainPhoto"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </Form.Group>
        <button
          style={{
            padding: "5px 10px",
            backgroundColor: "blue",
            borderRadius: "8px",
            marginRight: "10px",
            marginTop: "20px",
            margin: "4px",
            color: "white",
          }}
          onClick={handlePayment}
        >
          {paymentType || "Loading..."}
        </button>
      </Form>
    </Container>
  );
};

export default Payment;
