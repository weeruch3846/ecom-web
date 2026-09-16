import React, { useEffect, useState } from "react";
import { getOrdersAdmin, changeOrderStatus } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateformat";

const TableOrders = () => {
   const token = useEcomStore((state) => state.token);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // code body
    handleGetOrder(token);
  }, []);

  const handleGetOrder = (token) => {
    getOrdersAdmin(token)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeOrderStatus = (token, orderId, orderStatus) => {
    // code
    console.log(orderId, orderStatus);
    changeOrderStatus(token, orderId, orderStatus)
      .then((res) => {
        console.log(res);
        toast.success("Update Status Success!!!");
        handleGetOrder(token);
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
    <div className='container mx-auto p-6'>
      <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='px-6 py-5 border-b border-slate-100'>
          <h1 className='text-lg font-semibold text-slate-800'>รายการคำสั่งซื้อ</h1>
          <p className='text-sm text-slate-400 mt-0.5'>ทั้งหมด {orders?.length ?? 0} รายการ</p>
        </div>

        <div className='overflow-x-auto'>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                <th className='px-6 py-3 font-medium'>ลำดับ</th>
                <th className='px-6 py-3 font-medium'>ผู้ใช้งาน</th>
                <th className='px-6 py-3 font-medium'>วันที่</th>
                <th className='px-6 py-3 font-medium'>สินค้า</th>
                <th className='px-6 py-3 font-medium'>รวม</th>
                <th className='px-6 py-3 font-medium'>สถานะ</th>
                <th className='px-6 py-3 font-medium'>จัดการ</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-slate-100'>

              {
                orders?.map((item,index)=>{
                  console.log(item);
                  return(
                    <tr key={index} className="hover:bg-slate-50/60 transition-colors align-top">
                      <td className="px-6 py-4 text-slate-400">{index+1}</td>
                      <td className="px-6 py-4">
                        <p className='text-slate-700 font-medium'>{item.orderedBy.email}</p>
                        <p className='text-slate-400 text-xs mt-0.5'>{item.orderedBy.address}</p>
                      </td>

                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {dateFormat(item.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <ul className='flex flex-col gap-1'>
                          {item.products?.map((product,index)=>
                                <li key={index} className='text-slate-700'>
                                  {product.product.title}{" "}
                                  <span className="text-xs text-slate-400">
                                    {product.count} x{" "}
                                    {numberFormat(product.product.price)}
                                  </span>
                                </li>
                              )
                          }
                        </ul>
                      </td>

                      <td className="px-6 py-4 text-slate-700 font-medium whitespace-nowrap">{numberFormat(item.cartTotal)}</td>

                      <td className="px-6 py-4">
                        <span
                        className={`${getStatusColor(item.orderStatus)} inline-flex items-center gap-1.5
                        px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(item.orderStatus)}`} />
                          {item.orderStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <select
                        value={item.orderStatus}
                        onChange={(e) =>
                        handleChangeOrderStatus(token, item.id, e.target.value)
                      }
                      className='border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm text-slate-700
                      bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                      cursor-pointer'
                      >
                        <option>Not Process</option>
                        <option>Processing</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                      </td>
                    </tr>
                  );
                })}

              {
                orders?.length === 0 &&
                <tr>
                    <td colSpan={7} className='px-6 py-10 text-center text-slate-400 text-sm'>
                        ยังไม่มีคำสั่งซื้อ
                    </td>
                </tr>
              }

            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TableOrders
