import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import LoadingTable from '../Tables/common/LoadingTable';
import { useTranslation } from 'react-i18next';

interface ChartProps {
    series: {
        name: string;
        data: number[];
    }[];
}

export interface DataPair {
    name: string;
    value: number;
}

export const ChartEtudiantSection: React.FC<{ data: DataPair[] }> = ({ data }) => {
    const { t } = useTranslation();

    const [state, setState] = useState<ChartProps>({
        series: [{ name: '', data: [] }]
    });

    const options: ApexOptions = {
        colors: ['#FF7F00'], // Remplacez la couleur par orange
        chart: {
            fontFamily: 'Satoshi, sans-serif',
            type: 'bar',
            height: 335,
            stacked: true,
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: true,
            },
        },
        responsive: [
            {
                breakpoint: 1536,
                options: {
                    plotOptions: {
                        bar: {
                            borderRadius: 0,
                            columnWidth: '25%',
                        },
                    },
                },
            },
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 0,
                columnWidth: '50%',
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: data.map(item => item.name),
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            fontFamily: 'Satoshi',
            fontWeight: 500,
            fontSize: '12px',
            markers: {
                radius: 99,
            },
        },
        fill: {
            opacity: 1,
        },
    };

    useEffect(() => {
        setState({ series: [{ name: t('tableau_de_bord.nb_etudiant'), data: data.map(item => item.value) }] });
    }, [data]);

    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-3">
            <div className="mb-4 justify-between gap-4 sm:flex">
                <div>
                    <h4 className="text-md xl:text-[18px]  font-semibold text-black dark:text-white">
                        {t('tableau_de_bord.nombre_etudiant_section')}
                    </h4>
                </div>
            </div>
            <div>
                <div id="chartTwo" className="-ml-5 -mb-9">
                    {
                        state.series[0].data.length > 0 ? (
                            <ReactApexChart
                                options={options}
                                series={state.series}
                                type="bar"
                                height={350}
                            />
                        ) : (
                            <LoadingTable />
                        )
                    }
                </div>
            </div>
        </div>
    );
};
