import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GetProductsComponent from './components/GetProductsComponent';
import AddProductsComponent from './components/AddProductsComponent';
import MakePaymentComponent from './components/MakePaymentComponent';
import SigninComponent from './components/SigninComponent';
import SignupComponent from './components/SignupComponent';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import NavbarComponent from './components/NavbarComponent';


function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <NavbarComponent/>
        <header className='App-header'>
          <h1>Lito Elecrofunitures</h1>
        </header>
      </div>
     <Routes>
            <Route path='/' element={<GetProductsComponent />} />
            <Route path='/addproducts' element={<AddProductsComponent />} />
            <Route path="/signin" element={<SigninComponent />} />
            <Route path='/signup' element={<SignupComponent />} />
            <Route path='/makepayment' element={<MakePaymentComponent />} />
            

          </Routes>
    </BrowserRouter>
  );
}

export default App;
