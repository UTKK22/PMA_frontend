import React from 'react'
import Analytics from '../components/analytics/Analytics'
import SideNavigation from'../components/navigation/SideNavigation'
function Panalytics() {
  return (
    <div style={{display:"flex"}}>
        <SideNavigation/>
        <Analytics/>
    </div>
  )
}
export default Panalytics