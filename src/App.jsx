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
import VesselManangement from '@components/pages/vessels/vesselManagement.jsx';
import AddVessel from '@components/pages/vessels/addVessel/addVessel.jsx';
import EditVessel from '@components/pages/vessels/editVessel/editVessel.jsx';
import PortManangement from '@components/pages/ports/portManagement.jsx';
import AddPort from '@components/pages/ports/addPort/addPort.jsx';
import EditPort from '@components/pages/ports/editPort/editPort.jsx';
import UserManangement from '@components/pages/users/userManagement.jsx';
import AddUser from '@components/pages/users/addUser/addUser.jsx';
import EditUser from '@components/pages/users/edit/editUser.jsx';
import NotFound from '@components/pages/notFound/notFound.jsx';
import EditSchedule from './components/pages/schedules/editSchedule/editSchedule.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/layouts/ProtectedRoute.jsx';
import UnProtectedRoute from './components/layouts/UnProtectedRoute.jsx';
import RegisteredUsers from '@components/pages/users/registeredUsers.jsx';
import AddRegisteredUser from '@components/pages/users/addUser/AddRegisteredUser.jsx';
import EditRegisteredUser from '@components/pages/users/edit/EditRegisteredUser.jsx';

export default function App() {
	const user = JSON.parse(localStorage.getItem('user'));
	const role = user?.role;
	const isDataManager = role === 'data_management';

	return (
		<AuthProvider>
			<Router>
				<div>
					<Routes>
						{/* Routes without the Layout (no sidebar) */}
						<Route element={<UnProtectedRoute />}>
							<Route path="/login" element={<Login />} />
							<Route path="/" element={<Homepage />} />
							<Route path="/forgot-password" element={<ForgotPassowrd />} />
							<Route path="/resset-password" element={<RessetPassword />} />
						</Route>

						{/* Routes with the Layout (with sidebar) */}
						<Route element={<ProtectedRoute />}>
							<Route element={<Layout />}>
								{/* Data Manager only routes */}
								{isDataManager ? (
									<>
										<Route path="/registered-users" element={<RegisteredUsers />} />
										<Route path="/registered-users/add" element={<AddRegisteredUser />} />
										<Route path="/registered-users/edit/:id" element={<EditRegisteredUser />} />
									</>
								) : (
									<>
										<Route path="/schedule-list" element={<ScheduleList />} />
										<Route path="/schedule-list/create-schedule" element={<CreateSchedule />} />
										<Route path="/schedule-list/bulk-edit" element={<BulkEdit />} />
										<Route path="/schedule-list/edit-schedule/:uuid" element={<EditSchedule />} />
										<Route path="/vessel-management" element={<VesselManangement />} />
										<Route path="/vessel-management/add-vessel" element={<AddVessel />} />
										<Route path="/vessel-management/edit-vessel/:uuid" element={<EditVessel />} />
										<Route path="/port-management" element={<PortManangement />} />
										<Route path="/port-management/add-port" element={<AddPort />} />
										<Route path="/port-management/edit-port/:uuid" element={<EditPort />} />
										<Route path="/user-management" element={<UserManangement />} />
										<Route path="/user-management/invite-user" element={<AddUser />} />
										<Route path="/user-management/edit-user/:id" element={<EditUser />} />
									</>
								)}
							</Route>
						</Route>

						{/* Not Found page */}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}