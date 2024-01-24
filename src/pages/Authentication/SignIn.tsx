import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import LogoPng from "./../../images/logo/logo.png";

import { signinApi } from '../../api/auth/api_signin';
import createToast from '../../hooks/toastify';
import { config } from '../../config';
import { FaRegCopyright } from "react-icons/fa6";


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    // if (email && password) {
    setLoading(true);

    const signInResult = await signinApi({ email: email, password: password });

    if (signInResult.success) {
      window.location.href = '/';
      createToast(signInResult.message, "", 0);

    }

    // if (signInResult.success) {
    // createToast(signInResult.message, "", 0);
    // window.location.href = '/';


    // } else {
    //   createToast(signInResult.message, "", 2);
    // }
    setLoading(false);

    // } else {
    //   alert("Veuillez renseigner tous les champs!")
    // }


  };


  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-screen overflow-hidden">
        <div className="flex flex-wrap items-center h-screen px-10 lg:px-35">
          <div className="hidden w-full xl:block xl:w-1/2 mt">
            <div className="py-17.5 px-26 text-center">

              <div className='h-20 w-50'>
                <p className="mt-5 text-lg ">
                  Content de vous revoir !
                </p>
              </div>

              <div className="md:h-[200px] md:w-[200px]">
                <img src={LogoPng} alt="logo" />
              </div>
              <div className='h-20 w-50'>
                <p className="mt-8 text-2xl  font-bold text-boxdark-2 ">
                  {config.nameApp}
                </p>

                {/* copy ritght */}
                <div className='w-full flex flex-col justify-center items-center -ml-4 mt-15 mb-5 text-body'>
                  <div className='flex items-center'>
                    <div className='text-[10px]  pr-1 '>
                      <FaRegCopyright />
                    </div>
                    <p className='text-[12px]'>{config.copyRight}</p>

                  </div>

                  <p className='text-[13px] ml-2'>Version <span className='font-semibold'>{config.version}</span></p>

                </div>
              </div>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Se connecter
              </h2>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  E-mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Entrer votre email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <span className="absolute right-4 top-4">
                    <div className='text-md lg:text-[22px]'>
                      <IoMdMail />
                    </div>
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Entrer votre mot de passe"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="absolute right-4 top-4 cursor-pointer text-md lg:text-[22px]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {!showPassword ? (
                      <div>
                        <FaEye />

                      </div>
                    ) : <div><FaEyeSlash />
                    </div>
                    }</span>
                </div>
              </div>



              <div className="my-5 mt-10">

                {
                  loading ? <div className='flex items-center justify-center h-[60px]'>
                    <div className={`flex items-center justify-center  bg-transparent'}`}>
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                    </div>

                  </div>
                    :
                    <button
                      className="h-[60px] w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                      onClick={handleSubmit}

                    >Se connecter </button>
                }
              </div>



              <div className="mt-6 text-center">
                <p>
                  Mot de passe oublier ?{' '}
                  <Link to="?" className="text-primary font-medium">
                    Réinitialiser le mot de passe
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
