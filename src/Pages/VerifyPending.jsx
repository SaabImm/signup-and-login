import { useContext } from "react";
import Title from '../Components/Title'
import { UserContext } from "../Context/dataCont";


export default function VerifyPending(){
  const { authData } = useContext(UserContext);
  return (
    <div className='PendingContainer min-h-screen flex  items-center justify-center '>
      <div className=" flex items-center flex-col justify-center m-auto gap-5 p-20 w-1/2 text-lg font-[Montserrat] rounded-2xl shadow-2xl text-center">
        <div className='Spinner flex items-center justify-center gap-10'> 
          <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
          <Title title={'Verification pending... '}/>
        </div>
        <h2>Check your email </h2>
        <p>Please click the verification sent to
          <a
            className="underline hover:text-blue-500 mx-2"
            href={`https://mail.google.com/mail/u/0/?authuser=${encodeURIComponent(authData.user?.email)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {authData.user?.email}
          </a>to activate your account.</p>
      </div>
    </div>
  );
}