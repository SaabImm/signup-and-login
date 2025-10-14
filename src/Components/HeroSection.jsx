import heroImage from '../assets/laptopHero2.jpg'



export default function HeroSection(){

    return(
        <>
            <div className="h-full overflow-hidden mx-3 font-[Orbitron] ">
                <img src={heroImage} alt="Hero Image" className='w-full h-full object-cover rounded-3xl' />
                <div className="heroTextContainer absolute top-[120px] left-[100px] text-[#F5F5F5] w-1/3 ">
                    <p className='text-6xl '>
                        shopping and department store.
                    </p>

                    <p>
                        Shopping is a bit of a relaxing hobby for me, which is sometimes troubling for the bank balance.
                    </p>
                </div>
                <div className="buttonsContainer absolute bottom-5 left-[100px] flex gap-10">
                    <button className=' px-6 py-4  bg-[#FACC15] text-center rounded-3xl  text-lg  text-[#F5F5F5]'>
                        Shop Now
                    </button>

                    <button className='px-6 py-4  bg-[#334A4F] text-center rounded-3xl text-lg  text-[#F5F5F5]'>
                        Learn More
                    </button>
                </div>
                
            </div>

            
            
        </> 
    )
}