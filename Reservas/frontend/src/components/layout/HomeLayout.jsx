import Header from "../layout/Header"

const HomeLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-8 bg-gray-100">
                {children}
            </main>
        </div>
    )
}

export default HomeLayout