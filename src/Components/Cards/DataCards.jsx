

export default function DataCards({userItem}) {
    return(
        <>
            <div className="card h-auto flex flex-col gap-1 justify-center items-start px-10 py-2 text-lg font-urbanist border-2 rounded-xl">
                <div className="Champ ">
                    Nom : <p className="text-white inline">{userItem.name} </p>
                </div>

                <div className="Champ">
                    Prenom : <p className="text-white inline"> {userItem.lastname} </p>
                </div>

                <div className="Champ">
                    email: <p className="text-white inline"> {userItem.email} </p>
                </div>

                <div className="Champ">
                    role: <p className="text-white inline"> {userItem.role} </p>
                </div>
            </div>
        </>
    )
}
  