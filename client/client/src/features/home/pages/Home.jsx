import React, { useEffect } from 'react'
import HomeSection from '../components/HomeSection.jsx'
import FeatureSection from '../components/FeatureSection.jsx'
import CTAsection from '../components/CTAsection.jsx'

const Home = () => {
  useEffect(() => {
    window.scrollTo({top:0,behavior:"instant"})
  }, [])
  
  return (
    <div className=' w-full flex flex-col gap-y-6'>
        <HomeSection/>
        <FeatureSection/>
        <CTAsection/>
    </div>
  )
}

export default Home