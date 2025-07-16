import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { NoData } from "../../../NoData";

interface TableDashbord {
    data: any[];
    isLoading:boolean
}

const Table = ({
    data,
    isLoading
}: TableDashbord) => {
    const pageIsLoading = isLoading;

    return (
        <div className="bg-white mt-3 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="overflow-hidden">
                        {pageIsLoading ? (
                            <div className="p-6">
                                <Skeleton height={350} />
                            </div>
                        ) : data?.length === 0 ? (
                            <div className="p-12 text-center">
                                <NoData />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <HeaderTable />
                                    <BodyTable data={data} />
                                </table>
                            </div>
                        )}
                    </div>
            </div>
        </div>
    );
};

export default Table;