import { useState } from "react"
import ItemCard from "../Components/ItemCards"
import data from '../MockDataAPI/products.json'
import SectionTitle from "../Components/Title"

export default function ProductListing(){
     const [showAll, setShowAll] = useState(false);
     const visibleProducts = showAll ? data : data.slice(0, 6);
    return(
        <>
        <SectionTitle title='Our Products'/>
        <div className="Container relative"> 
            <div className="CardItemCntainer grid grid-cols-3 gap-10 mx-10">
                { visibleProducts.map((product, index) => {
                    //displaying all the card
                    return(
                        <ItemCard key={index} data={product}/>
                )
                })}
            </div>
            

            
        {/* Blur Overlay when not showing all */}
        {!showAll && data.length > 6 && (
            <div className="absolute bottom-[-50px] left-0 right-0 h-[100%]
                            bg-gradient-to-t from-white via-white/60 to-transparent 
                            flex justify-center items-end pb-6">
            <button
                onClick={() => setShowAll(true)}
                className="px-5 py-2 bg-[#334A4F] text-white rounded-xl shadow-md backdrop-blur-sm hover:bg-[#0096C7] transition"
            >
                Show More
            </button>
            </div>
    
      )}


            {/* Show Less button */}
      {showAll && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(false)}
            className="px-5 py-2 bg-[#334A4F] text-white rounded-xl hover:bg-[#0096C7] transition"
          >
            Show Less
          </button>
        </div>
      )}
      
      
        </div>        
        </>
        
    )
}