import React,{useEffect,useState} from 'react'
import { listUserCart,saveAddress } from '../../api/user'
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { numberFormat } from "../../utils/number";

const SummaryCard = () => {
    const token = useEcomStore((state) => state.token);
    const [products, setProducts] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    const [address, setAddress] = useState("");
    const [addressSaved, setAddressSaved] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
    hdlGetUserCart(token);
}, []);

 const hdlGetUserCart = (token) => {
    listUserCart(token)
      .then((res) => {
        // console.log(res)
        setProducts(res.data.products);
        setCartTotal(res.data.cartTotal);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const hdlSaveAddress = () => {
    if (!address) {
      return toast.warning("Please fill address");
    }
    saveAddress(token, address)
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        setAddressSaved(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const hdlGoToPayment = () => {
    if (!addressSaved) {
      return toast.warning("กรุณากรอกทีอยู่ก่อนจ้า");
    }
    navigate("/user/payment");
  };

  console.log(products)

  return (
    <div className='max-w-5xl mx-auto p-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 items-start'>
                {/* Left */}
            <div className='bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4'>
                <div>
                    <h1 className='font-semibold text-lg text-slate-800'>ที่อยู่ในการจัดส่ง</h1>
                    <p className='text-sm text-slate-400 mt-0.5'>ใช้สำหรับจัดส่งสินค้าของคุณ</p>
                </div>

                <textarea
                required
                onChange={(e)=>setAddress(e.target.value)}
                placeholder='กรุณากรอกที่อยู่'
                rows={4}
                className='w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400
                focus:border-indigo-400 resize-none'/>

                <button
                onClick={hdlSaveAddress}
                className='bg-indigo-600 text-white text-sm font-semibold
                px-4 py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors'>
                    บันทึกที่อยู่
                </button>

                {
                    addressSaved &&
                    <p className='text-xs text-emerald-600 flex items-center gap-1.5'>
                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                        บันทึกที่อยู่เรียบร้อยแล้ว
                    </p>
                }
            </div>
                {/* Right */}
            <div className='bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4'>
                <h1 className='text-lg font-semibold text-slate-800'>คำสั่งซื้อของคุณ</h1>

                {/* Item List */}
                <div className='divide-y divide-slate-100'>
                    {
                        products?.map((item,index)=>
                        <div key={index} className='flex justify-between items-start py-2.5 first:pt-0'>
                            <div>
                                <p className='font-medium text-slate-700'>{item.product.title}</p>
                                <p className='text-sm text-slate-400 mt-0.5'>จำนวน {item.count} x {numberFormat(item.product.price)}</p>
                            </div>

                            <p className='text-slate-700 font-semibold whitespace-nowrap'>
                                {numberFormat(item.count * item.product.price)}
                            </p>
                        </div>
                        )
                    }
                </div>

                <div className='space-y-1.5 text-sm border-t border-slate-100 pt-3'>
                    <div className='flex justify-between text-slate-500'>
                        <p>ค่าจัดส่ง</p>
                        <p>0.00</p>
                    </div>
                    <div className='flex justify-between text-slate-500'>
                        <p>ส่วนลด</p>
                        <p>0.00</p>
                    </div>
                </div>

                <div className='flex justify-between items-center border-t border-slate-100 pt-3'>
                    <p className='font-semibold text-slate-800'>ยอดรวมสุทธิ</p>
                    <p className='text-indigo-600 font-semibold text-xl'>
                        {numberFormat(cartTotal)}
                    </p>
                </div>

                <button
                onClick={hdlGoToPayment}
                // disabled = {!addressSaved}
                className='bg-emerald-500 w-full py-2.5 rounded-lg
                shadow-sm text-white font-semibold hover:bg-emerald-600 transition-colors'>
                    ดำเนินการชำระเงิน
                </button>

            </div>
        </div>
    </div>
  )
}

export default SummaryCard
