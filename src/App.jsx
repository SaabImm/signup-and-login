import './App.css'
import HomePage from './Pages/HomePage'
import Navbar from './Components/Navbar'
import ProducListing from './Pages/ProductListing'
import CategoriesCarousel from './Components/Category'

export default function App() {
  

  return (
    <>
    
    <section > <Navbar />  </section>
    <section id='home'> <HomePage />  </section>
    <CategoriesCarousel/>
    {/*<section id='shop'> <ProducListing/>  </section>*/}
    
    
    </>
  )
}

