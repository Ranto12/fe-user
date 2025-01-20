import React, { useEffect, useState } from "react";
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import { BsChatLeftTextFill } from "react-icons/bs";
import axios from "axios";
import Container from "react-bootstrap/Container";
import SlideShowImages from "../../Components/Home/SlideShowImages";
import CategoryCard from "../../Components/Home/CategoryCard";
import Footer from "../../Components/Footer";
import Navigation from "../../Components/Navigation/Navigation";
import LayoutImage from "../../Components/Home/LayoutImage";
import Maps from "../../Components/Home/Maps";
import "./Home.css";

function Home() {
  const [message, setMessage] = useState("");
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const datauser = JSON.parse(localStorage.getItem("userData"));

  const fetchMessagesId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/${localStorage.getItem("userId")}`
      );
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessagesId();
  }, []);

  const openChatModal = () => {
    setShowChatModal(true);
    setMessage("");
    setSelectedUser({ email: "admin@example.com", name: "Admin" });
  };

  const closeChatModal = () => {
    setShowChatModal(false);
    setSelectedUser(null);
  };

  const handleSendMessage = async () => {
    try {
      await axios.post(`http://localhost:5000/api/messages/create`, {
        senderId: localStorage.getItem("userId"),
        receiverId: 1,
        message: message,
      });
      fetchMessagesId();
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="home">
      <Navigation />
      <Container className="my-4">
        <div>
          {datauser ? (
            <div>
              <h2>Welcome, {datauser?.name}</h2>
              <p>Email: {datauser?.email}</p>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </Container>

      <SlideShowImages />
      <Container className="my-4">
        <CategoryCard />
      </Container>
      <Container className="my-4">
        <LayoutImage />
      </Container>
      <Container className="my-4">
        <Maps />
      </Container>
      <Footer />

      {/* Floating Chat Bubble */}
      <div className="chat-bubble" onClick={openChatModal}>
        <BsChatLeftTextFill size={30} color="white" />
      </div>

      {/* Modal untuk chat dengan Admin */}
      <Modal show={showChatModal} onHide={closeChatModal} size="lg">
        <Modal.Header closeButton className="bg-pink text-white">
          <Modal.Title>Chat dengan {selectedUser?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light-pink">
          <div
            className="chat-box"
            style={{
              border: "1px solid #D85C8C",
              height: "300px",
              overflowY: "scroll",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "#FCE4E4", // Background warna pink muda
            }}
          >
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent:
                        msg.sender.role === "admin" ? "flex-start" : "flex-end",
                    }}
                  >
                    <p
                      style={{
                        textAlign:
                          msg.sender.role === "admin" ? "start" : "end",
                        backgroundColor:
                          msg.sender.role === "admin" ? "white" : "GrayText",
                        borderRadius: "10px 0 10px 0",
                        padding: "5px 10px",
                        maxWidth: "70%",
                      }}
                    >
                      {msg.message}
                    </p>
                  </div>
                );
              })
            ) : (
              <p>Belum ada pesan</p>
            )}
          </div>

          <InputGroup className="mt-3">
            <FormControl
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ketik pesan..."
              style={{ borderColor: "#D85C8C" }} // Border input warna pink
            />
            <Button
              onClick={handleSendMessage}
              style={{ backgroundColor: "#D85C8C", borderColor: "#D85C8C" }}
            >
              Kirim
            </Button>
          </InputGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Home;
