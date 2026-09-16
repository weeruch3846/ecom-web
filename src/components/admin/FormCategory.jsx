import React,{useState,useEffect} from 'react'
import { createCategory,listCategory,removeCategory } from '../../api/Category'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'



const FormCategory = () => {
    // Javascript
    const token = useEcomStore((state) => state.token)
    const [name,setName] = useState('')
    // const [categories,setCatedories] = useState([])
    const categories = useEcomStore((state)=>state.categories)
    const getCategory = useEcomStore((state)=>state.getCategory)

    useEffect(()=>{
        getCategory(token)
    },[])
    
    const handleSubmit = async(e)=>{
        // code 
        e.preventDefault()
        if(!name){
            return toast.warning('Please fill date')
        }
        try{
            const res = await createCategory(token,{name})
            console.log(res.data.name)
            toast.success(`Add Category ${res.data.name} success!!!`)
            setName('')
            getCategory(token)
        }catch(err){
            console.log(err)
        }
    }
    const handleRemove = async(id)=>{
        //code
        console.log(id)
        try{
            const res = await removeCategory(token,id)
            console.log(res)
            toast.success(`Deleted ${res.data.name} success`)
            getCategory(token)
        }catch(err){
            console.log(err)
        }
    }

  return (
    <div className='container mx-auto p-6'>
        <div className='bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-xl'>
            <h1 className='text-lg font-semibold text-slate-800'>จัดการหมวดหมู่สินค้า</h1>
            <p className='text-sm text-slate-400 mt-0.5 mb-5'>เพิ่มหรือลบหมวดหมู่ของสินค้า</p>

            <form className='flex gap-3' onSubmit={handleSubmit}>
                <input
                    onChange={(e)=>setName(e.target.value)}
                    value={name}
                    className='flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                    placeholder:text-slate-400'
                    type='text'
                    placeholder='ชื่อหมวดหมู่ เช่น เสื้อผ้า, รองเท้า'
                />
                <button
                    className='bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold
                    px-4 py-2 rounded-lg shadow-sm transition-colors whitespace-nowrap'
                >
                    เพิ่มหมวดหมู่
                </button>
            </form>

            <hr className='my-5 border-slate-100' />

            <ul className='flex flex-col gap-2'>
                {
                    categories.map((item,index)=>
                        <li
                        className='flex items-center justify-between px-4 py-2.5 rounded-lg
                        bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors'
                        key={index}>
                            <span className='text-sm text-slate-700 font-medium'>
                            {item.name}
                            </span>

                            <button
                            className='text-rose-500 hover:text-white hover:bg-rose-500
                            text-xs font-semibold px-2.5 py-1 rounded-md border border-rose-200
                            hover:border-rose-500 transition-colors'
                            onClick={()=>handleRemove(item.id)}
                            >Delete</button>
                        </li>
                    )
                }

                {
                    categories.length === 0 &&
                    <li className='text-center text-sm text-slate-400 py-6'>
                        ยังไม่มีหมวดหมู่สินค้า
                    </li>
                }
            </ul>

        </div>
    </div>
  )
}

export default FormCategory
