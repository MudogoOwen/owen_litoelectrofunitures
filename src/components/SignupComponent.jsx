import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"

const SignupComponent = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "", color: "#e0e0e0" })

    const calculatePasswordStrength = (pw) => {
        if (!pw) return { score: 0, label: "", color: "#e0e0e0" }

        let score = 0
        if (pw.length >= 8) score += 1
        if (pw.length >= 12) score += 1
        if (/[a-z]/.test(pw)) score += 1
        if (/[A-Z]/.test(pw)) score += 1
        if (/[0-9]/.test(pw)) score += 1
        if (/[^A-Za-z0-9]/.test(pw)) score += 1

        // normalize to 0..5
        const max = 6
        const normalized = Math.min(Math.floor((score / max) * 5), 5)

        let label = "Very Weak"
        let color = "#ff4d4f"
        if (normalized <= 1) { label = "Very Weak"; color = "#ff4d4f" }
        else if (normalized === 2) { label = "Weak"; color = "#ff7a45" }
        else if (normalized === 3) { label = "Fair"; color = "#ffa940" }
        else if (normalized === 4) { label = "Good"; color = "#73d13d" }
        else if (normalized === 5) { label = "Strong"; color = "#52c41a" }

        return { score: normalized, label, color }
    }

    const getPasswordHints = () => {
        const hints = []
        if (password.length < 8) hints.push("At least 8 characters")
        if (!/[a-z]/.test(password)) hints.push("Lowercase letter")
        if (!/[A-Z]/.test(password)) hints.push("Uppercase letter")
        if (!/[0-9]/.test(password)) hints.push("Number")
        if (!/[^A-Za-z0-9]/.test(password)) hints.push("Special character (!@#$%^&*)")
        return hints
    }

    const handlePasswordChange = (e) => {
        const val = e.target.value
        setPassword(val)
        setPasswordStrength(calculatePasswordStrength(val))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setLoading(true)

        try {
            const user_data = new FormData()
            user_data.append("username", username.trim())
            user_data.append("email", email.trim())
            user_data.append("phone", phone.trim())
            user_data.append("password", password)

            console.log("Sending FormData:", { username, email, phone, password })

            await axios.post(
                "https://onyi.alwaysdata.net/api/signup",
                user_data
            )

            setSuccess("✅ Signup successful! Welcome!")
            setUsername("")
            setEmail("")
            setPassword("")
            setPhone("")
            setPasswordStrength({ score: 0, label: "", color: "#e0e0e0" })

        } catch (error) {
            console.error("Full error object:", error)
            console.error("Error response:", error.response?.data)
            console.error("Error status:", error.response?.status)

            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Signup failed"
            setError(`❌ ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }

    const hints = getPasswordHints()

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <div className="card shadow-lg border-0" style={{ width: "100%", maxWidth: "450px", borderRadius: "15px", overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "30px", color: "white", textAlign: "center" }}>
                    <h2 className="fw-bold mb-2" style={{ fontSize: "28px" }}>⚡ Create Account</h2>
                    <p className="mb-0" style={{ fontSize: "14px", opacity: "0.9" }}>Join Lito Electrofunitures today</p>
                </div>

                <div style={{ padding: "40px" }}>
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ borderRadius: "8px", border: "none" }}>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert" style={{ borderRadius: "8px", border: "none" }}>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="👤 Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ borderRadius: "8px", border: "1px solid #ddd", padding: "12px 15px", fontSize: "14px" }}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="📧 Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ borderRadius: "8px", border: "1px solid #ddd", padding: "12px 15px", fontSize: "14px" }}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="📱 Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                style={{ borderRadius: "8px", border: "1px solid #ddd", padding: "12px 15px", fontSize: "14px" }}
                            />
                        </div>

                        <div className="mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="🔒 Password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                style={{ borderRadius: "8px", border: "1px solid #ddd", padding: "12px 15px", fontSize: "14px" }}
                                aria-describedby="passwordHelp"
                            />
                        </div>

                        {/* Password strength meter */}
                        <div id="passwordHelp" style={{ marginBottom: 16 }}>
                            <div style={{ height: 8, background: "#f0f0f0", borderRadius: 6, overflow: "hidden" }}>
                                <div
                                    style={{
                                        width: `${(passwordStrength.score / 5) * 100}%`,
                                        height: "100%",
                                        background: passwordStrength.color,
                                        transition: "width 200ms ease"
                                    }}
                                />
                            </div>
                            {password && (
                                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                                    <span style={{ color: passwordStrength.color, fontWeight: 600 }}>{passwordStrength.label}</span>
                                    <small style={{ color: "#888" }}>{password.length} chars</small>
                                </div>
                            )}

                            {/* Password hints */}
                            {password && hints.length > 0 && (
                                <div style={{ marginTop: 12, padding: "10px 12px", background: "#f5f5f5", borderRadius: "6px", border: "1px solid #e8e8e8" }}>
                                    <small style={{ display: "block", color: "#666", fontWeight: "600", marginBottom: "6px" }}>💡 Add to strengthen password:</small>
                                    {hints.map((hint, idx) => (
                                        <small key={idx} style={{ display: "block", color: "#999", marginBottom: idx < hints.length - 1 ? "4px" : "0" }}>
                                            • {hint}
                                        </small>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mb-4" />

                        <button
                            type="submit"
                            className="btn w-100 fw-bold"
                            disabled={loading}
                            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", padding: "12px", borderRadius: "8px", border: "none", fontSize: "16px", transition: "transform 0.2s" }}
                            onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
                            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                        >
                            {loading ? "⏳ Signing up..." : "✨ Sign Up"}
                        </button>
                    </form>

                    <hr style={{ margin: "25px 0", border: "none", borderTop: "1px solid #eee" }} />

                    <p className="text-center" style={{ fontSize: "14px", color: "#666" }}>
                        Already have an account?{" "}
                        <Link to="/signin" style={{ color: "#667eea", textDecoration: "none", fontWeight: "bold" }}>
                            Sign In Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignupComponent