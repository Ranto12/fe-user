import React from "react";
import { Carousel, Container } from "react-bootstrap";
import image1 from "../../Assets/Images/ImageShow1.png";
import image2 from "../../Assets/Images/ImageShow2.png";
import image3 from "../../Assets/Images/ImageShow3.png";

const SlideShow = () => {
  const images = [image1, image2, image3];

  return (
    <Container>
      <Carousel
        // nextLabel=""
        // prevLabel=""
        // indicators={true}
        // interval={3000} 
      >
        {images.map((image, index) => (
          <Carousel.Item key={index} 
          // className="d-flex align-items-center"
          >
            <img
              className="d-block w-100"
              src={image}
              alt={`Slide ${index + 1}`}
              // style={{
              //   // maxHeight: "400px",
              //   objectFit: "cover",
              //   maxWidth: "800px",
              //   width: "100%",
              // }}
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default SlideShow;
