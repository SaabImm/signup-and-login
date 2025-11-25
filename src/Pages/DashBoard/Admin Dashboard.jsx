import Title from '../../Components/Title'
import { useEffect, useContext } from "react";
import { UserDataContext } from '../../Context/userDataCont'
import { UserContext } from '../../Context/dataCont';

export default function AdminDashboard() {
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
            }
            catch (error) {
                console.error("Une erreur est survenue lors de la récupération des données", error);
            }
        }
        getElements();
    }, [authData.token])

    return (
        <div className="ml-[200px] p-8 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 font-urbanist">
            <Title title="Bienvenue dans le tableau de bord Admin"/>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Cartes récapitulatives */}
                <div className="bg-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    <h2 className="text-xl font-semibold mb-2">Utilisateurs</h2>
                    <p className="text-gray-300">Total des utilisateurs : {data.users.length}</p>
                </div>
                <div className="bg-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    <h2 className="text-xl font-semibold mb-2">Produits</h2>
                    <p className="text-gray-300">Nombre total de produits : 0</p>
                </div>
                <div className="bg-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    <h2 className="text-xl font-semibold mb-2">Fichiers</h2>
                    <p className="text-gray-300">Nombre total de fichiers : 0</p>
                </div>
            </div>

            <div className="mt-10 text-gray-400">
                {/* Ajouter d'autres informations du tableau de bord ici */}
            </div>
        </div>
    );
}
