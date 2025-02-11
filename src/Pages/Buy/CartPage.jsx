import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Districts } from "../../utils"; // Ensure Districts data is correctly imported
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
  const [other, setOther] = useState(false);
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [kecamatanOptions, setKecamatanOptions] = useState([]);

  const [datas, setDatas] = useState({
    shippingMethod: "",
    district: "",
    sub_district: "",
    ongkir: 0,
  });

  // Handle kabupaten selection
  const handleKabupatenChange = (selectedOption) => {
    setSelectedKabupaten(selectedOption);
    setSelectedKecamatan(null); // Reset kecamatan when kabupaten changes
    setDatas({
      ...datas,
      district: selectedOption ? selectedOption.value : "",
      sub_district: "",
      ongkir: 0,
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
    setDatas({
      ...datas,
      sub_district: selectedOption ? selectedOption.value : "",
      ongkir: selectedOption ? selectedOption.ongkir : 0,
    });
  };

  console.log(tanggal, "cek tanggal")

  // Fetch user data and initialize kabupaten/kecamatan
  const getDatauser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/users/${localStorage.getItem("userId")}`
      );
      const user = response.data;

      // Set basic user data
      setCustomerName(user.name);
      setAddress(user.address);
      setTelepon(user.phoneNumber);

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

      // Update datas state
      setDatas({
        ...datas,
        district: user.district,
        sub_district: user.sub_district,
        ongkir: initialKecamatan ? initialKecamatan.ongkir : 0,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch cart items
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

  // Handle checkout
  const handleCheckOutClick = async () => {
    console.log(!customerName ,
      !address ,
      telepon ,
      !tanggal ,
      !paymentMethod ,
      !payment ,
      !selectedItems ,
      !duration === 0 ,
      !datas.district ,
      !datas.sub_district ,
      !datas.ongkir)
    if (
      !customerName ||
      !address ||
      !telepon ||
      !tanggal ||
      !paymentMethod ||
      !payment ||
      !selectedItems ||
      !duration === 0 ||
      !datas.district ||
      !datas.sub_district ||
      !datas.ongkir
    ) {
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
          address: `${datas.district} ${datas.sub_district} ${address}`,
          paymentMethod: paymentMethod,
          metodePayment: payment,
          rentalStartDate: tanggal,
          rentalDuration: duration,
          cartIds: selectedItems,
          ongkir: datas.ongkir,
          products: cartItem
            .filter((item) => selectedItems.includes(item.id))
            .map((item) => ({
              productId: item.Product.id,
              productName: item.Product.name,
              quantity: item.quantity,
              size: item.ProductSize.size,
              color: item.color,
              price: item.Product.price,
            })),
        }
      );
      if (response) {
        navigate("/order-list");
      }
    } catch (error) {
      setErrorMessage("Failed to create order.");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    handleGetChart();
    if (!other) {
      getDatauser();
    } else {
      setAddress("");
      setCustomerName("");
      setDatas({
        ...datas,
        district: "",
        sub_district: "",
        ongkir: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [other]);

  // Format currency
  const formatRupiah = (amount) => {
    return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemId)
        ? prevSelectedItems.filter((id) => id !== itemId)
        : [...prevSelectedItems, itemId]
    );
  };

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

  const getTotalPrice = () => {
    return cartItem.reduce((total, item) => {
      return selectedItems.includes(item.id)
        ? (total + item.Product.price * item.quantity) * duration
        : total;
    }, 0);
  };


  return (
    <Container className="mt-4">
      <h2>Shopping Cart</h2>
      {cartItem.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {/* Cart items rendering */}
          {cartItem.map((item) => (
            <Card key={item.id} className="mb-3">
              <Card.Body>
                <Row>
                  <Col xs="2">
                    <Form.Check
                      type="checkbox"
                      id={`checkbox-${item.id}`}
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </Col>
                  <Col xs="2">
                    <Image
                      src={item.Product.ProductImages[0].imagePath}
                      alt={item.Product.name}
                      rounded
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </Col>
                  <Col xs="6">
                    <div>Stok: {item.ProductSize.stock}</div>
                    <div>
                      <h5>{item.Product.name}</h5>
                      <h5>{item.ProductSize.size}</h5>
                    </div>
                    <div>
                      <p>Harga: {formatRupiah(parseInt(item.Product.price))}</p>
                    </div>
                  </Col>
                  <Col xs="2">
                    <div>
                      <p
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
                    <h5>{formatRupiah(item.quantity * item.Product.price)}</h5>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          {/* Error message */}
          {errorMessage && (
            <Alert variant="danger" className="mt-3">
              {errorMessage}
            </Alert>
          )}

          {/* Form for checkout */}
          <Form>
            <Form.Group controlId="customerName">
              <Form.Check
                type="checkbox"
                label="Gunakan Alamat Lain"
                onChange={() => setOther(true)}
              />
            </Form.Group>
            <Form.Group controlId="customerName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Kabupaten</Form.Label>
              <Select
                options={Districts}
                value={selectedKabupaten}
                onChange={handleKabupatenChange}
                placeholder="Pilih Kabupaten..."
                isClearable
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Kecamatan</Form.Label>
              <Select
                options={kecamatanOptions}
                value={selectedKecamatan}
                onChange={handleKecamatanChange}
                placeholder="Pilih Kecamatan..."
                isDisabled={!selectedKabupaten}
                isClearable
              />
            </Form.Group>
            <Form.Group controlId="Ongkos Kirim">
              <Form.Label>Ongkos Kirim</Form.Label>
              <Form.Control
                type="text"
                disabled
                value={formatRupiah(datas.ongkir)}
              />
            </Form.Group>
            <Form.Group controlId="Alamat">
              <Form.Label>Alamat</Form.Label>
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
            <Form.Group>
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
            <Form.Group>
              <Form.Label>Pembayaran</Form.Label>
              <Form.Select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                required
              >
                <option value="">Pilih Kategori</option>
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
              />
            </Form.Group>
          </Form>

          {/* Total and checkout button */}
          <Row className="justify-content-end" style={{ margin: "20px 0" }}>
            <Col md="4">
              <Button
                disabled={selectedItems.length === 0}
                variant="danger"
                className="mb-2"
                onClick={handleRemoveDataChart}
              >
                Remove Selected
              </Button>
              <p
                className="font-medium"
                style={{
                  fontWeight: 500,
                }}
              >
                Total Belanja: {formatRupiah(getTotalPrice())}
              </p>
              <p
                className="font-medium"
                style={{
                  fontWeight: 500,
                }}
              >
                Ongkir: {formatRupiah(datas.ongkir)}
              </p>

              <p
                className="font-medium"
                style={{
                  fontWeight: 500,
                }}
              >
                Total Keseluruhan: {formatRupiah(getTotalPrice() + datas.ongkir)}
              </p>

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
  );
};

export default CartPage;
