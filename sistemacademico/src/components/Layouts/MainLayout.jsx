import Header from "../Header"

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-8 bg-gray-100">
                {children}
            </main>
        </div>
    )
}

export default MainLayout