import React from 'react'
import { ListCheck } from 'lucide-react';
import useEcomStore from '../../store/ecom-store';
import {Link, useNavigate} from 'react-router-dom'
import { createUserCart } from '../../api/user';
import { toast } from "react-toastify";
import { numberFormat } from "../../utils/number";


const ListCart = () => {
    const cart = useEcomStore((state)=>state.carts);
    const user = useEcomStore((state)=> state.user);
    const token = useEcomStore((s)=>s.token)
    const getTotalPrice = useEcomStore((state)=>state.getTotalPrice)

    const navigate = useNavigate()

    const handleSaveCart = async () => {
        await createUserCart(token, { cart })
        .then((res) => {
            console.log(res);
            toast.success("บันทึกใส่ตะกร้าเรียบร้อยแล้วจ้า", {
            position: "top-center",
            });
            navigate("/checkout");
        })
        .catch((err) => {
            console.log("err", err);
            toast.warning(err.response.data.message);
        });
    };


    return (
    <div className='max-w-6xl mx-auto p-4'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-5'>
            <div className='p-2.5 bg-indigo-50 rounded-xl text-indigo-600'>
                <ListCheck size={24}/>
            </div>
            <div>
                <p className='text-xl font-semibold text-slate-800'>รายการสินค้าในตะกร้า</p>
                <p className='text-sm text-slate-400'>{cart.length} รายการ</p>
            </div>
        </div>

        {/* List */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 items-start'>
            {/* Left */}
            <div className='md:col-span-2 flex flex-col gap-3'>
            {/* Card */}

            {cart.length === 0 && (
                <div className='bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center text-slate-400 text-sm'>
                    ยังไม่มีสินค้าในตะกร้า
                </div>
            )}

            {cart.map((item,index)=> (
            <div key={index}
            className='bg-white border border-slate-200 rounded-2xl shadow-sm p-3 flex items-center justify-between'>
                {/* Left */}
                <div className='flex gap-3 items-center'>
                    {
                        item.images && item.images.length > 0
                        ? <img
                        className='w-16 h-16 object-cover rounded-lg border border-slate-100'
                        src={item.images[0].url} />
                        : <div className='w-16 h-16 bg-slate-100 border border-slate-200
                        rounded-lg flex items-center justify-center text-center text-[10px] text-slate-400'>
                           No Image
                        </div>
                    }

                    <div>
                        <p className='font-medium text-slate-800'>{item.title}</p>
                        <p className='text-sm text-slate-400 mt-0.5'>{numberFormat(item.price)} x {item.count}</p>
                    </div>
                </div>
                {/* Right */}
                <div className='font-semibold text-indigo-600 whitespace-nowrap'>
                    {numberFormat(item.price * item.count)}
                </div>
            </div>
            ))}
            </div>

            {/* Right */}
            <div className='bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4'>
                <p className='text-lg font-semibold text-slate-800'>สรุปยอดสั่งซื้อ</p>

                <div className='flex justify-between items-center pt-1 border-t border-slate-100'>
                    <span className='text-sm text-slate-500'>รวมสุทธิ</span>
                    <span className='text-xl font-semibold text-slate-800'>{numberFormat(getTotalPrice())}</span>
                </div>

                <div className='flex flex-col gap-2 pt-1'>

                    {
                        user
                        ?   <button
                            disabled={cart.length < 1}
                            onClick={handleSaveCart}
                            className='bg-indigo-600 w-full rounded-lg text-white py-2.5 font-semibold
                            shadow-sm hover:bg-indigo-700 transition-colors
                            disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed'
                            >สั่งซื้อ</button>

                        : <Link to={'/login'}>
                            <button className='bg-indigo-600 w-full rounded-lg text-white py-2.5 font-semibold
                            shadow-sm hover:bg-indigo-700 transition-colors'
                            >เข้าสู่ระบบเพื่อสั่งซื้อ</button>
                          </Link>
                    }

                    <Link to={'/shop'}>
                    <button className='w-full rounded-lg text-slate-600 py-2.5 font-semibold
                    border border-slate-200 hover:bg-slate-50 transition-colors'
                    >แก้ไขรายการ</button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ListCart
