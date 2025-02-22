import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Toast,
  Carousel,
} from "react-bootstrap";
import Navigation from "../../Components/Navigation/Navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const DetailGaun = () => {
  const [gaun, setGaun] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalCalendar, setShowModalCaledar] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [error, setError] = useState(null);
  const [idProductSizes, setIdProductSizes] = useState();
  const [ulasan, setUlasan] = useState();
  const [order, setOrder] = useState([])

  const { id } = useParams();

  const navigate = useNavigate();

  const handlegetDataUlasan = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/product/${id}`
      );
      setUlasan(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlegetDataOrderProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/getOrdersByProductId/${id}`
      );
      setOrder(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/getById/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("tokenUser")}`,
            },
          }
        );
        setGaun(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    handlegetDataOrderProduct();
    fetchData();
    handlegetDataUlasan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!gaun) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    if (!idProductSizes) {
      alert("masukan ukuran terlebih dahulu");
    } else {
      if (
        quantity >
        gaun.ProductSizes.filter((item) => item.id === idProductSizes)[0].stock
      ) {
        setError(
          `Jumlah maksimum yang dapat diinput adalah ${
            gaun.ProductSizes.filter((item) => item.id === idProductSizes)[0]
              .stock
          }`
        );
        return;
      }
      if (!idProductSizes) {
        setError(`Pilih Size dulu`);
        return;
      }

      try {
        axios.post(
          "http://localhost:5000/api/cart/add",
          {
            productId: parseInt(id),
            userId: parseInt(localStorage.getItem("userId")),
            quantity: parseInt(quantity),
            sizeId: parseInt(idProductSizes),
            color: gaun?.ProductColors[0]?.color,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("tokenUser")}`,
            },
          }
        );
        navigate("/cart");
      } catch (error) {
        console.error("Error adding to cart:", error);
      }

      setToastMessage(`${gaun.nama_produk} telah ditambahkan ke keranjang!`);
      setShowToast(true);

      // Atur timer untuk menyembunyikan notifikasi setelah beberapa detik
      setTimeout(() => {
        setShowToast(false);
      }, 3000);

      setShowModal(false);
      setQuantity(1);
      setError(null);
    }
  };

  const DataEvent = order?.ordersByDate?.map((item) => ({
    title: item?.quantity + " order",
    start: item?.date,
  }));

  return (
    <div>
      <Navigation />
      <Container>
        <p
          style={{
            fontWeight: 600,
            fontSize: "24px",
          }}
        >
          Detail {gaun.category}
        </p>

        <Row>
          <Col md={6}>
            <Card>
              <Carousel fade>
                {gaun?.ProductImages?.map((item) => (
                  <Carousel.Item>
                    <Card.Img
                      variant="top"
                      src={item.imagePath}
                      alt={`Foto ${item.imagePath}`}
                      style={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card>
          </Col>

          <Col md={6}>
            <p>{gaun.name}</p>
            <p>Warna: {gaun?.ProductColors[0]?.color}</p>
            <p>Ukuran:</p>
            {gaun?.ProductSizes.map((item) => (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <p>{item.size}</p>
                <p>:</p>
                <p>{item.stock}</p>
              </div>
            ))}
            <p>
              Status:{" "}
              {gaun?.status === "Available" ? "Tersedia" : "Tidak Tersedia"}
            </p>
            <p>Detail: {gaun?.details}</p>
            <p>Harga: {parseInt(gaun?.price)}</p>

            <Button
              style={{ backgroundColor: "#ff98bf", borderColor: "#ff98bf" }}
              onClick={() => setShowModal(true)}
            >
              Tambahkan ke Keranjang
            </Button>
          </Col>
        </Row>

        {/* Modal untuk input jumlah dan tanggal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Tambahkan ke Keranjang</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <Form.Label>Ukuran :</Form.Label>
              {gaun?.ProductSizes.map((item) => (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => setIdProductSizes(item.id)}
                    style={{
                      width: "40px",
                      height: "40px",
                      padding: 0,
                      backgroundColor: item.id === idProductSizes ? "gray" : "",
                    }}
                  >
                    {item.size}
                  </button>
                </div>
              ))}
            </Form.Group>
            <Form.Group>
              <Form.Label>Jumlah:</Form.Label>
              <Form.Control
                disabled={!idProductSizes}
                type="number"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setError(null); // Reset pesan kesalahan ketika jumlah diubah
                }}
              />
              {error && <small className="text-danger">{error}</small>}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleAddToCart}>
              Tambahkan
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showModalCalendar}
          onHide={() => setShowModalCaledar(false)}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Data Order</Modal.Title>
          </Modal.Header>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={DataEvent && DataEvent}
          />
        </Modal>

        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          style={{
            position: "absolute",
            top: 20,
            right: 20,
          }}
        >
          <Toast.Header>
            <strong className="mr-auto">Notifikasi</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
        <div>
          <Button style={{
            marginTop: '30px'
          }} onClick={() => {setShowModalCaledar(true)}}>Liat Jadwal</Button>
          {ulasan?.reviews && <p>Komentar</p>}
          <div>
            {ulasan?.reviews?.map((item) => (
              <div>
                <p
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {item?.user?.name}
                </p>
                <p
                  style={{
                    padding: "0 0 0 20px",
                  }}
                >
                  : {item?.reviewText}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DetailGaun;
