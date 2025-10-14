import { useState, useEffect} from "react"


export default function ProducListing({category}){
    const [imageGallery, setImageGallery] =useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading]= useState(null)
    const Api_Access_Key= 'ievWS2sexL6ASDtsJC50ui2sHqTkaC0JwU32Eg70kQ8'
    const url=`https://api.unsplash.com/search/photos?query=${category}&per_page=10&client_id=${Api_Access_Key}`

    const fetchImages = async (URL) => {//fetching images from API 
        setIsLoading(true);
        try {
                const res = await fetch(URL);
                if (!res.ok){ 
                    throw new Error(`Oops couldn't find pics ${res.status}`); 
                }
                const data = await res.json();
                setImageGallery(data.results || [])
                
                

            } catch (error) {
                console.error("error fetching data",error);
                setError(error);
            } finally {
                setIsLoading(false) 
            }
    } 

    // Re-fetch images whenever the category changes
  useEffect(() => {
    if (category) fetchImages(url);
  }, [category]);



    return(
        <>
            
            <section>
                {isLoading && <p className="text-gray-500">Loading images...</p>} 
                {error && <p className="text-red-500">Error: {error}</p>}
                <div className="grid grid-cols-4 gap-x-8 gap-y-4 justify-items-center content-center">
                {imageGallery.map((item) => 
                { //displaying fetched data in a grid form
                    return (
                        <div key={item.id} className="">
                        <img className="w-24 h-24" src={item.urls.thumb} alt={item.slug} />
                        <p> {item.description || item.alt_description || "No description"}</p>
                        </div>
                    )
                } )}
                    
                </div>
            </section>
        </>
        
    )
}