import React,{useEffect,useState} from 'react'
import useEcomStore from '../../store/ecom-store'
import { createProduct, deleteProduct } from "../../api/product";
import { toast } from "react-toastify";
import Uploadfile from './Uploadfile';
import { Link } from "react-router-dom";
import { PencilSparkles,Eraser,FilePlusCorner  } from 'lucide-react';
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateformat";

const initialState = {
    
    title: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: '',
    images:[]

}



const FormProduct = () => {
    const token = useEcomStore((state)=> state.token)
    const getCategory = useEcomStore((state)=>state.getCategory)
    const categories = useEcomStore((state)=>state.categories)
    const getProduct = useEcomStore((state)=>state.getProduct)
    const products = useEcomStore((state)=>state.products)
    // console.log(products)
    
    
    const [form, setForm] = useState({
    
    title: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: '',
    images:[]

})
    

    useEffect(()=>{
        // code
        getCategory()
        getProduct(100)
    },[])


    const handleOnChange = (e)=>{
        console.log(e.target.name, e.target.value)
        setForm({
          ...form,
          [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e)=>{
      e.preventDefault()
      try{
          const res = await createProduct(token,form)
          console.log(res)
          setForm(initialState)
          getProduct()
          toast.success(`เพิ่มข้อมูล ${res.data.title} สำเร็จ`)
      }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "เพิ่มสินค้าไม่สำเร็จ")
      }
    }

    const handleDelete = async (id) => {
    if (window.confirm("จะลบจริงๆ หรอ")) {
      try {
        // code
        const res = await deleteProduct(token, id);
        console.log(res);
        toast.success("Deleted สินค้าเรียบร้อยแล้ว");
        getProduct();
      } catch (err) {
        console.log(err);
      }
    }
  };



  return (
    <div className='container mx-auto p-6'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>

        {/* Form card */}
        <div className='bg-white rounded-2xl border border-slate-200 shadow-sm p-6'>
            <h1 className='text-lg font-semibold text-slate-800'>เพิ่มข้อมูลสินค้า</h1>
            <p className='text-sm text-slate-400 mt-0.5 mb-5'>กรอกรายละเอียดสินค้าที่ต้องการเพิ่มเข้าระบบ</p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-1.5 md:col-span-2'>
                    <label className='text-xs font-medium text-slate-500'>ชื่อสินค้า</label>
                    <input
                    className='border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                    placeholder:text-slate-400'
                    value={form.title}
                    onChange={handleOnChange}
                    placeholder='เช่น คอมพิวเตอร์'
                    name='title'
                    />
                </div>

                <div className='flex flex-col gap-1.5 md:col-span-2'>
                    <label className='text-xs font-medium text-slate-500'>รายละเอียด</label>
                    <input
                    className='border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                    placeholder:text-slate-400'
                    value={form.description}
                    onChange={handleOnChange}
                    placeholder='รายละเอียดสินค้าโดยย่อ'
                    name='description'
                    />
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label className='text-xs font-medium text-slate-500'>ราคา</label>
                    <input
                    type='number'
                    className='border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400'
                    value={form.price}
                    onChange={handleOnChange}
                    placeholder='0.00'
                    name='price'
                    />
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label className='text-xs font-medium text-slate-500'>จำนวน</label>
                    <input
                    type='number'
                    className='border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400'
                    value={form.quantity}
                    onChange={handleOnChange}
                    placeholder='0'
                    name='quantity'
                    />
                </div>

                <div className='flex flex-col gap-1.5 md:col-span-2'>
                    <label className='text-xs font-medium text-slate-500'>หมวดหมู่</label>
                    <select
                        className='border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                        bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                        cursor-pointer'
                        name='categoryId'
                        onChange={handleOnChange}
                        required
                        value={form.categoryId}
                    >
                      <option value="" disabled>Please Select</option>
                      {
                        categories.map((item,index)=>
                            <option key={index} value={item.id}>{item.name}</option>
                        )
                      }
                    </select>
                </div>
            </div>

            <hr className='my-5 border-slate-100' />

            {/* Upload file  */}
            <Uploadfile  form={form} setForm={setForm}/>

            <button className='mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold
            px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-colors w-fit'>
              <FilePlusCorner size={18} />เพิ่มสินค้า
            </button>
        </div>

        {/* Product list card */}
        <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
            <div className='px-6 py-5 border-b border-slate-100'>
                <h2 className='text-lg font-semibold text-slate-800'>รายการสินค้า</h2>
                <p className='text-sm text-slate-400 mt-0.5'>ทั้งหมด {products.length} รายการ</p>
            </div>

            <div className='overflow-x-auto'>
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className='bg-slate-50 text-slate-500 uppercase text-xs tracking-wide'>
                      <th className='px-6 py-3 font-medium' scope="col">No.</th>
                      <th className='px-6 py-3 font-medium' scope="col">รูปภาพ</th>
                      <th className='px-6 py-3 font-medium' scope="col">ชื่อสินค้า</th>
                      <th className='px-6 py-3 font-medium' scope="col">รายละเอียด</th>
                      <th className='px-6 py-3 font-medium' scope="col">ราคา</th>
                      <th className='px-6 py-3 font-medium' scope="col">จำนวน</th>
                      <th className='px-6 py-3 font-medium' scope="col">ขายได้</th>
                      <th className='px-6 py-3 font-medium' scope="col">วันที่อัพเดต</th>
                      <th className='px-6 py-3 font-medium text-right' scope="col">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-100'>

                    {
                        products.map((item,index)=>{
                          // console.log(item)
                          return (
                             <tr key={index} className='hover:bg-slate-50/60 transition-colors'>
                              <th className='px-6 py-3 text-slate-400 font-normal' scope="row">{index+1}</th>
                              <td className='px-6 py-3'>
                                  {
                                    item.images.length > 0
                                    ? <img
                                    className='w-16 h-16 object-cover rounded-lg shadow-sm border border-slate-100'
                                    src={item.images[0].url} />
                                    : <div
                                    className='w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center
                                    text-[10px] text-slate-400 border border-slate-200'
                                    >No Image</div>
                                  }
                              </td>
                              <td className='px-6 py-3 text-slate-700 font-medium'>{item.title}</td>
                              <td className='px-6 py-3 text-slate-500 max-w-xs truncate'>{item.description}</td>
                              <td className='px-6 py-3 text-slate-700'>{numberFormat(item.price)}</td>
                              <td className='px-6 py-3 text-slate-700'>{item.quantity}</td>
                              <td className='px-6 py-3 text-slate-700'>{item.sold}</td>
                              <td className='px-6 py-3 text-slate-400'>{dateFormat(item.updatedAt)}</td>
                              <td className='px-6 py-3'>
                                <div className='flex gap-2 justify-end'>
                                  <Link
                                  to={'/admin/product/'+item.id}
                                  className='p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500
                                  hover:text-white transition-colors'
                                  >
                                      <PencilSparkles size={16} />
                                  </Link>
                                  <button
                                  type='button'
                                  className='p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500
                                  hover:text-white transition-colors'
                                  onClick={()=>handleDelete(item.id)}
                                  ><Eraser size={16} /></button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                    }

                    {
                        products.length === 0 &&
                        <tr>
                            <td colSpan={9} className='px-6 py-10 text-center text-slate-400 text-sm'>
                                ยังไม่มีสินค้าในระบบ
                            </td>
                        </tr>
                    }

                  </tbody>
                </table>
            </div>
        </div>
      </form>
    </div>
  )
}

export default FormProduct
