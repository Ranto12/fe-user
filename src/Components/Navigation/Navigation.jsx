import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaShoppingCart } from "react-icons/fa";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "react-bootstrap/Image";
import Avatar from "../../Assets/Images/Avatar.jpg";
import { useNavigate } from "react-router-dom";
import './Navigation.css'

const Navigation = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleProfileClick = () => {
    navigate("/Profile");
    setShowDropdown(false);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('userData')
    localStorage.removeItem('userId')
    localStorage.removeItem('tokenUser')
    navigate('/')
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleShopClick = () => {
    navigate("/order-list");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home" style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          Oak Gallery
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <div className="d-flex align-items-center">
              <Image
                key="avatar-image"
                src={Avatar}
                alt="Avatar"
                roundedCircle
                style={{ width: "30px", height: "30px", cursor: "pointer" }}
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <div className="ml-2">
                  <span
                    className="nav-link"
                    style={{ cursor: "pointer" }}
                    onClick={handleProfileClick}
                  >
                    Profile Saya
                  </span>
                  <span
                    className="nav-link"
                    style={{ cursor: "pointer" }}
                    onClick={handleLogoutClick}
                  >
                    LogOut
                  </span>
                </div>
              )}
            </div>

            <FaShoppingCart
              size="35"
              style={{ cursor: "pointer", marginLeft: "10px", color: "#ff98bf" }}
              onClick={handleCartClick}
            />

            <FontAwesomeIcon
              size="2x"
              style={{ cursor: "pointer", marginLeft: "10px", color: "#ff98bf" }}
              onClick={handleShopClick}
              icon={faShoppingBag}
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
