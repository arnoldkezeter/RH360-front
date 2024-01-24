import { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignIn from './pages/Authentication/SignIn.js';
import { ToastContainer } from 'react-toastify';
import LoaderCircular from './components/Loader/LoaderCircular.js';
import routeAdmin from './routes/routes.admin.js'
import routeTeacher from './routes/routes.teacher.js'
import routeStudent from './routes/routes.student.js'
import routeDelegate from './routes/route.delegate.js'
import { NotFound, NotFoundIsAuth } from './pages/NotFound/NotFound.js';
import DashBoardAmin from './pages/Admin/Dashboard_admin.js';
import DashboardTeacher from './pages/Enseignant/Dashboard_teacher.js';
import DashBoardStudent from './pages/Etudiant/Dashboard_student.js';
import { useDispatch, useSelector } from 'react-redux';
import { PropsUserState, setUser } from './_redux/features/user_slice.js';
import { RootState } from './_redux/store.js';
import { config } from './config.js';
import InitialPage from './pages/InitialPage/InitialPage.js';
import Layout from './layout/Layout.js';
import DashboardDelegate from './pages/Delegue/Dashboard_delegue.js';


function App() {
  var dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  // var isAuth = isUserAuthenticated();
  const isAuth = { status: true };
  const roles = config.roles;
  const sommesRoutesDelegateStudent = [...routeStudent, ...routeDelegate];

  const userTest = [
    {
      id: '1',
      role: 'admin',
      username: 'Idriss Jordane',
      email: 'jordane.idriss@gmail.com',
    },
    {
      id: '2',
      role: 'teacher',
      username: 'Junior Arnold',
      email: 'arnold.junior@gmail.com',
    },
    {
      id: '3',
      role: 'delegate',
      username: 'Daryl Anderson',
      email: 'daryl.anderson@gmail.com',
    },
    {
      id: '4',
      role: 'student',
      username: 'Pombo emmanuel',
      email: 'emmanuel.pombo@gmail.com',
    }
  ];




  // au lencement de la page
  useEffect(() => {
    // temps de latence (Test), pour passe de la page common vers /dashboard  ou /sigin
    const timeout = setTimeout(() => {
      setLoading(false);


      // on save en state le user connecter dans le state global de l'app
      const currentUser: PropsUserState = userTest[0]; // 0=admin, 1=enseignant 2=delegué 3=etudiant
      dispatch(setUser(currentUser))
    }, 0);
    return () => clearTimeout(timeout);
  }, []);



  const userRole = useSelector((state: RootState) => state.user.role);




  return loading ? (
    <InitialPage />
  ) : (
    <>
      <ToastContainer />

      <Routes>
        {/* Redirect to /auth/signup if not authenticated */}
        <Route path="/auth/signin" element={<SignIn />} />

        {/* Menu de gauche pour les differents roles  */}
        <Route element={isAuth.status ? <Layout /> : <Navigate to={'/auth/signin'} />}>


          {/*  Page de droites   */}
          {/* page dashboard est celle selectionner par defaut */}
          <Route index element={
            roles.admin === userRole ? <DashBoardAmin /> :
              roles.teacher === userRole ? <DashboardTeacher /> :
                roles.student === userRole ? <DashBoardStudent /> :
                  roles.delegate === userRole ? <DashboardDelegate /> :
                    <NotFoundIsAuth />
          } />
          {/* autres pagges pour chaque type de compte */}
          {
            userRole === roles.admin ?
              (
                routeAdmin.map((route, index) => {
                  const { path, component: Component } = route;
                  return (
                    <Route
                      key={index}
                      path={path}
                      element={
                        <Suspense fallback={<LoaderCircular />}>
                          <Component />
                        </Suspense>
                      }
                    />
                  );
                })
              ) :
              userRole === roles.teacher ?
                (
                  routeTeacher.map((route, index) => {
                    const { path, component: Component } = route;
                    return (
                      <Route
                        key={index}
                        path={path}
                        element={
                          <Suspense fallback={<LoaderCircular />}>
                            <Component />
                          </Suspense>
                        }
                      />
                    );
                  })
                ) :
                userRole === roles.student ?
                  (
                    routeStudent.map((route, index) => {
                      const { path, component: Component } = route;
                      return (
                        <Route
                          key={index}
                          path={path}
                          element={
                            <Suspense fallback={<LoaderCircular />}>
                              <Component />
                            </Suspense>
                          }
                        />
                      );
                    })
                  ) :
                  userRole === roles.delegate ?
                    (
                      sommesRoutesDelegateStudent.map((route, index) => {
                        const { path, component: Component } = route;
                        return (
                          <Route
                            key={index}
                            path={path}
                            element={
                              <Suspense fallback={<LoaderCircular />}>
                                <Component />
                              </Suspense>
                            }
                          />
                        );
                      })
                    )


                    : <Route element={<NotFound />} />

          }
        </Route>


        {/* si mauvaises url est rechercher */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;