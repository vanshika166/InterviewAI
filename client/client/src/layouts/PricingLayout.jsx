import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/layout/Footer.jsx'

const PricingLayout = () => {
  return (
    <>
    <div>
        <Outlet/>
    </div>
    <Footer/>
    </>
  )
}

export default PricingLayout