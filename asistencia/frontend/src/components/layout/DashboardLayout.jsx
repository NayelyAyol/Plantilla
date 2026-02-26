import Header from "./Header"
import Sidebar from "./Sidebar"
import { Outlet } from "react-router-dom"

const DashboardLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">

            <Header />

            <div className="flex flex-1 items-stretch">

                <Sidebar />

                <main className="flex-1 p-8 bg-gray-100">
                    <Outlet />
                </main>

            </div>

        </div>
    )
}

export default DashboardLayout