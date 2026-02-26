import { Routes, Route } from "react-router-dom"
import PrivateRoute from "./routes/PrivateRoutes"
import DashboardLayout from "./components/layout/DashboardLayout"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

//Auth
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"

//Home
import Home from "./pages/Home"

// clientes
import ClienteCreate from "./pages/Clientes/ClientesCreate" 
import ClienteEdit from "./pages/Clientes/ClientesEdit" 
import ClienteDetail from "./pages/Clientes/ClientesDetail" 
import ClienteList from "./pages/Clientes/ClientesList" 


// reservas
import ReservaCreate from "./pages/Reservas/ReservasCreate"
import ReservaEdit from "./pages/Reservas/ReservasEdit"
import ReservaList from "./pages/Reservas/ReservasList"
import ReservaDetail from "./pages/Reservas/ReservasDetail"


// vehiculos
import VehiculoCreate from "./pages/Vehiculos/VehiculosCreate"
import VehiculoEdit from "./pages/Vehiculos/VehiculosEdit"
import VehiculoList from "./pages/Vehiculos/VehiculosList"
import VehiculoDetail from "./pages/Vehiculos/VehiculosDetail"


function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* PÁGINA PRINCIPAL */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* RUTAS CLIENTES */}
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ClienteList />} />
          <Route path="crear" element={<ClienteCreate />} />
          <Route path="listar" element={<ClienteList />} />
          <Route path="actualizar/:id" element={<ClienteEdit />} />
          <Route path="buscar" element={<ClienteDetail />} />
        </Route>

        {/* RUTAS RESERVAS */}
        <Route
          path="/reservas"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ReservaList />} />
          <Route path="crear" element={<ReservaCreate />} />
          <Route path="listar" element={<ReservaList />} />
          <Route path="actualizar/:id" element={<ReservaEdit />} />
          <Route path="buscar" element={<ReservaDetail />} />
        </Route>

        {/* RUTAS VEHICULOS */}
        <Route
          path="/vehiculos"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<VehiculoList />} />
          <Route path="crear" element={<VehiculoCreate />} />
          <Route path="listar" element={<VehiculoList />} />
          <Route path="actualizar/:id" element={<VehiculoEdit />} />
          <Route path="buscar" element={<VehiculoDetail />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
