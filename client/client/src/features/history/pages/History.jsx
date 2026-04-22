import { useEffect } from "react"
import HistoryRows from "../components/HistoryRows.jsx"
import HistoryStats from "../components/HistoryStats.jsx"

const History = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <div className='w-full flex flex-col gap-8'>
      <HistoryStats />
      <HistoryRows />
    </div>
  )
}

export default History