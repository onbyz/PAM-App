import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from '@components/pages/home/homepage.jsx';
import Login from "@components/pages/login/login.jsx";
import ForgotPassowrd from './components/pages/login/forgotPassowrd.jsx';
import RessetPassword from './components/pages/login/ressetPassword.jsx';
import CreateSchedule from '@components/pages/schedules/createSchedule/createSchedule.jsx';
import ScheduleList from '@components/pages/schedules/scheduleList/scheduleList';
import Layout from '@components/layouts/Layout.jsx';
import BulkScheduleUpload from './components/pages/bulkEdit/bulkEdit.jsx';

export default function App() {
    return (
        <Router>
			<div>
				<Routes>
					{/* Routes without the Layout (no sidebar) */}
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<Homepage />} />
					<Route path="/forgot-password" element={<ForgotPassowrd />} />
					<Route path="/resset-password" element={<RessetPassword />} />

					{/* Routes with the Layout (with sidebar) */}
					<Route element={<Layout />}>
						<Route path="/create-schedule" element={<CreateSchedule />} />
						<Route path="/bulk-edit" element={<BulkScheduleUpload />} />
						<Route path="/schedule-list" element={<ScheduleList />} />
					</Route>
				</Routes>
			</div>
	    </Router>
    )
}