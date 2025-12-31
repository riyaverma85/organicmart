
import { Link } from "react-router-dom";
import "../css/navbar.css";
import { Navbar, Nav, Container } from "react-bootstrap";

const TopNav = () => {
  return (
    <Navbar expand="lg" className="topnav shadow-sm sticky-top">
      <Container fluid>
        <Navbar.Toggle aria-controls="organic-navbar" className="bg-light" />
        <Navbar.Collapse id="organic-navbar" className="justify-content-center">
          <Nav className="nav-links">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;
