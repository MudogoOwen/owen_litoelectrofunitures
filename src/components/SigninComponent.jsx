import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const SigninComponent = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError("")
        setSuccess("")
        setLoading(true)

        try {
            const user_data = new FormData()
            user_data.append("email", email.trim())
            user_data.append("password", password)

            console.log("Sending signin data:", { email, password })

            const response = await axios.post(
                "https://onyi.alwaysdata.net/api/login",
                user_data
            )

            if (response.data.user) {
                setSuccess(response.data.message || "✅ Sign in successful!")
                setLoading(false)
                localStorage.setItem("user", JSON.stringify(response.data.user))

                setTimeout(() => {
                    navigate("/")
                }, 1500)
            }

        } catch (error) {
            setLoading(false)
            console.error("Signin error:", error.response?.data)
            console.error("Status:", error.response?.status)

            const errorMessage = error.response?.data?.message || error.response?.data?.error || "❌ Sign in failed"
            setError(errorMessage)
        }
    }

    const handleEmailFocus = (e) => {
        e.target.style.borderColor = "#667eea"
    }

    const handleEmailBlur = (e) => {
        e.target.style.borderColor = "#e0e0e0"
    }

    const handlePasswordFocus = (e) => {
        e.target.style.borderColor = "#667eea"
    }

    const handlePasswordBlur = (e) => {
        e.target.style.borderColor = "#e0e0e0"
    }

    const handleButtonMouseOver = (e) => {
        if (!loading) {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(102, 126, 234, 0.4)"
        }
    }

    const handleButtonMouseOut = (e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "none"
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", paddingTop: "20px", paddingBottom: "20px" }}>
            <div className="card shadow-lg border-0" style={{ width: "100%", maxWidth: "450px", borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

                {/* Header Section */}
                <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "40px 30px", color: "white", textAlign: "center" }}>
                    <div style={{ fontSize: "50px", marginBottom: "15px" }}>⚡</div>
                    <h2 className="fw-bold mb-2" style={{ fontSize: "32px", letterSpacing: "0.5px" }}>Welcome Back</h2>
                    <p className="mb-0" style={{ fontSize: "14px", opacity: "0.95", letterSpacing: "0.3px" }}>Sign in to your Lito account</p>
                </div>

                {/* Form Section */}
                <div style={{ padding: "45px 35px", background: "#f8f9fa" }}>
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ borderRadius: "10px", border: "none", marginBottom: "20px", padding: "12px 16px", fontSize: "14px" }}>
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert" style={{ borderRadius: "10px", border: "none", marginBottom: "20px", padding: "12px 16px", fontSize: "14px" }}>
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={handleEmailFocus}
                                onBlur={handleEmailBlur}
                                style={{ borderRadius: "10px", border: "2px solid #e0e0e0", padding: "14px 16px", fontSize: "14px", transition: "all 0.3s", background: "white" }}
                            />
                        </div>

                        <div className="mb-5">
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={handlePasswordFocus}
                                onBlur={handlePasswordBlur}
                                style={{ borderRadius: "10px", border: "2px solid #e0e0e0", padding: "14px 16px", fontSize: "14px", transition: "all 0.3s", background: "white" }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 fw-bold"
                            disabled={loading}
                            onMouseOver={handleButtonMouseOver}
                            onMouseOut={handleButtonMouseOut}
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                padding: "14px",
                                borderRadius: "10px",
                                border: "none",
                                fontSize: "16px",
                                fontWeight: "600",
                                transition: "all 0.3s",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.8 : 1,
                                letterSpacing: "0.5px"
                            }}
                        >
                            {loading ? "⏳ Signing in..." : "✨ Sign In"}
                        </button>
                    </form>

                    <hr style={{ margin: "30px 0", border: "none", borderTop: "1px solid #ddd" }} />

                    <p className="text-center" style={{ fontSize: "14px", color: "#666", marginBottom: "0" }}>
                        Don't have an account?
                        <Link to="/signup" style={{ color: "#667eea", textDecoration: "none", fontWeight: "700", marginLeft: "6px", transition: "all 0.3s" }}>
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SigninComponent