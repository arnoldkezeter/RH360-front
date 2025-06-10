import { config } from "../../config";
import LogoPng from "./../../images/logo/logo.png";

const InitialPage = () => {
    return (
        <div className={`flex flex-col items-center justify-center  bg-white h-screen w-full  `}>

            <div className="bg-white rounded-md bg-opacity-90 w-full flex flex-col items-center justify-center ">
                <div className="h-24 w-24">
                    <img src={LogoPng} alt="logo" />
                </div>
                <h1 className="text-black font-semibold text-xl">{config.nameApp}</h1>
            </div>

            <div className=" my-10 h-10 w-10 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
        </div>
    );
};

export default InitialPage;
