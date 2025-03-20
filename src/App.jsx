import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from '@components/pages/home/homepage.jsx';
import Login from "@components/pages/login/login.jsx";
import CreateSchedule from '@components/pages/schedules/createSchedule/createSchedule.jsx';
import ScheduleList from '@components/pages/schedules/scheduleList/scheduleList';

export default function App() {
    return (
        <Router>
			<div>
				<Routes>
					<Route path='/' element={<Homepage />} />
					<Route path ="/login" element={<Login />} />
                    <Route path ="/create-schedule" element={<CreateSchedule />} />
					<Route path ="/schedule-list" element={<ScheduleList />} />
				</Routes>
			</div>
	    </Router>
    )
}