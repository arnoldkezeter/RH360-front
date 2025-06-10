import Loading from '../../components/ui/loading';
import NotFoundImage from '/page-misc-error-light.png'

export function NotFound() {
    return (
        <div className='h-full w-full'>
            <div className='flex flex-col items-center justify-center'>
                <div className='h-60 w-60 lg:h-[300px] lg:w-[300px] mt-50 lg:mt-30'>
                    <img src={NotFoundImage} alt='page non trouvée' />
                </div>

                <h1 className='text-center text-gray-600 my-0'>
                    Page non trouvée!
                </h1>



                <button
                    onClick={() => {
                        window.location.href = '/signin';
                    }}
                    className="  
                    mt-8
           px-8 text-[11.5px] lg:text-sm md:text-md gap-2 my-2   
            inline-flex items-center justify-center  bg-primary  text-center font-medium text-white 
            hover:bg-opacity-90 lg:py-4 lg:px-4 xl:px-6 rounded  "
                >

                    <h1 className=''>
                        Revenir à la page de connexion
                    </h1>
                </button>
            </div>
        </div>
    );
}
export function NotFoundIsAuth() {
    return (
        <div className='mt-60 flex items-center justify-center text-2xl'>
            <h1 className='text-center text-gray-600'>
                <Loading />
            </h1>
        </div>
    );
}


