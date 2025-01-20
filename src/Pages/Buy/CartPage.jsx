import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItem, setCartItems] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [telepon, setTelepon] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [payment, setPayment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [duration, setDuration] = useState(1);

  const getTotalPrice = () => {
    return cartItem.reduce((total, item) => {
      return selectedItems.includes(item.id)
        ? (total + item.Product.price * item.quantity) * duration
        : total;
    }, 0);
  };

  function formatRupiah(amount) {
    return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemId)
        ? prevSelectedItems.filter((id) => id !== itemId)
        : [...prevSelectedItems, itemId]
    );
  };

  const handleCheckOutClick = async () => {
    if (!customerName || !address || !telepon || !tanggal || !paymentMethod || !payment || !selectedItems || duration === 0 ) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/create",
        {
          userId: localStorage.getItem("userId"),
          customerName: customerName,
          phoneNumber: telepon,
          address: address,
          paymentMethod: paymentMethod,
          metodePayment: payment,
          rentalStartDate: tanggal,
          rentalDuration: duration,
          cartIds: selectedItems,
          products: cartItem.filter(item => selectedItems.includes(item.id)).map((item) => ({
            productId: item.Product.id,
            productName: item.Product.name,
            quantity: item.quantity,
            size: item.ProductSize.size,
            color: item.color,
            price: item.Product.price
          }))
        },
      );
      if (response) {
        navigate("/order-list");
      }
    } catch (error) {
      setErrorMessage("Failed to create order.");
    }
  };

  const handleGetChart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/cart/${localStorage.getItem("userId")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenUser")}`,
          },
        }
      );
      setCartItems(response.data.cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleRemoveDataChart = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/delete",
        {
          cartIds: selectedItems,
          userId: parseInt(localStorage.getItem("userId")),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenUser")}`,
          },
        }
      );
      handleGetChart();
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    handleGetChart();
  }, []);

  const handleAddStock = async (id, quantity, quantityProduct) => {
    if (quantityProduct >= quantity) {
      try {
        await axios.post("http://localhost:5000/api/cart/quantity", {
          cartId: id,
          quantity: quantity,
        });
        handleGetChart();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Maximal Stok");
    }
  };

  return (
    <>
      <Container className="mt-4">
        <h2>Shopping Cart</h2>
        {cartItem.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cartItem.map((item) => (
              <Card key={item.id} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col
                      xs="2"
                      style={{
                        display: "flex",
                        justifyItems: "center",
                        alignItems: "center",
                      }}
                    >
                      <Form.Check
                        className=""
                        type="checkbox"
                        id={`checkbox-${item.id}`}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </Col>
                    <Col xs="2">
                      <Image
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        src={item.Product.ProductImages[0].imagePath}
                        alt={item.Product.name}
                        rounded
                      />
                    </Col>
                    <Col
                      xs="6"
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <div>Stok : {item.ProductSize.stock}</div>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                        }}
                      >
                        <h5>{item.Product.name}</h5>
                        <h5
                          style={{
                            textTransform: "capitalize",
                            fontWeight: "normal",
                          }}
                        >
                          {item.ProductSize.size}
                        </h5>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <p>Harga: </p>
                        <p>{formatRupiah(parseInt(item.Product.price))}</p>
                      </div>
                    </Col>
                    <Col
                      xs="2"
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          justifyItems: "center",
                          height: "20px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "24px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleAddStock(
                              item.id,
                              item.quantity - 1,
                              item.ProductSize.stock
                            )
                          }
                        >
                          -
                        </p>
                        <p>{item.quantity}</p>
                        <p
                          style={{
                            fontSize: "24px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleAddStock(
                              item.id,
                              item.quantity + 1,
                              item.ProductSize.stock
                            )
                          }
                        >
                          +
                        </p>
                      </div>
                      <h5>
                        {formatRupiah(item.quantity * item.Product.price)}
                      </h5>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}

            {errorMessage && (
              <Alert variant="danger" className="mt-3">
                {errorMessage}
              </Alert>
            )}

            <Form>
              <Form.Group controlId="customerName">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="telepon">
                <Form.Label>No Handphone</Form.Label>
                <Form.Control
                  type="text"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="telepon">
                <Form.Label>Lama Sewa</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="field">
                <Form.Label>Metode Pembayaran</Form.Label>
                <Form.Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Pilih Kategori
                  </option>
                  <option value="One-Time">One-Time</option>
                  <option value="Two-Installments">Two-Installments</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="field">
                <Form.Label>Pembayaran</Form.Label>
                <Form.Select
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  required
                >
                  <option value="">
                    Pilih Kategori
                  </option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="E-Wallet">E-Wallet</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="tanggal">
                <Form.Label>Tanggal Penyewaan</Form.Label>
                <Form.Control
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  required
                  placeholder="Pilih tanggal penyewaan"
                />
              </Form.Group>
            </Form>

            <Row
              style={{
                margin: "20px 0",
              }}
              className="justify-content-end"
            >
              <Col md="4">
                <Button
                  disabled={selectedItems.length === 0}
                  variant="danger"
                  className="mb-2"
                  onClick={handleRemoveDataChart}
                >
                  Remove Selected
                </Button>
                <h4>Total: {formatRupiah(getTotalPrice())}</h4>
                <Button
                  style={{ backgroundColor: "#ff98bf", borderColor: "#ff98bf" }}
                  onClick={handleCheckOutClick}
                >
                  Proceed to Checkout
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </>
  );
};

export default CartPage;
