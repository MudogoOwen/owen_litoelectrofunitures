import axios from "axios";
import {
    useEffect,
    useState,
    useCallback,
    useMemo
} from "react";
import { useNavigate } from "react-router-dom";

const GetProductsComponent = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [category, setCategory] = useState("All");
    const [searchWord, setSearchWord] = useState("");
    const [sort, setSort] = useState("default");
    const [currentSlide, setCurrentSlide] = useState(0);

    // CART
    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);

    const navigate = useNavigate();

    const img_url =
        "https://onyi.alwaysdata.net/static/images/";

    const theme = {
        primary: "#2e7d32",
        primaryHover: "#1b5e20",
        bg: "#f8f9fa",
        textDark: "#212121",
    };

    const slides = useMemo(
        () => [
            {
                title: "Premium Furniture",
                subtitle: "Upgrade your living space",
                color: "#e8f5e9",
            },
            {
                title: "Latest Electronics",
                subtitle: "Smart tech for smart homes",
                color: "#c8e6c9",
            },
            {
                title: "Modern Living",
                subtitle: "Exclusive Lito Collections",
                color: "#a5d6a7",
            },
        ],
        []
    );

    // FETCH PRODUCTS
    const getProducts = useCallback(async () => {
        try {
            const response = await axios.get(
                "https://onyi.alwaysdata.net/api/get_products"
            );

            if (response.status === 200) {
                setProducts(response.data);
                setFilteredProducts(response.data);
            }
        } catch (error) {
            console.error(
                "Error fetching products:",
                error.message
            );
        }
    }, []);

    // LOAD PRODUCTS + CART
    useEffect(() => {
        getProducts();

        // LOAD CART
        const loadCart = () => {
            const savedCart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];

            setCart(savedCart);
        };

        // INITIAL LOAD
        loadCart();

        // AUTO REFRESH
        window.addEventListener(
            "storage",
            loadCart
        );

        // SLIDER
        const timer = setInterval(() => {
            setCurrentSlide(
                (prev) => (prev + 1) % slides.length
            );
        }, 4000);

        return () => {
            clearInterval(timer);

            window.removeEventListener(
                "storage",
                loadCart
            );
        };
    }, [getProducts, slides.length]);

    // FILTER PRODUCTS
    useEffect(() => {
        let data = [...products];

        // CATEGORY
        if (category !== "All") {
            data = data.filter(
                (p) =>
                    p.product_category?.toLowerCase() ===
                    category.toLowerCase() ||
                    p.category?.toLowerCase() ===
                    category.toLowerCase()
            );
        }

        // SEARCH
        if (searchWord.trim()) {
            data = data.filter((p) =>
                p.product_name
                    .toLowerCase()
                    .includes(searchWord.toLowerCase())
            );
        }

        // SORT
        if (sort === "low") {
            data.sort(
                (a, b) => a.product_cost - b.product_cost
            );
        } else if (sort === "high") {
            data.sort(
                (a, b) => b.product_cost - a.product_cost
            );
        }

        setFilteredProducts(data);
    }, [searchWord, products, sort, category]);

    // SAVE CART
    const saveCart = (updatedCart) => {
        setCart(updatedCart);

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );

        // AUTO REFRESH UI
        window.dispatchEvent(new Event("storage"));
    };

    // ADD TO CART
    const handleAddToCart = (product) => {
        let updatedCart = [...cart];

        const existingItem = updatedCart.find(
            (item) => item.id === product.id
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            updatedCart.push({
                ...product,
                quantity: 1,
            });
        }

        saveCart(updatedCart);

        // OPEN CART
        setCartOpen(true);
    };

    // INCREASE QTY
    const increaseQty = (id) => {
        const updatedCart = cart.map((item) =>
            item.id === id
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                }
                : item
        );

        saveCart(updatedCart);
    };

    // DECREASE QTY
    const decreaseQty = (id) => {
        let updatedCart = cart.map((item) =>
            item.id === id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                }
                : item
        );

        updatedCart = updatedCart.filter(
            (item) => item.quantity > 0
        );

        saveCart(updatedCart);
    };

    // REMOVE ITEM
    const removeItem = (id) => {
        const updatedCart = cart.filter(
            (item) => item.id !== id
        );

        saveCart(updatedCart);
    };

    // BUY NOW
    const handleBuyNow = (product) => {
        navigate("/makepayment", {
            state: {
                cart: [
                    {
                        ...product,
                        quantity: 1,
                    },
                ],
                total: product.product_cost,
            },
        });
    };

    // TOTAL ITEMS
    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // TOTAL PRICE
    const cartTotal = cart.reduce(
        (total, item) =>
            total +
            item.product_cost * item.quantity,
        0
    );

    return (
        <div
            style={{
                background: theme.bg,
                minHeight: "100vh",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <style>{`
                @media (min-width: 992px) {
                    .col-5-grid {
                        flex: 0 0 20%;
                        max-width: 20%;
                    }
                }

                .lito-card {
                    transition: 0.3s;
                    border-radius: 12px;
                    background: #fff;
                    border: none;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .lito-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }

                .btn-green {
                    background-color: ${theme.primary};
                    color: white;
                    border: none;
                    font-weight: bold;
                    transition: 0.2s;
                }

                .btn-green:hover {
                    background-color: ${theme.primaryHover};
                    color: white;
                }

                .carousel-container {
                    height: 200px;
                    position: relative;
                    overflow: hidden;
                    border-radius: 15px;
                    margin: 20px 0;
                }

                .slide {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    transition: 0.8s ease-in-out;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }

                .category-pill {
                    cursor: pointer;
                    padding: 8px 25px;
                    border-radius: 50px;
                    font-weight: 600;
                    border: 2px solid ${theme.primary};
                    transition: 0.3s;
                }

                .active-pill {
                    background: ${theme.primary};
                    color: white;
                }

                .inactive-pill {
                    background: transparent;
                    color: ${theme.primary};
                }

                .cart-badge {
                    position: absolute;
                    top: -8px;
                    right: -10px;
                    background: red;
                    color: white;
                    border-radius: 50%;
                    min-width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: bold;
                }

                .cart-drawer {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 350px;
                    height: 100vh;
                    background: white;
                    z-index: 9999;
                    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
                    padding: 20px;
                    overflow-y: auto;
                }

                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.4);
                    z-index: 9998;
                }
            `}</style>

            {/* OVERLAY */}
            {cartOpen && (
                <div
                    className="overlay"
                    onClick={() =>
                        setCartOpen(false)
                    }
                />
            )}

            {/* CART DRAWER */}
            {cartOpen && (
                <div className="cart-drawer">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold">
                            Shopping Cart
                        </h4>

                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                                setCartOpen(false)
                            }
                        >
                            ✕
                        </button>
                    </div>

                    {cart.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="card mb-3 p-2"
                                >
                                    <div className="d-flex gap-3">

                                        <img
                                            src={
                                                img_url +
                                                item.product_image
                                            }
                                            alt={
                                                item.product_name
                                            }
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                objectFit:
                                                    "contain",
                                            }}
                                        />

                                        <div className="flex-grow-1">

                                            <h6 className="mb-1">
                                                {
                                                    item.product_name
                                                }
                                            </h6>

                                            <p className="text-success fw-bold mb-2">
                                                KSh{" "}
                                                {item.product_cost?.toLocaleString()}
                                            </p>

                                            <div className="d-flex align-items-center gap-2">

                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        decreaseQty(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>

                                                <span>
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() =>
                                                        increaseQty(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-link text-danger ms-auto"
                                                    onClick={() =>
                                                        removeItem(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <hr />

                            <div className="d-flex justify-content-between mb-3">
                                <strong>Total</strong>

                                <strong className="text-success">
                                    KSh{" "}
                                    {cartTotal.toLocaleString()}
                                </strong>
                            </div>

                            <button
                                className="btn btn-green w-100 py-3"
                                onClick={() =>
                                    navigate(
                                        "/makepayment",
                                        {
                                            state: {
                                                cart,
                                                total:
                                                    cartTotal,
                                            },
                                        }
                                    )
                                }
                            >
                                CHECKOUT
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* NAVBAR */}
            <nav className="navbar sticky-top bg-white shadow-sm py-3">
                <div className="container d-flex align-items-center">

                    <h2
                        className="fw-bold mb-0 text-success"
                        style={{
                            cursor: "pointer",
                        }}
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        LITO
                    </h2>

                    <div className="flex-grow-1 mx-4">
                        <input
                            className="form-control border-success-subtle shadow-none"
                            placeholder="Search products..."
                            onChange={(e) =>
                                setSearchWord(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    {/* CART ICON */}
                    <div
                        style={{
                            cursor: "pointer",
                            position: "relative",
                            fontSize: "1.5rem",
                        }}
                        onClick={() =>
                            setCartOpen(true)
                        }
                    >
                        🛒

                        {cartCount > 0 && (
                            <span className="cart-badge">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
            </nav>

            <div className="container">

                {/* CAROUSEL */}
                <div className="carousel-container shadow-sm">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="slide"
                            style={{
                                backgroundColor:
                                    slide.color,
                                left: `${(index -
                                        currentSlide) *
                                    100
                                    }%`,
                                opacity:
                                    index ===
                                        currentSlide
                                        ? 1
                                        : 0,
                            }}
                        >
                            <h2 className="fw-bold text-success mb-1">
                                {slide.title}
                            </h2>

                            <p className="text-dark opacity-75">
                                {slide.subtitle}
                            </p>
                        </div>
                    ))}
                </div>

                {/* FILTERS */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">

                    <div className="d-flex gap-2 overflow-auto pb-2">
                        {[
                            "All",
                            "Furniture",
                            "Electronics",
                        ].map((cat) => (
                            <div
                                key={cat}
                                onClick={() =>
                                    setCategory(cat)
                                }
                                className={`category-pill ${category === cat
                                        ? "active-pill"
                                        : "inactive-pill"
                                    }`}
                            >
                                {cat}
                            </div>
                        ))}
                    </div>

                    <select
                        className="form-select w-auto shadow-none border-success-subtle"
                        value={sort}
                        onChange={(e) =>
                            setSort(e.target.value)
                        }
                    >
                        <option value="default">
                            Newest First
                        </option>

                        <option value="low">
                            Price: Low to High
                        </option>

                        <option value="high">
                            Price: High to Low
                        </option>
                    </select>
                </div>

                {/* PRODUCTS */}
                <div className="row g-3 mb-5">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="col-6 col-md-4 col-5-grid"
                        >
                            <div className="card lito-card shadow-sm p-2">

                                <img
                                    src={
                                        img_url +
                                        product.product_image
                                    }
                                    className="card-img-top p-2"
                                    style={{
                                        height: "140px",
                                        objectFit:
                                            "contain",
                                    }}
                                    alt={
                                        product.product_name
                                    }
                                />

                                <div className="card-body p-2 d-flex flex-column">

                                    <h6
                                        className="fw-bold mb-1 text-truncate"
                                        title={
                                            product.product_name
                                        }
                                        style={{
                                            fontSize:
                                                "0.85rem",
                                        }}
                                    >
                                        {
                                            product.product_name
                                        }
                                    </h6>

                                    <p className="text-success fw-bold mb-3">
                                        KSh{" "}
                                        {product.product_cost?.toLocaleString()}
                                    </p>

                                    <div className="mt-auto d-grid gap-2">

                                        <button
                                            className="btn btn-outline-success py-2"
                                            onClick={() =>
                                                handleAddToCart(
                                                    product
                                                )
                                            }
                                        >
                                            ADD TO CART
                                        </button>

                                        <button
                                            className="btn btn-green py-2 shadow-sm"
                                            onClick={() =>
                                                handleBuyNow(
                                                    product
                                                )
                                            }
                                        >
                                            BUY NOW
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default GetProductsComponent;