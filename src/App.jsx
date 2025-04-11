import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from '@components/pages/home/homepage.jsx';
import Login from "@components/pages/login/login.jsx";
import ForgotPassowrd from './components/pages/login/forgotPassowrd.jsx';
import RessetPassword from './components/pages/login/ressetPassword.jsx';
import CreateSchedule from '@components/pages/schedules/createSchedule/createSchedule.jsx';
import ScheduleList from '@components/pages/schedules/scheduleList/scheduleList';
import Layout from '@components/layouts/Layout.jsx';
import BulkEdit from '@components/pages/schedules/bulkEdit/bulkEdit.jsx';
import VesselManangement from '@components/pages/vessels/vesselManagement.jsx'
import AddVessel from '@components/pages/vessels/addVessel/addVessel.jsx'
import PortManangement from '@components/pages/ports/portManagement.jsx'
import AddPort from '@components/pages/ports/addPort/addPort.jsx'
import UserManangement from '@components/pages/users/userManagement.jsx'
import AddUser from '@components/pages/users/addUser/addUser.jsx'

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
						<Route path="/schedule-list" element={<ScheduleList />} />
						<Route path="/schedule-list/create-schedule" element={<CreateSchedule />} />
						<Route path="/schedule-list/bulk-edit" element={<BulkEdit />} />
						<Route path="/vessel-management" element={<VesselManangement />} />
						<Route path="/vessel-management/add-vessel" element={<AddVessel />} />
						<Route path="/port-management" element={<PortManangement />} />
						<Route path="/port-management/add-port" element={<AddPort />} />
						<Route path="/user-management" element={<UserManangement />} />
						<Route path="/user-management/invite-user" element={<AddUser />} />
					</Route>
				</Routes>
			</div>
	    </Router>
    )
}