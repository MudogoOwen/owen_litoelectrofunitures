import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GetProductsComponent = () => {
    let [products, setProducts] = useState([])
    let [loading, setLoading] = useState("")
    let [error, setError] = useState("")


    // base url for images from server

    const img_url = "https://onyi.alwaysdata.net/static/images/"

    let navigator = useNavigate();
    //create function to fetch products from backend api

    const getproducts = async () => {
        setError("")
        setLoading("Fetching products. Please wait...")

        try {
            const response = await axios.get("https://onyi.alwaysdata.net/api/get_products")
            console.log(response)

            if (response.status === 200) {
                setLoading("")
                setProducts(response.data)
            }
        } catch (error) {
            setLoading("")
            setError(error.message)

        }
    }

    useEffect(() => {
        getproducts();
    }, [])

    return (
        <div className="row">
            <h3 className="text-success text-center">Available products</h3>
            <h6 className="text-warning">{loading}</h6>
            <h6 className="text-danger">{error}</h6>

            {products.map((product) => (<div className="col-md-3 justify-content-center mb-4">
                <div className="card shadow card-margin">
                    <img src={img_url + product.product_image} alt="" className="product_img mt-4" />
                    <div className="card-body">
                        <h5 className="mt-4">{product.product_name}</h5>
                        <p className="text-muted">{product.product_description}</p>
                        <p className="text-warning">{product.product_cost}</p>
                        <br /><br />
                        <button
                            className="btn btn-dark"
                            on onClick={() => {
                                navigator("/makepayment", { state: { product } })
                            }}
                        >
                            Purchase now</button>
                    </div>
                </div>
            </div>))}


        </div>
    )
}
export default GetProductsComponent;