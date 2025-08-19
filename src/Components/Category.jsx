import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation} from "swiper/modules";
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft} from "react-icons/md";
import ProducListing from "../Pages/ProductListing"
import data from '../MockDataAPI/categoryData'
import "swiper/css/navigation";
import "swiper/css";

export default function CategoriesCarousel(){
    const [category, setCategory]= useState('')
    return(
        <>
        <section className="ImageGallery relative flex px-10 py-2  h-full justify-start bg-gradient-to-r from-[#2A9B93] from-10% via-[#57C785] via-30% to-[#EDDD53] to-70%  backdrop-blur-lg">
            <Swiper 
                modules={[Navigation]} 
                spaceBetween={20} 
                slidesPerView={5} 
                loop={false} 
                navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
                }}  
            >   
                {data.imageCategory.map((elm) => {
                    return(                         
                        <SwiperSlide key={elm.id}> 
                            <div>
                                <button onClick={() => {setCategory(elm.category)}} >  
                                    <div className="CategoryCard p-5 bg-white/30 backdrop-blur-lg rounded-xl text-center text-sm ">
                                    {elm.description}
                                    </div>  
                                </button>
                            </div>
                        </SwiperSlide>        
                    )
                })} 
            </Swiper>

                <button className="custom-prev z-10 absolute left-2 top-10 -translate-y-1/2  text-white p-3 rounded-full hover:bg-black/50 transition">
                    <MdKeyboardDoubleArrowLeft size={20}/>
                </button>
                <button className="custom-next z-10 absolute right-2  top-10 -translate-y-1/2  text-white p-3 rounded-full hover:bg-black/50 transition">
                    <MdKeyboardDoubleArrowRight size={20}/>
                </button>
            
        </section>
        <ProducListing category={category}/>
        </>
    )
}