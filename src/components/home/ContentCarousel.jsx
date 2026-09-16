import React, { useState, useEffect } from 'react'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Autoplay, Navigation } from 'swiper/modules';

const ContentCarousel = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        hdlGetImage()
    }, [])

    const hdlGetImage = async () => {

        const computerImages = [
            {
                download_url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1616587226157-48e49175ee20?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80'
            },
            {
                download_url: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=1200&q=80'
            }
        ]

        setData(computerImages)
    }

    return (
        <div>

            <Swiper
                pagination={true}
                modules={[Pagination, Autoplay]}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                className="mySwiper h-80 rounded-md mb-4"
            >

                {
                    data?.map((item, i) =>
                        <SwiperSlide key={i} className="h-80">
                            <img
                                src={item.download_url}
                                className="w-full h-full object-cover rounded-md"
                            />
                        </SwiperSlide>
                    )
                }

            </Swiper>

            <Swiper
                slidesPerView={5}
                spaceBetween={10}
                pagination={true}
                navigation={true}
                modules={[Pagination, Autoplay, Navigation]}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                className="mySwiper rounded-md object-cover"
            >

                {
                    data?.map((item, i) =>
                        <SwiperSlide key={i}>
                            <img
                                className='rounded-md w-full h-32 object-cover'
                                src={item.download_url}
                            />
                        </SwiperSlide>
                    )
                }

            </Swiper>


        </div>
    )
}

export default ContentCarousel