import axios, { Axios } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const SigninComponent = () => {
    let [email, updateEmail] = useState("")
    let [password, updatePassword] = useState("")

    let [loading, updateLoading] = useState("")
    let [success, updateSuccess] = useState("")
    let [error, updateError] = useState("")

    //use useNavigate hook to automatically navigate to home component
    let navigater = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        updateError("")
        updateSuccess("")
        updateLoading("Please wait...")

        try {
            //form data creation

            const user_data = new FormData();
            user_data.append("email", email)
            user_data.append("password", password)

            //get response from server after sending data
            const response = await axios.post(
                "https://onyi.alwaysdata.net/api/signin", user_data)
            console.log(response)
            if (response.data.user) {
                updateSuccess(response.data.message)
                updateLoading("")

                //to save user data after log in
                localStorage.setItem("user", JSON.stringify(response.data.user))

                //reroute to homepage
                navigater("/")
            } else {
                updateError(response.data.message)
                updateLoading("")
            }

        } catch (error) {
            updateError(error.message)
            updateLoading("")
        }

    }



    return (
        <div className="row justify-content-center mt-4">
            <div className="col-md-6 card shadow p-4">
                <h2>Sign In</h2>
                <h5 className="text-warning">{loading}</h5>
                <h5 className="text danger">{error}</h5>
                <h5 className="text-success">{success}</h5>

                <form onSubmit={handleSubmit}>
                    <input type="text"
                        className="form-control"
                        placeholder="Enter email"
                        required
                        value={email}
                        onChange={(e) => { updateEmail(e.target.value) }} />
                    <br />


                    <input type="password"
                        className="form-control"
                        placeholder="Enter Password"
                        required
                        value={password}
                        onChange={(e) => { updatePassword(e.target.value) }} />
                    <br />

                    <Link to="/signup">Don't have an account? Sign up</Link>
                    <br />
                    <button className="btn btn-success">Sign in</button>








                </form>
            </div>
        </div>
    )


}
export default SigninComponent;