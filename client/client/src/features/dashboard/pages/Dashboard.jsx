import { useEffect } from "react"
import DashboardContent from "../components/DashboardContent.jsx"
import WelcomeAndStats from "../components/WelcomeAndStats.jsx"

const Dashboard = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])
  return (
    <div className="w-full flex flex-col gap-8">
      <WelcomeAndStats />
      <DashboardContent />
    </div>
  )
}

export default Dashboard