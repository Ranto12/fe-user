import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ImageCard from '../../Assets/Images/ImageShow1.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Container from 'react-bootstrap/esm/Container';

function CategoryCard() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Container>
      <h2>Kategori</h2>
      <div className="row">

        {/* {[1].map((index) => ( */}
          <Card
            // key={index}
            style={{
              width: '17rem',
              transform: isHovered ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Card.Img variant="top" src={ImageCard} style={{ marginTop: '10px' }}/>
            <Card.Body>
              <Card.Title>Gaun Pengantin</Card.Title>
              <Card.Text>
              Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Link to="/dress-page">
                <Button style={{ backgroundColor: "#ff98bf", borderColor: '#ff98bf' }}>Lihat Semua</Button>
              </Link>
            </Card.Body>
          </Card>
        {/* ))} */}
        &nbsp;

        {/* {[2].map((index) => ( */}
          <Card
            // key={index}
            style={{
              width: '17rem',
              transform: isHovered ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Card.Img variant="top" src={ImageCard} style={{ marginTop: '10px' }} />
            <Card.Body>
              <Card.Title>Kebaya</Card.Title>
              <Card.Text>
              Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Link to="/kebaya-page">
                <Button style={{ backgroundColor: "#ff98bf", borderColor: '#ff98bf' }}>Lihat Semua</Button>
              </Link>
            </Card.Body>
          </Card>
        {/* ))} */}
        &nbsp;

        {[3].map((index) => (
          <Card
            key={index}
            style={{
              width: '17rem',
              transform: isHovered ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Card.Img variant="top" src={ImageCard} style={{ marginTop: '10px' }} />
            <Card.Body>
              <Card.Title>Jas</Card.Title>
              <Card.Text>
              Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Link to="/jas-page">
                <Button style={{ backgroundColor: "#ff98bf", borderColor: '#ff98bf' }}>Lihat Semua</Button>
              </Link>
            </Card.Body>
          </Card>
        ))}
        &nbsp;

        {[4].map((index) => (
          <Card
            key={index}
            style={{
              width: '17rem',
              transform: isHovered ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Card.Img variant="top" src={ImageCard} style={{ marginTop: '10px' }} />
            <Card.Body>
              <Card.Title>Batik</Card.Title>
              <Card.Text>
              Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Link to="/batik-page">
                <Button style={{ backgroundColor: "#ff98bf", borderColor: '#ff98bf' }}>Lihat Semua</Button>
              </Link>
            </Card.Body>
          </Card>
        ))}
        &nbsp;
       
        {[4].map((index) => (
          <Card
            key={index}
            style={{
              width: '17rem',
              transform: isHovered ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Card.Img variant="top" src={ImageCard} style={{ marginTop: '10px' }} />
            <Card.Body>
              <Card.Title>Aksesoris Pernikahan</Card.Title>
              <Card.Text>
              Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Link to="/Aksesoris-Pernikahan">
                <Button style={{ backgroundColor: "#ff98bf", borderColor: '#ff98bf' }}>Lihat Semua</Button>
              </Link>
            </Card.Body>
          </Card>
        ))}
        &nbsp;
       
      </div>
    </Container>
  );
}

export default CategoryCard;
