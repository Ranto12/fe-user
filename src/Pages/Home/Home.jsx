import React, { useEffect, useState } from "react";
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import { BsChatLeftTextFill } from "react-icons/bs";
import io from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import SlideShowImages from "../../Components/Home/SlideShowImages";
import CategoryCard from "../../Components/Home/CategoryCard";
import Footer from "../../Components/Footer";
import Navigation from "../../Components/Navigation/Navigation";
import LayoutImage from "../../Components/Home/LayoutImage";
import Maps from "../../Components/Home/Maps";
import "./Home.css";

// Inisialisasi socket.io
const socket = io("http://localhost:3002");

function Home() {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]); // Riwayat chat
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUserData = () => {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  // Pastikan socket terhubung
  useEffect(() => {
    socket.on("message", (data) => {
      if (data.recipient_id === userData?.id) {
        setChat((prevChat) => [...prevChat, data]);
      }
    });

    return () => socket.off("message");
  }, [userData]);

  // Ambil riwayat pesan dari server
  const fetchMessages = async (userId) => {
    try {
        const response = await axios.get(
            `http://localhost:3000/api/messages/user/${userId}`,
            { withCredentials: true }
        );
        console.log("Fetched messages:", response.data); // Cek data yang diterima
        setChat(response.data.data || []); // Pastikan data adalah array
    } catch (error) {
        console.error("Error fetching messages:", error);
        setChat([]); // Default ke array kosong jika terjadi error
    }
};


  const openChatModal = () => {
    setShowChatModal(true);
    setMessage("");
    setSelectedUser({ email: "admin@example.com", name: "Admin" });

    if (userData?.id) {
      fetchMessages(userData.id);
    }
  };

  const closeChatModal = () => {
    setShowChatModal(false);
    setSelectedUser(null);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
        try {
            const payload = {
                sender_id: userData.id, // ID pengirim
                recipient_id: 1, // ID admin
                message: message,
            };

            await axios.post(
                "http://localhost:3000/api/messages/sendToAdmin",
                payload,
                { withCredentials: true }
            );

            socket.emit("message", payload);

            setChat((prevChat) => [
                ...prevChat,
                { sender: userData.name, message },
            ]);
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
};


  return (
    <div id="home">
      <Navigation />
      <Container className="my-4">
        <div>
          {userData ? (
            <div>
              <h2>Welcome, {userData.name}</h2>
              <p>Email: {userData.email}</p>
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
            {chat.length > 0 ? (
              chat.map((msg, index) => {
                // Tentukan class berdasarkan apakah pengirim adalah admin atau user
                const messageClass = [
                  "message",
                  msg.sender === "Admin" ? "admin-message" : "user-message",
                ].join(" ");

                return (
                  <div key={index} className={messageClass}>
                    <strong>{msg.sender}</strong> {msg.message}
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
