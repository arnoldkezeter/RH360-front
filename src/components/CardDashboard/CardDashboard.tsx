    import { PiStudentFill } from "react-icons/pi";
    import { GiTeacher } from "react-icons/gi";
    import { AiOutlineClockCircle } from "react-icons/ai";
    import { CurrentYearDate } from "./_CommonYear";
    import ProgressBar from "@ramonak/react-progress-bar";
    import LoadingTable from "../Tables/common/LoadingTable";


    interface CardDashboardProps {
        title: String,
        value?: String,
        id: Number,
        pageIsLoading?:boolean,
        progressionValue?: number,
        additionalStyle?: String,
        
    }



    const CardDashboard = ({ title, value, id, pageIsLoading, progressionValue, additionalStyle }: CardDashboardProps) => {
        const pageValueIsLoading=!value;
        return (
            <div className={`
            
            text-black bg-white
        dark:bg-boxdark dark:text-gray
        relative rounded-sm border border-stroke  py-6 px-5 shadow-default dark:border-strokedark  w-full`}>
                {/* icone position en haut a gauche */}
                {
                    id != 4 && <div className="absolute top-0 right-0 mt-5 mr-2 z-10">
                        <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 '>
                            <div className="text-primary text-[25px]" >
                                {

                                    id === 1 ?
                                        <AiOutlineClockCircle />
                                        : id === 2 ? <PiStudentFill />
                                            : id === 3 ? <GiTeacher />
                                                : <div></div>


                                }
                            </div>
                        </div>
                    </div>
                }

                {/* titre */}
                <div className="flex justify-between h-[70px]">
                    <h3 className={`${additionalStyle} ${id === 4 ? 'mr-0' : 'mr-[42px]'} mt-0  text-[13px] xl:text-[14px] text-start  font-semibold`}>
                        {title}
                    </h3>
                </div>

                {/* valeurss */}
                <div className='flex justify-center h-[70px]'>
                    {
                        progressionValue == null ?
                        pageIsLoading ?
                            <LoadingTable />:<h4 className={`text-[22px] font-bold ml-1 pb-[50px] lg:pb-[40px] `}>
                                {value}
                            </h4> :
                            pageIsLoading ?
                            <LoadingTable />:<div className="w-full mt-2">
                                <ProgressBar completed={progressionValue}  />

                            </div>}
                </div>








                {/* texte en absolute */}
                <CurrentYearDate />
            </div>
        );
    };

    export default CardDashboard;
