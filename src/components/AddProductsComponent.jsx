import axios from "axios";
import { useState } from "react";

const AddProductComponent = () => {
    const [product_name, setProductName] = useState("");
    const [product_cost, setProductCost] = useState("");
    const [product_category, setProductCategory] = useState("");
    const [product_description, setProductDescription] = useState("");
    const [product_image, setProductImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFinalUpload = async () => {
        setLoading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("product_name", product_name);
            formData.append("product_cost", product_cost);
            formData.append("product_category", product_category);
            formData.append("product_description", product_description);
            formData.append("product_image", product_image);

            const response = await axios.post("https://onyi.alwaysdata.net/api/add_products", formData);
            if (response.status === 200 || response.status === 201) setStep(3);
        } catch (err) {
            setError("Failed to list product. Please verify all fields are filled.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setProductName(""); setProductCost(""); setProductCategory("");
        setProductDescription(""); setProductImage(null); setImagePreview(null);
        setStep(1);
    };

    const styles = {
        pageBg: { backgroundColor: "#f1f2f6", minHeight: "100vh", padding: "3rem 1rem", fontFamily: "'Inter', sans-serif" },
        mainContainer: { maxWidth: "900px", margin: "0 auto" },
        card: { backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden", border: "none" },
        sidebar: { backgroundColor: "#282828", color: "#fff", padding: "2.5rem 2rem" },
        content: { padding: "2.5rem" },
        orangeBtn: { backgroundColor: "#f68b1e", color: "#fff", fontWeight: "700", letterSpacing: "0.5px", border: "none", padding: "0.8rem 1.5rem", borderRadius: "6px" },
        inputLabel: { fontSize: "0.75rem", fontWeight: "700", color: "#4b5563", textTransform: "uppercase", marginBottom: "0.5rem", display: "block" },
        stepDot: (active) => ({
            width: "10px", height: "10px", borderRadius: "50%",
            backgroundColor: active ? "#f68b1e" : "#d1d5db", transition: "0.3s"
        })
    };

    return (
        <div style={styles.pageBg}>
            <div style={styles.mainContainer}>

                {/* Stepper Indicator */}
                <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
                    <div style={styles.stepDot(step >= 1)}></div>
                    <div style={{ width: "40px", height: "2px", backgroundColor: "#d1d5db" }}></div>
                    <div style={styles.stepDot(step >= 2)}></div>
                    <div style={{ width: "40px", height: "2px", backgroundColor: "#d1d5db" }}></div>
                    <div style={styles.stepDot(step >= 3)}></div>
                </div>

                <div className="row g-0" style={styles.card}>
                    {/* Left Panel: Contextual Info */}
                    <div className="col-lg-4 d-none d-lg-block" style={styles.sidebar}>
                        <h4 className="fw-bold mb-4">Seller Portal</h4>
                        <div className="mb-4">
                            <p className="small opacity-75 mb-1">Current Task:</p>
                            <h6 className="fw-bold">{step === 1 ? "Product Identification" : step === 2 ? "Media & Pricing" : "Process Complete"}</h6>
                        </div>
                        <hr className="opacity-25" />
                        <ul className="list-unstyled small opacity-75 mt-4">
                            <li className="mb-3">✓ Use clear, high-res images</li>
                            <li className="mb-3">✓ Write descriptive titles</li>
                            <li className="mb-3">✓ Set competitive pricing</li>
                        </ul>
                    </div>

                    {/* Right Panel: Form Content */}
                    <div className="col-lg-8" style={styles.content}>
                        {error && <div className="alert alert-danger border-0 py-2 small">{error}</div>}

                        {step === 1 && (
                            <div className="animate__animated animate__fadeInRight">
                                <h4 className="fw-bold mb-1">Sell an Item</h4>
                                <p className="text-muted small mb-4">Provide accurate details to attract more buyers.</p>

                                <div className="mb-3">
                                    <label style={styles.inputLabel}>Product Title</label>
                                    <input type="text" className="form-control form-control-lg fs-6" value={product_name} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Sony Bravia 55' Smart TV" />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label style={styles.inputLabel}>Category</label>
                                        <select className="form-select shadow-none" value={product_category} onChange={(e) => setProductCategory(e.target.value)}>
                                            <option value="">Choose Category</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Furniture">Furniture</option>
                                            <option value="Fashion">Fashion</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label style={styles.inputLabel}>Condition</label>
                                        <select className="form-select shadow-none">
                                            <option>Brand New</option>
                                            <option>Refurbished</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label style={styles.inputLabel}>Detailed Description</label>
                                    <textarea className="form-control" rows="4" value={product_description} onChange={(e) => setProductDescription(e.target.value)} placeholder="Tell buyers what makes your product special..."></textarea>
                                </div>

                                <button className="btn w-100 py-3" style={styles.orangeBtn} onClick={() => setStep(2)}>
                                    NEXT: IMAGES & PRICING
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate__animated animate__fadeInRight">
                                <h4 className="fw-bold mb-4">Media & Final Details</h4>

                                <div className="mb-4 text-center p-4 border rounded-3 bg-light" style={{ borderStyle: 'dashed !important' }}>
                                    {imagePreview ? (
                                        <div className="position-relative d-inline-block">
                                            <img src={imagePreview} alt="Preview" style={{ height: "150px", borderRadius: "8px" }} />
                                            <button className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" onClick={() => setImagePreview(null)}>×</button>
                                        </div>
                                    ) : (
                                        <div onClick={() => document.getElementById('imgInp').click()} style={{ cursor: 'pointer' }}>
                                            <i className="bi bi-image fs-1 text-muted"></i>
                                            <p className="small fw-bold text-primary mt-2">Upload Product Image</p>
                                            <p className="text-muted" style={{ fontSize: '0.7rem' }}>JPEG, PNG (Max 5MB)</p>
                                        </div>
                                    )}
                                    <input id="imgInp" type="file" className="d-none" onChange={handleImageChange} />
                                </div>

                                <div className="mb-4">
                                    <label style={styles.inputLabel}>Setting the Price (KSh)</label>
                                    <div className="input-group input-group-lg">
                                        <span className="input-group-text bg-white border-end-0">KSh</span>
                                        <input type="number" className="form-control border-start-0 fw-bold" value={product_cost} onChange={(e) => setProductCost(e.target.value)} placeholder="0.00" />
                                    </div>
                                </div>

                                <div className="d-flex gap-3">
                                    <button className="btn btn-outline-secondary w-50 py-3 fw-bold" onClick={() => setStep(1)}>BACK</button>
                                    <button className="btn w-50 py-3" style={styles.orangeBtn} onClick={handleFinalUpload} disabled={loading}>
                                        {loading ? <span className="spinner-border spinner-border-sm"></span> : "LIST PRODUCT"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center animate__animated animate__bounceIn py-4">
                                <div className="bg-success text-white d-inline-flex align-items-center justify-content-center rounded-circle mb-4" style={{ width: "80px", height: "80px" }}>
                                    <span className="fs-1">✓</span>
                                </div>
                                <h3 className="fw-bold">Item Successfully Listed!</h3>
                                <p className="text-muted">Your product is now being indexed and will appear on the Lito marketplace shortly.</p>
                                <button className="btn btn-dark px-5 py-2 mt-3" onClick={resetForm}>ADD ANOTHER ITEM</button>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center text-muted mt-4 small">LITO Marketplace © 2026 • Quality Guaranteed</p>
            </div>
        </div>
    );
};

export default AddProductComponent;