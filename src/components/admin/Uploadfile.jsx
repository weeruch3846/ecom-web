import React, { useState } from 'react'
import { toast } from 'react-toastify'
import ResizerModule from 'react-image-file-resizer'
import { removeFiles, uploadFiles } from '../../api/product'
import useEcomStore from '../../store/ecom-store'
import { LoaderCircle,ImagePlus  } from 'lucide-react';

const Resizer = ResizerModule.default || ResizerModule

const Uploadfile = ({form, setForm}) => {
    // Javascript
    const token = useEcomStore((state) => state.token)
    const [isLoading, setIsLoding] = useState(false)
    const haedleOnChange = (e)=>{
        // code
        setIsLoding(true)
        const files = e.target.files
        if(files){
            setIsLoding(true)
            let allFiles = form.images //[] empty
            for(let i = 0;i<files.length;i++){
                
                // console.log(files[i])

                // Validate
                const file = files[i]
                if(!file.type.startsWith('image/')){
                    toast.error(`File ${file.name} บ่แม่นรูป`)
                    continue 
                }
                // Image Resize
                Resizer.imageFileResizer(
                    files[i],
                    720,
                    720,
                    "JPEG",
                    100,
                    0,
                    (data) => {
                         // endpoint Backend
                         uploadFiles(token, data)
                         .then((res) => {
                                console.log(res)
                                allFiles.push(res.data)
                                setForm({
                                    ...form,
                                    images: allFiles
                                })
                                setIsLoding(false)
                                toast.success('Upload image Sucess!!!')
                            })
                            .catch((err) => {
                                console.log(err)
                                setIsLoading(false)
                            })
                    },
                    "base64"
                )
            }
        }
    }
    console.log(form)

    const handleDelete = (public_id)=>{
        const images = form.images
        removeFiles(token,public_id)
        .then((res)=> {
            console.log(res)
            const filterImages = images.filter((item)=>{
                console.log(item)
                return item.public_id !== public_id
            })

            console.log('filterImages',filterImages)
            setForm({
                ...form,
                images: filterImages
            })
            toast.error(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }
  return (
    <div className='my-4 '>
        <div className='flex mx-4 gap-4 my-4'>
            {
                isLoading && <LoaderCircle className='w-16 h-16 animate-spin'/>
            }
                
                {/* Image */}
        {
            form.images.map((item,index) =>
                <div className='relative' key={index}>
                    <img 
                    className='w-24 h-24 hover:scale-105'
                    src={item.url}/>
                    <span 
                    onClick={()=>handleDelete(item.public_id)} 
                    className='absolute top-0 right-0 bg-red-500 p-1 rounded-md'>X</span>
                </div>
            )
        }
        </div>

        <label
    htmlFor="image-upload"
    className="flex items-center justify-center 
               w-12 h-12 bg-blue-500 text-white 
               rounded-lg cursor-pointer hover:bg-blue-600"
>
    <ImagePlus size={24} />
</label>

<input
    id="image-upload"
    onChange={haedleOnChange}
    type="file"
    name="imges"
    multiple
    hidden
/>
    </div>
  )
}

export default Uploadfile
