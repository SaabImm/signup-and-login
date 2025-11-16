import { useContext,useEffect } from "react";
import DataCards from "../../../Components/Cards/DataCards";
import { UserDataContext } from '../../../Context/userDataCont'
import { UserContext } from '../../../Context/dataCont';
import Title from '../../../Components/Title'

export default function GetUsers() {
        const API_URL = import.meta.env.VITE_API_URL;
        const {data, setData}  = useContext(UserDataContext);
        const {authData}  = useContext(UserContext);
        useEffect(() => {
             if (!authData?.token) return; 
            const getElements = async () => {
                try {
                    const response = await fetch( `${API_URL}/user`,{
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${authData.token}`
                            },
                        });
                    const results = await response.json()
                    setData(results)
                    console.log("Données récupérées et data auth:", results, authData)
                }
                catch (error) {
                    console.error("Une erreur est survenue lors de la récupération des données", error);
                }
            }
            getElements();
        }, [authData.token])
    return(
        <>
            <div className="UsersPage min-h-screen ml-[200px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">
                <Title title="Users Management"/>

            <div className="CardsContainer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.users.map((item) => (
                <DataCards key={item._id} userItem={item} />
                ))}
            </div>
            </div>
        </>
    )}