import React  from "react";
import Plogin from './pages/Plogin'
import Pregister from'./pages/Pregister/'
import PsideNavigation from './pages/PsideNavigation'
import Pdashboard from './pages/Pdashboard'
import Panalytics from './pages/Panalytics'
// import PtaskPage from './pages/PtaskPage'
import Psettings from './pages/Psettings'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import ShareTask from "./components/share/ShareTask";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={'/login'}/>}/>
      <Route path="/login" element={<Plogin/>}/>
      <Route path="/register" element={<Pregister/>}/>
      <Route path="/taskmanager" element={<PsideNavigation/>}/>
      <Route path="/dashboard" element={<Pdashboard/>}/>
      <Route path="/settings" element={<Psettings/>}/>
      <Route path="/analytics" element={<Panalytics/>}/>
      {/* <Route path="/task/:id" element={<PtaskPage/>}/> */}
      <Route path="/sharetask/:id" element={<ShareTask/>}/>
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
