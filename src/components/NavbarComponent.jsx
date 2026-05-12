import { Link, NavLink } from "react-router-dom";

const NavbarComponent = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <span style={{ fontSize: "2rem", marginRight: "0.5rem" }}>⚡</span>
                    <span>Lito Electrofunitures</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse"
                    aria-controls="navbarCollapse"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link" end>
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/addproducts" className="nav-link">
                                Add Products
                            </NavLink>
                        </li>
                    </ul>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/signin" className="nav-link">
                                Sign In
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/signup" className="nav-link">
                                Sign Up
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavbarComponent;