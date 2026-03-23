import axios, { Axios } from "axios";
import { useState } from "react";

const AddProductComponent = () => {
    let [product_name, setProductName] = useState("");
    let [product_cost, setProductCost] = useState("");
    let [product_category, setProductCategory] = useState("");
    let [product_description, setProductDescription] = useState("");
    let [product_image, setProductImage] = useState("");


    let [loading, setLoading] = useState("")
    let [success, setSuccess] = useState("")
    let [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading("Submitting Please wait... ")
        setSuccess("")
        setError("")

        try {
            const product_data = new FormData()
            product_data.append("product_name", product_name)
            product_data.append("product_cost", product_cost)
            product_data.append("product_category", product_category)
            product_data.append("product_description", product_description)
            product_data.append("product_image", product_image)


            const responce = await axios.post(
                "https://onyi.alwaysdata.net/api/add_products", 
                product_data)
            console.log(responce)

            if (responce.status === 200) {
                setSuccess(responce.data.message)
                setLoading("")
                setError("")

            }

        } catch (error) {
            console.log(error.message)
            setLoading("")
            setError(error.message)
        }
    }

    return (
        <div className="row justify-content-center mt-4">
            <div className="col-md-6 card shadow p-4">

                <h2>Add products</h2>


                <h5 className="text-warning">{loading}</h5>
                <h5 className="text-success">{success}</h5>
                <h5 className="text-danger">{error}</h5>


                <form onSubmit={handleSubmit}>
                    <input type="text"
                        className="form-control"
                        placeholder="Enter product name"
                        value={product_name}
                        onChange={(e) => { setProductName(e.target.value) }}
                    />

                    <br />

                    <input type="number"
                        className="form-control"
                        placeholder="Enter product cost"
                        value={product_cost}
                        onChange={(e) => { setProductCost(e.target.value) }}
                    />

                    <br />

                    <select className="form-select"
                        value={product_category}
                        onChange={(e) => { setProductCategory(e.target.value) }}
                    >
                        <option value="">Select category</option>
                        <option value="television">Electronics</option>
                        <option value="phones">Phones</option>
                        <option value="laptops">Laptops</option>
                        <option value="accessories">Accessories</option>
                    </select>

                    <br />

                    <textarea
                        className="form-control"
                        rows="5"
                        placeholder="Enter product description"
                        value={product_description}
                        onChange={(e) => { setProductDescription(e.target.value) }}
                    >

                    </textarea>
                    <label htmlFor="" className="form-lable">Product image</label>
                    <input type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => { setProductImage(e.target.files[0]) }}
                    />

                    <br />

                    <button className="btn btn-outline-info">Submit</button>
                </form>
            </div>

        </div>
    );
}
export default AddProductComponent;