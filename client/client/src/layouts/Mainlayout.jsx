import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import { Outlet } from 'react-router-dom'

const Mainlayout = () => {
  return (
    <div>
        <Navbar/>
        <div className='px-6 py-8 pt-24 w-full md:px-8 mx-auto max-w-7xl'>
          <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default Mainlayout