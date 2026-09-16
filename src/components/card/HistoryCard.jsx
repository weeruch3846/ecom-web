import React, { useState, useEffect } from "react";
import { getOrders } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
import { dateFormat } from "../../utils/dateformat";
import { numberFormat } from "../../utils/number";

const HistoryCard = () => {
    const token = useEcomStore((state) => state.token);
    const [orders, setOrders] = useState([])

    useEffect(() => {
    // code
    hdlGetOrders(token);
  }, []);


  const hdlGetOrders = (token) => {
    getOrders(token)
      .then((res) => {
        // console.log(res);
        setOrders(res.data.orders);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Not Process":
        return "bg-slate-100 text-slate-600";
      case "Processing":
        return "bg-blue-50 text-blue-600";
      case "Completed":
        return "bg-emerald-50 text-emerald-600";
      case "Cancelled":
        return "bg-rose-50 text-rose-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "Not Process":
        return "bg-slate-400";
      case "Processing":
        return "bg-blue-500";
      case "Completed":
        return "bg-emerald-500";
      case "Cancelled":
        return "bg-rose-500";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-5">
        <div>
            <h1 className='text-xl font-semibold text-slate-800'>ประวัติการสั่งซื้อ</h1>
            <p className='text-sm text-slate-400 mt-0.5'>ทั้งหมด {orders?.length ?? 0} รายการ</p>
        </div>

        {/* คลุม */}
        <div className="space-y-4">

            {
                orders?.length === 0 &&
                <div className='bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center text-slate-400 text-sm'>
                    ยังไม่มีประวัติการสั่งซื้อ
                </div>
            }

            {/* Card Loop Order*/}
            {orders?.map((item,index)=>{
                // console.log(item)
                return(
                <div
                key={index}
                className='bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden'>
                {/* Header */}
                <div className='flex justify-between items-center px-5 py-4 border-b border-slate-100'>
                    <div>
                        <p className='text-xs text-slate-400'>วันที่สั่งซื้อ</p>
                        <p className='font-medium text-slate-700'>{dateFormat(item.updatedAt)}</p>
                    </div>

                    <span
                    className={`${getStatusColor(item.orderStatus)} inline-flex items-center gap-1.5
                    px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(item.orderStatus)}`} />
                        {item.orderStatus}
                    </span>
                </div>

                {/* table Loop Product*/}
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left'>
                    <thead>
                    <tr className='bg-slate-50 text-slate-500 uppercase text-xs tracking-wide'>
                        <th className='px-5 py-2.5 font-medium'>สินค้า</th>
                        <th className='px-5 py-2.5 font-medium'>ราคา</th>
                        <th className='px-5 py-2.5 font-medium'>จำนวน</th>
                        <th className='px-5 py-2.5 font-medium text-right'>รวม</th>
                    </tr>
                    </thead>

                    <tbody className='divide-y divide-slate-100'>

                    {
                        item.products?.map((product,index)=>{
                            return(
                            <tr key={index}>
                                <td className='px-5 py-2.5 text-slate-700'>{product.product.title}</td>
                                <td className='px-5 py-2.5 text-slate-500'>{numberFormat(product.product.price)}</td>
                                <td className='px-5 py-2.5 text-slate-500'>{product.count}</td>
                                <td className='px-5 py-2.5 text-slate-700 font-medium text-right'>
                                    {numberFormat(
                                    product.count * product.product.price
                                    )}{" "}
                                </td>
                            </tr>
                            )
                        })
                    }

                    </tbody>

                    </table>
                </div>

                {/* Total */}
                <div className='flex justify-end items-center gap-2 px-5 py-3.5 bg-slate-50/60 border-t border-slate-100'>
                    <p className='text-sm text-slate-500'>ราคาสุทธิ</p>
                    <p className='text-indigo-600 font-semibold text-lg'>{numberFormat(item.cartTotal)}</p>
                </div>

                </div>

                );
            })}


        </div>


    </div>
  )
}

export default HistoryCard
