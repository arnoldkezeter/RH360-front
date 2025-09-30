import { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignIn from './pages/Authentication/SignIn.js';
import { ToastContainer } from 'react-toastify';

import route from './routes/routes.js';
import { NotFound, NotFoundIsAuth } from './pages/NotFound/NotFound.js';
import DashBoardAmin from './pages/TableauDeBord/DashboardAdmin.js';
import { useDispatch, useSelector } from 'react-redux';
import { config } from './config.js';
import InitialPage from './pages/InitialPage/InitialPage.js';
import Layout from './layout/Layout.js';
import ResetPassword from './pages/Authentication/ResetPassword.js';
import { isUserAuthenticated } from './middlewares/auth_middleware.js';
import Loading from './components/ui/loading.js';
import { setSaveDeviceType } from './_redux/features/setting.js';
import ChoisirCompte from './pages/ChoisirCompte/ChoisirCompte.js';
import { RootState } from './_redux/store.js';
import VerificationCode from './pages/Authentication/verification_code.js';
import ProtectedRoute from './components/protectRoutes.js';
import AccessDenied from './pages/CommonPage/AccesRefuse.js';
import { HeaderProvider } from './components/Context/HeaderConfig.js';
import { setUser } from './_redux/features/utilisateurs/utilisateurSlice.js';
import { useSettingData } from './hooks/useSettingData.js';
import { getCurrentUserData } from './services/utilisateurs/utilisateurAPI.js';

function App() {

  const dispatch = useDispatch();
  const lang: string = useSelector((state: RootState) => state.setting.language); // fr ou en

  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>('');
  const currentUser: Utilisateur = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
  const [loading, setLoading] = useState<boolean>(true); // Commence en mode chargement
  const [isAuth, setIsAuth] = useState<{ value: any; status: boolean }>({ value: 'default', status: false });
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  // Vérifier si le dispositif est mobile ou tablette
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobileOrTablet(isMobile);
    dispatch(setSaveDeviceType(isMobile));
  }, []);

  // Récupérer les informations d'authentification
  useEffect(() => {
    const updateAuthStatus = async () => {
      try {
        const authData = await isUserAuthenticated();
        setIsAuth(authData);
      } catch (err) {
        console.error("Erreur lors de la vérification d'authentification :", err);
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    updateAuthStatus();
  }, []);

  // Gérer l'état d'authentification et charger les informations utilisateur
  useEffect(() => {
    if (!isAuth.status) return;

    const handleAuthentication = async () => {
      const localUser = isAuth.value;

      if (localUser) {
        const { _id, role, roles, nom, prenom, email, photoDeProfil, genre, actif } = localUser;
        if (role) {
          dispatch(
            setUser({
              _id,
              role,
              nom,
              prenom,
              email,
              photoDeProfil,
              genre,
              actif,
              roles
            })
          );
          console.log(_id)
          console.log(roles)
          setUserRole(role);
        }
      }
    };

    handleAuthentication();
  }, [isAuth, dispatch]);

  // Charger les paramètres de l'application uniquement si l'utilisateur est authentifié
  const { error } = useSettingData(lang, isAuth.status);

  // Gestion de l'état global de chargement
  if (loading) {
    return <InitialPage />;
  }

  if (Object.keys(error).length > 0) {
      return (
        <div>
          <h1>Une erreur est survenue :</h1>
          <ul>
            {Object.entries(error).map(([key, message]) => (
              <li key={key}>{`${key}: ${message}`}</li>
            ))}
          </ul>
        </div>
      );
    }


  const roles = config.roles;

 
  return loading ? (
    <InitialPage />
  ) : (
    <>
        
        <ToastContainer />
        <HeaderProvider>
          {
            isAuth.value !== 'default' && <Routes>
              {/* Redirect to /auth/signup if not authenticated */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/choose-account" element={<ChoisirCompte />} />
              <Route path="/verification-code/:id" element={<VerificationCode />} />
              <Route path="/unauthorized" element={<AccessDenied />} />


              {/* Menu de gauche pour les differents roles  */}
              <Route element={isAuth.value !== null && isAuth.status ?
                <Layout isMobileOrTablet={isMobileOrTablet} userPermissions={userPermissions} currentUser={currentUser}/> : <Navigate to={'/signin'} />} >

                {/*  Page de droites   */}
                {/* page dashboard est celle selectionner par defaut */}
                <Route index element={
                  (roles.superAdmin === userRole || roles.admin === userRole) ? <DashBoardAmin /> :
                    <NotFoundIsAuth />

                } />
                {/* autres pagges pour chaque type de compte */}
                { (true)?
                  (
                    route.map((route, index) => {
                      const { path, component: Component } = route;
                      return (
                        <Route
                          key={index}
                          path={path}
                          element={
                            <Suspense fallback={<Loading />}>
                              <ProtectedRoute
                                component={<Component/>}
                                userPermissions={userPermissions}
                              />
                            </Suspense>
                          }
                        />
                      );
                    })
                  )
                    : <Route element={<NotFoundIsAuth />} />

                }
              </Route>


              {/* si mauvaises url est rechercher */}
              <Route path='*' element={isAuth.status ? <div className='h-screen w-screen flex  items-center justify-center ml-[150px]'><Loading /></div> : <NotFound />} />
            </Routes >
        
        }
        </HeaderProvider>
    </>
  );
}

export default App;