import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation} from "swiper/modules";

import "swiper/css/navigation";
import "swiper/css";
import ItemCard from "./ItemCards";
import IconsThing from "./iconThing";
import SectionTitle from "./Title";
import data from '../MockDataAPI/products.json'

export default function CategoriesCarousel(){
    const [category, setCategory]= useState('')
    const [visibleProducts, setVisibleProducts ]= useState([]) 
    
        const categoryArray = [...new Set(data.map(item => item.category))];

        const ShowCatElements = () => {
            const filtered = data.filter(item => item.category === category);
            setVisibleProducts(filtered);
            };

        useEffect(() => {
            if(category) ShowCatElements();
        }
        ,[category])

        const HandleClick = (cat)=> {
            setCategory(cat)
        }




    return(
        <>
        <SectionTitle title='Shop by Category'/>
        <div className="CategCaroussel relative flex py-2 h-full justify-start mx-20">
            
            <Swiper 
                modules={[Navigation]} 
                spaceBetween={5} 
                slidesPerView={8} 
                loop={false} 
 
            >   
                {categoryArray.map((cat, index) => {
                    return(          
                        <>
                        <SwiperSlide key={index} className="odd:mt-20 even:mb-20 "> 
                            <div className='flex flex-col items-center py-10 ' >
                                <button onClick={() => {HandleClick(cat) }} > 

                                    <div className="CategoryCard p-5 bg-[#68e2f823] rounded-t-2xl  rounded-b-[99px] ">

                                        <IconsThing ctg={cat} sz={45} clr="#334A4F"  />
                                      
                                    </div>  

                                </button>
                                <p>
                                    { cat.charAt(0).toUpperCase() + cat.slice(1) } 
                                </p>
                            </div>
                        </SwiperSlide> 
  
                        </>               
                    )
                })} 
            </Swiper>
            

            
        </div>
        <div className="transition">
            {category && 
            <SectionTitle title={`Check out our ${category}`}/>
            }
            
            <div className="ProductGrid flex flex-wrap gap-6 justify-center mt-10 transition">
                {visibleProducts.map((pr, index) => (
                <ItemCard data={pr} key={index} />
                ))}
            </div>
        </div> 

        </>
    )
}