import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/pages/home/homepage.jsx';
import Login from "../src/components/pages/login/login.jsx";
import CreateSchedule from './components/pages/createSchedule/createSchedule.jsx';
import EditSchedule from './components/pages/editSchedule/editSchedule.jsx';
import VesselList from './components/pages/vesselList/vesselList.jsx';


export default function App() {
    return (
        <Router>
			<div>
				<Routes>
					<Route path='/' element={<Homepage />} />
					<Route path ="/login" element={<Login />} />
                    <Route path ="/create-schedule" element={<CreateSchedule />} />
                    <Route path ="/edit-schedule" element={<EditSchedule />} />
					<Route path ="/vessel-list" element={<VesselList />} />
				</Routes>

			</div>
	    </Router>
    )
}