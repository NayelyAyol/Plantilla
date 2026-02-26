import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import PrivateRoute from "./routes/PrivateRoute"
import PaginaPrincipal from "./pages/PaginaPrincipal"
import Layout from "./components/Layouts/Layout"
import Register from "./pages/Register"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Estudiantes
import StudentList from "./pages/Estudiantes/StudentList"
import StudentCreate from "./pages/Estudiantes/StudentCreate"
import StudentEdit from "./pages/Estudiantes/StudentEdit"
import StudentDetail from "./pages/Estudiantes/StudentDetail"

// Materias
import SubjectList from "./pages/Materias/SubjectList"
import SubjectCreate from "./pages/Materias/SubjectCreate"
import SubjectEdit from "./pages/Materias/SubjectEdit"
import SubjectDetail from "./pages/Materias/SubjectDetail"

// Matrículas
import EnrollmentList from "./pages/Matriculas/EnrollmentList"
import EnrollmentCreate from "./pages/Matriculas/EnrollmentCreate"
import EnrollmentEdit from "./pages/Matriculas/EnrollmentEdit"
import EnrollmentDetail from "./pages/Matriculas/EnrollmentDetail"

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
          path="/paginaPrincipal"
          element={
            <PrivateRoute>
              <PaginaPrincipal />
            </PrivateRoute>
          }
        />

        {/* RUTAS ESTUDIANTES */}
        <Route
          path="/estudiantes"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<StudentList />} />
          <Route path="crear" element={<StudentCreate />} />
          <Route path="listar" element={<StudentList />} />
          <Route path="actualizar/:id" element={<StudentEdit />} />
          <Route path="buscar" element={<StudentDetail />} />
        </Route>

        {/* RUTAS MATERIAS */}
        <Route
          path="/materias"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<SubjectList />} />
          <Route path="crear" element={<SubjectCreate />} />
          <Route path="listar" element={<SubjectList />} />
          <Route path="actualizar/:id" element={<SubjectEdit />} />
          <Route path="buscarMateria" element={<SubjectDetail />} />
        </Route>

        {/* RUTAS MATRÍCULAS */}
        <Route
          path="/matriculas"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<EnrollmentList />} />
          <Route path="crear" element={<EnrollmentCreate />} />
          <Route path="listar" element={<EnrollmentList />} />
          <Route path="actualizar/:id" element={<EnrollmentEdit />} />
          <Route path="buscarMatricula" element={<EnrollmentDetail />} />
        </Route>
      </Routes>
    </>
  )
}

export default App