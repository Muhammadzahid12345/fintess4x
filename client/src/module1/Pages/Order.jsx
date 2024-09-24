import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import axios from 'axios';
import swal from 'sweetalert';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Order() {
    const navigate = useNavigate();
    const [userEmail] = useState('example@example.com'); // Hardcode or set a default email
    const [cart, setCart] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        address1: '',
        address2: '',
        state: '',
        country: '',
        zipcode: '',
        status: 'Pending'
    });

    function generateRandomNumber() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const output = generateRandomNumber();
    const tracking_id = `Moiz${output}`;

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`http://localhost:8000/getUserCartItem`, {
                    params: { email: userEmail }
                });
                setCart(response.data);
            } catch (error) {
                console.log(error.message);
            }
        })();
    }, [userEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalData = { ...formData, userEmail, tracking_id, cart };
        try {
            const res = await axios.post('http://localhost:8000/orderData', finalData);
            swal("Done!", `${res.data.msg}`, "success");
            navigate('/shop');
        } catch (error) {
            console.log("Error in sending order data: " + error.message);
        }
    };

    return (
        <div className='w-full h-full flex flex-col items-center justify-start p-4'>
            <div className='w-full h-10 '>
                <BiArrowBack onClick={() => navigate(-1)} className='text-xl w-20 h-10 text-black flex items-center justify-center cursor-pointer' />
            </div>
            <h1 className='p-2 m-2 text-2xl font-semibold'>Personal Details</h1>
            <form onSubmit={handleSubmit} method="post" className='flex flex-wrap w-1/2 h-full items-center justify-center rounded p-4'>
                <div className='w-4/5 p-2 m-1 h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Name</label>
                    <input 
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                        required 
                        autoComplete='off' 
                        type="text" 
                        placeholder='Enter Name' 
                        name='name' 
                        className='w-full p-2 outline-none border-2 border-gray-400 rounded' 
                    />
                </div>
                <div className='w-4/5 p-2 m-1 h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Email</label>
                    <input 
                        readOnly 
                        autoComplete='off' 
                        value={userEmail} 
                        type="text" 
                        placeholder='Enter Email' 
                        name='email' 
                        className='w-full p-2 outline-none border-2 border-gray-400 rounded' 
                    />
                </div>
                <div className='w-4/5 p-2 m-1 h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Address 1</label>
                    <input 
                        onChange={(e) => setFormData({ ...formData, address1: e.target.value })} 
                        autoComplete='off' 
                        type="text" 
                        placeholder='Enter Address 1' 
                        name='address1' 
                        className='w-full p-2 outline-none border-2 border-gray-400 rounded' 
                    />
                </div>
                <div className='w-4/5 p-2 m-1 h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Address 2</label>
                    <input 
                        autoComplete='off' 
                        onChange={(e) => setFormData({ ...formData, address2: e.target.value })} 
                        type="text" 
                        placeholder='Enter Address 2' 
                        name='address2' 
                        className='w-full p-2 outline-none border-2 border-gray-400 rounded' 
                    />
                </div>
                <div className='w-4/5 p-2 m-1 h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">State</label>
                    <input 
                        autoComplete='off' 
                        type="text" 
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })} 
                        placeholder='Enter State' 
                        name='state' 
                        className='w-full p-2 outline-none border-2 border-gray-400 rounded' 
                    />
                </div>
                <div className='w-4/5 p-2 m-1 h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Country</label>
                    <input 
                        autoComplete='off' 
                        type="text" 
                        placeholder='Enter Country' 
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })} 
                        name='country' 
                        className='w-full p-2 outline-none border-2 border-gray-400 rounded' 
                    />
                </div>
                <div className='w-4/5 p-2 m-1 h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Zip Code</label>
                    <input 
                        autoComplete='off' 
                        type="number" 
                        placeholder='Enter Zip Code' 
                        onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })} 
                        name='zipcode' 
                        className='w-full p-2 outline-none border-2 border-gray-400 rounded' 
                    />
                </div>
                <button 
                    type="submit" 
                    className='uppercase w-full h-12 border-orange-500 border-2 rounded text-white font-semibold m-4 transition-all duration-300 bg-orange-500 hover:text-black hover:bg-transparent hover:border-orange-600'
                >
                    Place Order
                </button>
                <div className='w-full h-full p-2'>
                    <PayPalScriptProvider options={{ "client-id": "test" }}>
                        <PayPalButtons />
                    </PayPalScriptProvider>
                </div>
            </form>
        </div>
    );
}
