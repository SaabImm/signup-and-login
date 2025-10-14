import HeadPhones from '../assets/ravi-palwe-ax23KYiUdJc-unsplash.jpg'
import Rating from "./Rating";
import { Link } from "react-router-dom";

export default function ItemCard({data}){
    return(
          <>
            <div className="ItemCard flex flex-col gap-4 m-auto w-[24rem] rounded-3xl p-4 shadow-md hover:shadow-lg">
              <div className="ImageContainer overflow-hidden rounded-2xl">
                <img
                  src={HeadPhones}
                  alt={data.description}
                  className="w-full h-full object-cover hover:scale-[1.1] transition-all duration-200"
                />
              </div>
                  <div className="DetailsContainer flex flex-col gap-5">
                      <div className="Title flex justify-between text-lg font-semibold truncate">
                      <p >
                        {data.name}
                      </p>

                      <p>
                          $ {data.price}
                      </p>
                      </div>

                      <p className="Details text-xs text-gray-400 w-[50%]">
                         {data.description}
                      </p>
                      <div className="Rating flex gap-2">
                      <Rating rating={data.rating}/>
                      </div>
                      <div className="buttonContainer flex justify-between items-center gap-10">
                          <button  className="AddToCart flex-1 border-2 font-medium p-2 text-sm rounded-2xl bg-[#FACC15] text-white hover:border-[#FACC15] hover:text-[#FACC15] hover:bg-white transition duration-200">
                              Add to Cart  
                              </button>
                          
                          <button className="ViewDetails flex-1 font-medium border-2 text-white bg-[#334A4F] border-[#334A4F]  p-2 text-sm rounded-2xl hover:bg-white hover:text-[#334A4F] transition duration-200">
                            <Link to={`/product/${data.id}`}>
                              View Details
                            </Link>
                          </button>
                          
                      </div>
                  </div>

            </div>   


        </>
    )
}