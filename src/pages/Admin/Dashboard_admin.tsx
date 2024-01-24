import Breadcrumb from "../../components/Breadcrumb";


const DashBoardAmin = () => {
    return (
        <>
            <Breadcrumb pageName="Tableau de bord" isDashboard={true} />

            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardTotalClient />
                <CardTotalVehicule />
                <CardTotalDepense />
                <CardDepensesYear />
            </div> */}

            {/* <div className="mt-4 grid grid-cols-10 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartConducteur />
                <ChartDepense />
            </div> */}

            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 mt-6">
        <CardPrixAuKm />
        <CardPrixAuLitre />
      </div> */}

            {/* Depenses par semaines  */}

            {/* <div className="my-4 grid grid-cols-10 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartSemaine />
                <ChartMonth />
            </div> */}

            {/* Depenses annuelles  */}
            {/* <ChartAnnee /> */}
        </>
    );
};

export default DashBoardAmin;
