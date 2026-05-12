import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MakePaymentComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // SUPPORT BOTH SINGLE PRODUCT + CART
    const product = location.state?.product;
    const cart = location.state?.cart || [];

    const img_url = "https://onyi.alwaysdata.net/static/images/";

    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // DETERMINE MODE
    const isCart = cart.length > 0;

    // TOTAL CALCULATION
    const total = isCart
        ? cart.reduce(
            (sum, item) =>
                sum + item.product_cost * item.quantity,
            0
        )
        : product?.product_cost || 0;

    // HANDLE PAYMENT
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading("Processing payment...");

        try {
            const data = new FormData();
            data.append("amount", total);
            data.append("phone", phone);

            const response = await axios.post(
                "https://onyi.alwaysdata.net/api/mpesa_payment",
                data
            );

            if (response.status === 200) {
                setLoading("");
                setSuccess(response.data.message);
                setPhone("");

                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (error) {
            setLoading("");
            setError(
                error.response?.data?.message ||
                error.message ||
                "Payment failed"
            );
        }
    };

    // NO PRODUCT OR CART
    if (!product && cart.length === 0) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center">
                    <h4>❌ No items selected</h4>
                    <p>Please add items to cart or select a product.</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="container-fluid py-5"
            style={{
                backgroundColor: "#f8f9fa",
                minHeight: "100vh",
            }}
        >
            <div className="container">
                <h2 className="text-center fw-bold mb-5 text-primary">
                    💳 LIPA NA MPESA
                </h2>

                <div className="row g-4 justify-content-center">

                    {/* LEFT SIDE - PRODUCT / CART */}
                    <div className="col-md-5">

                        <div className="card shadow-lg border-0 p-4">

                            {/* CART VIEW */}
                            {isCart ? (
                                <>
                                    <h5 className="fw-bold mb-3">
                                        🛒 Cart Items
                                    </h5>

                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border-bottom py-2"
                                        >
                                            <div className="d-flex justify-content-between">
                                                <span>
                                                    {item.product_name}
                                                </span>

                                                <span className="fw-bold">
                                                    KSh{" "}
                                                    {(
                                                        item.product_cost *
                                                        item.quantity
                                                    ).toLocaleString()}
                                                </span>
                                            </div>

                                            <small className="text-muted">
                                                Qty: {item.quantity}
                                            </small>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                // SINGLE PRODUCT VIEW
                                <>
                                    <img
                                        src={
                                            img_url +
                                            product.product_image
                                        }
                                        alt={
                                            product.product_name
                                        }
                                        className="rounded img-fluid mb-3"
                                        style={{
                                            height: "300px",
                                            objectFit:
                                                "cover",
                                        }}
                                    />

                                    <h5 className="fw-bold text-dark">
                                        {product.product_name}
                                    </h5>

                                    <p className="badge bg-primary mb-2">
                                        {product.product_category}
                                    </p>

                                    <p className="text-muted small mb-3">
                                        {
                                            product.product_description
                                        }
                                    </p>
                                </>
                            )}

                            <hr />

                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted">
                                    Total Amount:
                                </span>

                                <h4 className="text-success fw-bold mb-0">
                                    Ksh{" "}
                                    {total.toLocaleString()}
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - PAYMENT */}
                    <div className="col-md-5">
                        <div className="card shadow-lg border-0 p-4">

                            <h5 className="fw-bold mb-4">
                                📱 Payment Details
                            </h5>

                            {/* STATUS */}
                            {loading && (
                                <div className="alert alert-warning">
                                    ⏳ {loading}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger">
                                    ❌ {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success">
                                    ✅ {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                {/* AMOUNT */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        Amount (Ksh)
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        value={total}
                                        readOnly
                                    />
                                </div>

                                {/* PHONE */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        M-Pesa Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        className="form-control"
                                        placeholder="254xxxxxxxxx"
                                        required
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <small className="text-muted">
                                        Format: 254712345678
                                    </small>
                                </div>

                                {/* BUTTON */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 fw-bold"
                                    disabled={
                                        loading !== "" ||
                                        !phone
                                    }
                                >
                                    💰 Pay Now
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary w-100 mt-2"
                                    onClick={() =>
                                        navigate(-1)
                                    }
                                >
                                    ← Go Back
                                </button>
                            </form>

                            <div className="alert alert-info mt-4">
                                <strong>Secure Payment:</strong>{" "}
                                Powered by M-Pesa STK Push
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MakePaymentComponent;