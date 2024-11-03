import React from 'react'
import SideNavigation from '../components/navigation/SideNavigation'
import Dashboard from '../components/dashboard/Dashboard'
function Pdashboard() {
  return (
    <div style={{display:"flex"}}>
        <SideNavigation/>
         <Dashboard/>
    </div>
  )
}

export default Pdashboard