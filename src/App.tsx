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
import { setMinimumUser, setRole, setUser } from './_redux/features/user_slice.js';
import Loading from './components/ui/loading.js';
import { setSaveDeviceType, setUserPermission } from './_redux/features/setting.js';
import ChoisirCompte from './pages/ChoisirCompte/ChoisirCompte.js';
import { RootState } from './_redux/store.js';
import VerificationCode from './pages/Authentication/verification_code.js';
import createToast from './hooks/toastify.js';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from './components/protectRoutes.js';
import AccessDenied from './pages/CommonPage/AccesRefuse.js';
import { HeaderProvider } from './components/Context/HeaderConfig.js';

function App() {

  const dispatch = useDispatch();


  const [isMobileOrTablet, setIsMobileOrTablet] = useState(true);
  const roles = config.roles;


  const [userRole, setUserRole] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  // recuperer les info en local storage

  const [isAuth, setIsAuth] = useState<{ value: any; status: boolean }>({ value: 'default', status: false });

  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  const lang:string = useSelector((state: RootState) => state.setting.language); // fr ou en
  
  const {t}=useTranslation();




  // au lencement de la page
  const checkIfMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  useEffect(() => {
    dispatch(setSaveDeviceType(checkIfMobileOrTablet))
    if (checkIfMobileOrTablet) {
      setIsMobileOrTablet(false);
    }
  }, [checkIfMobileOrTablet]);



  // recupeer les info du token
  useEffect(() => {
    setLoading(true)
    const updateAuthStatus = async () => {
      await isUserAuthenticated().then((getAuth) => {
        setIsAuth(getAuth);
      })

    };
    updateAuthStatus();

  }, []);
 


  useEffect(() => {

    const handleAuthentication = async () => {
      if (isAuth.status) {
        const localUser = isAuth.value;

        if (localUser) {
          const { userId, roles, role } = localUser;

          if (role !== "" && role !== null && role !== undefined) {
            dispatch(setMinimumUser({ _id: userId, roles: roles, role: role }));
            setUserRole(role);

            // recuperer les data du user en bd
            try {
              // await getCurrentUserData({ userId: userId }).then((e: UserState) => {
              //   dispatch(setUser(e));
              //   setUserLog(e);
              //   dispatch(setRole(role));
              //   setLoading(false);
              // }).catch((e) => {
              //   setLoading(false);
              // })

              
            } catch (e) {
              setLoading(false);
              createToast(t('message.erreur'), "", 2);
            }
          }
        }

      } else {
        // console.log('isAuth.value  = null');

        setLoading(false);
        // setIsAuth({ value: '', status: false });
      }

      // if (isAuth.value != null)
      //   createToast(isAuth.value, "", 1);

    }

    handleAuthentication();
  }, [isAuth]);

 
  // useEffect(() => {
  //   // recuperer les settings 
  //   const fetchSettingsData = async () => {

  //     dispatch(setLoadingDataSetting(true));
  //     try {
  //       const settingsData = await apiGetAllSettings();
  //       dispatch(setDataSetting(settingsData));
  //       dispatch(setErrorDataSetting(null))
  //     } catch (error) {
  //       dispatch(setErrorDataSetting('une erreur est survenue'))
  //     } finally {
  //       dispatch(setLoadingDataSetting(false));
  //     }
  //   };

  //   const fetchSettingsDataIfAuth = async () => {
  //     if (isAuth.status) {
  //       await fetchSettingsData();
  //     }
  //   };

  //   fetchSettingsDataIfAuth();
  // }, [isAuth]);




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
                <Layout isMobileOrTablet={isMobileOrTablet} userPermissions={userPermissions}/> : <Navigate to={'/signin'} />} >

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