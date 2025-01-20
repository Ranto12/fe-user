import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import ImageLayout1 from '../../Assets/Images/ImageLayout1.png';
import ImageLayout2 from '../../Assets/Images/ImageLayout2.png';
import ImageLayout3 from '../../Assets/Images/ImageLayout3.png';
import ImageLayout4 from '../../Assets/Images/ImageLayout4.png';

function LayoutImage() {
  return (
    <Container>
      <h2>Foto-foto Kami</h2>
      <Row>

        <Col md={6} className="mb-4">
          <Image
            src={ImageLayout1}
            alt=''
            width={540}
            style={{
              transition: 'transform 0.3s ease-in-out',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Col>

        <Col md={6}>
          <Row>
            <Col md={6} className="mb-4">
              <Image
                src={ImageLayout2}
                alt=""
                width={270}
                style={{
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </Col>

            <Col md={6} className="mb-4">
              <Image
                src={ImageLayout3}
                alt=""
                width={270}
                style={{
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12} className="mb-4">
              <Image
                src={ImageLayout4}
                alt=""
                width={540}
                height={270}
                style={{
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default LayoutImage;
