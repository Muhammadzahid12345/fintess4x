import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Authentication } from '../../utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { BiArrowBack } from 'react-icons/bi';
import FileBase from 'react-file-base64'
import axios from 'axios';
import swal from 'sweetalert';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";




export default function HirePayment() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [Data, setData] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [formData, setFormData] = useState({ username: '', address1: '', address2: '', state: '', country: '', zipcode: '', status: 'Pending', trainingStart: "", trainingEnd: "", img: "", trainerID: "" });
    const [starttraineeTiming, setStartTraineeTiming] = useState('')
    const [EndtraineeTiming, setEndTraineeTiming] = useState('')
    const [TrainerName, setTrainerName] = useState('')
    const [trainer_ID, setTrainerId] = useState('')


    useEffect(() => {
        onAuthStateChanged(Authentication, (currentUser) => {
            if (!currentUser) navigate("/login");
            let email = currentUser.email
            setUserEmail(email)
        });
    }, [userEmail, navigate])


    function generateRandomNumber() {
        var minm = 100000;
        var maxm = 999999;
        return Math.floor(Math
            .random() * (maxm - minm + 1)) + minm;
    }
    let output = generateRandomNumber();


    let { username, address1, address2, state, country, zipcode, status, trainingStart, trainingEnd, img, trainerID } = formData;
    let tracking_id = `NotMoiz${output}`;
    trainerID = trainer_ID;






    const handleSubmit = async (e) => {
        e.preventDefault();
        let finalData = { username, userEmail, address1, address2, state, country, zipcode, status, tracking_id, trainingStart, trainingEnd, img, trainerID }

        if (trainingStart >= starttraineeTiming && trainingEnd < EndtraineeTiming) {
            try {
                await axios.post('http://localhost:8000/saveTrainingPayment', finalData)
                    .then(res =>  res.data.msg === "You cannot hire Active Trainer more then once" ? swal("Opsss!" , `${res.data.msg}` , "error") :  swal("Done!", `${res.data.msg}`, "success"))
                    .then(navigate('/home'))
            } catch (error) {
                console.log("error in sending order data" + error.message)
            }
        }
        else {
            return swal("Done!", "Your Selected Time Doesn't Match Trainer Time", "error")
        }

    }



    useEffect(() => {
        (async () => {
            try {
                await axios.get('http://localhost:8000/gettraineeData', { params: { getid: id } }).then(res => res.data).then(data => setData(data))
            } catch (error) {
                console.log('error in fetching trainee Data')
            }
        })()

    }, [])

    useEffect(() => {
        Data?.map((item) => setStartTraineeTiming(item.availableStart))
        Data?.map((item) => setEndTraineeTiming(item.availableEnd))
        Data?.map((item) => setTrainerName(item.name))
        Data?.map((item) => setTrainerId(item._id))
    }, [Data])


    return (
        <div className='w-full h-full flex flex-col items-center justify-start p-4'>
            <div className='w-full h-10 '>
                <BiArrowBack onClick={() => navigate(-1)} className='text-xl w-20 h-10  text-black flex items-center justify-center cursor-pointer' />
            </div>
            <h1 className='p-2 m-2 text-2xl font-semibold'>Personal Details</h1>
            <form onSubmit={handleSubmit} method="post" className='flex flex-wrap  w-1/2 h-full items-center justify-center  rounded  p-4'>
                <div className='w-4/5 p-2 m-1  h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Name</label>
                    <input onChange={(e) => setFormData({ ...formData, username: e.target.value })} required autoComplete='off' type="text" placeholder='Enter Name' name='name' className='w-full p-2  outline-none border-2  border-gray-400 rounded' />
                </div>
                <div className='w-4/5 p-2 m-1  h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Email</label>
                    <input readOnly autoComplete='off' value={userEmail} type="text" placeholder='Enter Name' name='email' className='w-full p-2  outline-none border-2 border-gray-400 rounded' />
                </div>
                <div className='w-4/5 p-2 m-1  h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Trainer Name</label>
                    <input readOnly autoComplete='off' value={TrainerName} type="text" placeholder='Enter Name' name='email' className='w-full p-2  outline-none border-2 border-gray-400 rounded' />
                </div>
                <div className='w-4/5 p-2 m-1  h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Address 1 </label>
                    <input onChange={(e) => setFormData({ ...formData, address1: e.target.value })} autoComplete='off' type="text" placeholder='Enter Name' name='address1' className='w-full p-2  outline-none border-2 border-gray-400 rounded' />
                </div>
                <div className='w-4/5 p-2 m-1  h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Address 2</label>
                    <input autoComplete='off' onChange={(e) => setFormData({ ...formData, address2: e.target.value })} type="text" placeholder='Enter Name' name='address2' className='w-full p-2  outline-none border-2 border-gray-400 rounded' />
                </div>
                <div className='w-4/5 p-2 m-1 h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">State</label>
                    <input autoComplete='off' type="text" onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder='Enter Name' name='state' className='w-full p-2  outline-none border-2 border-gray-400 rounded' />
                </div>
                <div className='w-4/5 p-2 m-1  h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Country</label>
                    <input autoComplete='off' type="text" placeholder='Enter Name' onChange={(e) => setFormData({ ...formData, country: e.target.value })} name='country' className='w-full p-2  outline-none border-2 border-gray-400 rounded' />
                </div>
                <div className='w-4/5 p-2 m-1  h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Zip Code</label>
                    <input autoComplete='off' type="number" placeholder='Enter Name' onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })} name='zipcode' className='w-full p-2  outline-none border-2 border-gray-400 rounded' />
                </div>
                <div className='w-4/5 p-2 m-1  h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Training Time Start</label>
                    <input autoComplete='off' type="time" placeholder='Enter Name' onChange={(e) => setFormData({ ...formData, trainingStart: e.target.value })} name='zipcode' className='w-full p-2  outline-none border-2 border-gray-400 rounded' />
                </div>
                <div className='w-4/5 p-2 m-1  h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="">Training Time End</label>
                    <input autoComplete='off' type="time" placeholder='Enter Name' onChange={(e) => setFormData({ ...formData, trainingEnd: e.target.value })} name='zipcode' className='w-full p-2  outline-none border-2 border-gray-400 rounded' />
                </div>
                <div className='w-4/5 p-2 m-1  h-24 flex flex-col items-start justify-start '>
                    <label htmlFor="" className='text-gray-700 font-semibold text-lg'>Profile Image</label>
                    <FileBase required onDone={({ base64 }) => setFormData({ ...formData, img: base64 })} type="file" placeholder='product Name' className='text-black w-80 h-10 border-2 flex items-center justify-center border-black rounded m-4 p-2' />
                </div>

                <button type="submit" className='uppercase w-full h-12 border-orange-500 border-2 rounded text-white font-semibold m-4 transition-all duration-300 bg-orange-500 hover:text-black hover:bg-transparent hover:border-orange-600'>Place Order</button>
                <div className='w-full h-full p-2'>

                    <PayPalScriptProvider options={{ "client-id": "test" }}>
                        <PayPalButtons />
                    </PayPalScriptProvider>
                </div>


            </form >
        </div >
    )
}

