import axios from "axios"
import { use, useState } from "react"
import { Link } from "react-router-dom"

const SignupComponent = () => {
    let [username, updateUsername] = useState("")
    let [email, updateEmail] = useState("")
    let [phone, updatePhone] = useState("")
    let [Password, updatePassword] = useState("")

    //loading state variables

    let [loading, updateLoading] = useState("")
    let [success, updateSuccess] = useState("")
    let [error, updateError] = useState("")

    let handleSubmit = async (e) => {
        //prevent form from reloading page
        e.preventDefault()

        //alert user loading
        updateError("")
        updateSuccess("")
        updateLoading("Submitting Data. Please wait...")

        //confirm user data
        console.log(username, email, phone, Password);
        //try send data to the server
        try {
            const user_data = new FormData()
            user_data.append("username", username)
            user_data.append("email", email)
            user_data.append("phone", phone)
            user_data.append("password", Password)

            //use axios to send data to server
            const response = await axios.post(
                "https://onyi.alwaysdata.net/api/signup",
                user_data)
            console.log(response)
            if (response.status === 200) {
                updateSuccess(response.data.message)
                updateLoading("")
                updateUsername("")
                updateEmail("")
                updatePassword("")
                updatePhone("")


            }
        } catch (error) {
            console.log(error)
            updateLoading("")
            updateError(error.message)
        }



    }

    return (
        <div className="row justify-content-center mt-4">

            <div className="col-md-6 card shadow p-4">
                <h2>Sign Up</h2>
                <h5 className="text-warning">{loading}</h5>
                <h5 className="text-danger">{error}</h5>
                <h5 className="text-success">{success}</h5>

                <form onSubmit={handleSubmit}>
                    <input type="text"
                        className="form-control"
                        placeholder="Enter username"
                        required
                        value={username}
                        onChange={(e) => { updateUsername(e.target.value) }}

                    /> <br />
                    <input type="email"
                        className="form-control"
                        placeholder="Enter Email"
                        required
                        value={email}
                        onChange={(e) => { updateEmail(e.target.value) }}
                    /> <br />

                    <input type="tel"
                        className="form-control"
                        placeholder="Enter Phone"
                        required
                        value={phone}
                        onChange={(e) => { updatePhone(e.target.value) }}
                    /> <br />




                    <input type="password"
                        className="form-control"
                        placeholder="Enter Password"
                        required
                        value={Password}
                        onChange={(e) => { updatePassword(e.target.value) }}
                    /> <br />





                    <button className="btn btn-dark">
                        sign Up
                    </button> <br />

                    <Link to="/signin">Already have an account? Sign in</Link>


                </form>
            </div>
        </div>

    )

}
export default SignupComponent;