import ImageUser from './../../images/user/user.png';

import { config, serveurUrl } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import createToast from '../../hooks/toastify';
import { MdDelete, MdEdit } from 'react-icons/md';
import CustomModal from '../Modals/CustomDialogModal';
import { setUser } from '../../_redux/features/utilisateurs/utilisateurSlice';
import { deletePhotoProfil, savePhotoProfil } from '../../services/utilisateurs/utilisateurAPI';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB


export function PickPhoto({currentUser}:{currentUser:Utilisateur}) {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const lang = useSelector((state: RootState) => state.setting.language);
  const user = { username: currentUser.nom, role: currentUser.role, photo: currentUser.photoDeProfil };

  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [updatePhoto, setUpdatePhoto] = useState<boolean>(false);
  
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        const msg = lang === 'fr'
          ? 'Le fichier est trop grand. La taille maximale est de 5MB.'
          : 'The file is too large. The maximum size is 5MB.'
        setError(msg);

        createToast(msg, '', 2);
        setFile(null); // Clear the file
      } else {
        setFile(selectedFile);
        setError('');

      }
    }
  };



  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('image_profil', file);
      setLoading(true);
      try {

        await savePhotoProfil({ formData: formData, userId: currentUser?._id || "" })
          .then((reponse) => {
            setLoading(false);
            setFile(null);
            dispatch(setUser({ ...currentUser, photoDeProfil: reponse.data.photoDeProfil }));
            createToast(reponse.message, '', 0);
            setUpdatePhoto(false)
          }).catch((e) => {
            createToast(e.message,'', 2);
            setLoading(false);

          })

      } catch (e) {
        createToast('Une erreur est survenue', '', 2);
        setLoading(false);
        setLoading(false);

      }

    }
    else {
      createToast('erreur', '', 1)
    }
  }
  return (
    <div className="col-span-5 xl:col-span-2">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            {t('label.photo_profil')}
          </h3>
        </div>

        {

          currentUser === null ?
            <div className="w-full flex justify-center my-10">
              <div className=" my-10 h-10 w-10 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>

            </div> :
            <>
              <div className="p-7">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full overflow-hidden">
                    {
                      currentUser.photoDeProfil !== null && currentUser.photoDeProfil !== '' ?
                      <img 
                        src={`${serveurUrl}${currentUser.photoDeProfil}`} 
                        alt={currentUser.nom} 
                        crossOrigin="anonymous"
                      />:<img src={ImageUser} alt="User" />
                    }
                  </div>

                  <div className='flex flex-col'>

                    <span className="mb-1.5 text-black dark:text-white">
                      {t('label.editer_photo')}
                    </span>

                    {
                      currentUser.photoDeProfil !== '' && <div className='-mt-2 flex space-x-2'>
                        <button
                          onClick={() => setUpdatePhoto(true)}
                          className='hover:text-primary flex items-center justify-center gap-x-1 '>
                          <MdEdit />
                          {lang === 'fr' ? "Modifier" : "Update"}
                        </button>
                        <button
                          onClick={() => setOpenModalDelete(true)}
                          className='text-meta-1 flex items-center justify-center gap-x-1 hover:text-opacity-80 '>
                          <MdDelete />

                          {lang === 'fr' ? "Supprimer" : "Delete"}

                        </button>

                      </div>
                    }
                  </div>

                </div>


                {!error && <div className="text-red-500">{error}</div>}

                {

                  
                  !updatePhoto && user.photo !== '' ?
                    <div className='w-full flex justify-center items-center'>
                      <div className="h-30 lg:h-40 w-30 lg:w-40 rounded-full overflow-hidden">
                        {currentUser.photoDeProfil !== null && currentUser.photoDeProfil !== '' ?
                          <img 
                            className="w-full h-full object-cover" 
                            src={`${serveurUrl}${currentUser.photoDeProfil}`} 
                            alt={currentUser.nom} 
                            crossOrigin="anonymous"
                          />:<img src={ImageUser} alt="User" />
                        }
                      </div>
                    </div>
                    :


                    !file ?
                      <div
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        />

                        <div className="flex flex-col items-center justify-center space-y-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                fill="#3C50E0"
                              />
                            </svg>
                          </span>
                          <p className="text-center">
                            <span className="text-primary ">{user.photo === null || user.photo === '' ? t('label.telecharger_photo') : t('label.telecharger_photo')} </span>{t('label.glisser_photo')}
                          </p>
                          <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                          <p>(max, 800 X 800px)</p>
                        </div>
                      </div> :
                      // previsualiser
                      <div className="bg-black shadow-4 border border-[#cccaca] p-10 flex flex-col items-center justify-center text-center w-full">
                        {file.type.startsWith('image/') && (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Prévisualisation du contrat"
                            className="max-h-[220px] w-auto"
                          />
                        )}

                      </div>
                }
                {updatePhoto || file ? <div className="flex justify-end gap-4.5 pt-5 ">
                  <button
                    onClick={() => { setUpdatePhoto(false); setFile(null); setLoading(false) }}
                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white text-sm"
                  >
                    {t('boutton.annuler')}
                  </button>


                  <button
                    className={`${loading && 'opacity-50'} flex justify-center rounded bg-primary
               py-2 px-4 lg:px-10 font-medium text-gray hover:bg-opacity-70 text-[12px] lg:text-sm`}
                    onClick={loading ? () => { alert('Patientez la fin du chargement !') } : handleSubmit}
                  >
                    {loading && <div className={`flex items-center justify-center bg-transparent pr-2`}>
                      <div className="h-5 w-5  animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                    </div>}
                    {loading ? <p>Loading...</p> : t('boutton.sauvegarder')}
                  </button>
                </div> : <div></div>}
              </div></>
        }
      </div>





      {/* Modal confirmation delete  photo de profil*/}
      <CustomModal
        isLoading={loading}
        title={'Confirmation'}
        isModalOpen={openModalDelete}
        isDelete={true}
        closeModal={() => setOpenModalDelete(false)}
        handleConfirm={async () => {
          if (currentUser.photoDeProfil !== '') {
            setLoading(true);
            try {
              setLoading(true);

              await deletePhotoProfil({ userId: currentUser?._id||"", lang })
                .then((reponse) => {
                  setFile(null);
                  dispatch(setUser({ ...currentUser, photoDeProfil: '' }));
                  createToast(reponse.message, '', 0);

                  setLoading(false);
                  setUpdatePhoto(false);
                  setFile(null);
                  setOpenModalDelete(false);

                }).catch((e) => {
                  createToast(e.data.message, '', 2)
                  setLoading(false);
                  setUpdatePhoto(false);
                  setFile(null);
                })

            } catch (e) {
              createToast('Une erreur est survenue', '', 2);
              setLoading(false);
              setUpdatePhoto(false);
              setFile(null);
            }
          } else {
            createToast(lang === 'fr' ? 'Aucune image trouver' : 'No image detected', '', 1)

          }


        }}
      >
        <p>{lang === 'fr' ? 'Confirmer la suppression de la photo de profil' : 'Confirm deletion of profile photo'}</p>
      </CustomModal>


      {/* modal update photo */}
    </div >
  )
}

