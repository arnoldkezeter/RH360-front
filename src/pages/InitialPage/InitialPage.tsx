import LogoPng from "./../../images/logo/logo.png";

const InitialPage = () => {
    return (
        <div className={`flex flex-col items-center justify-center  bg-white h-screen`}>

            <div className='flex items-center justify-between gap-2 px-6 py-5.5 lg:pb-5  lg:pt-5  my-40 lg:my-30'>
                <div className="md:h-[150px] md:w-[150px] w-20 h-20">
                    <img src={LogoPng} alt="logo" />

                </div>

            </div>

            <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    );
};

export default InitialPage;
