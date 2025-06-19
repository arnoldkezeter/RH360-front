import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../_redux/store";
import { setRegions } from "../_redux/features/parametres/regionSlice";
import { setGrades } from "../_redux/features/parametres/gradeSlice";
import { setFamilleMetiers } from "../_redux/features/elaborations/familleMetierSlice";
import { getRegionsForDropDown } from "../services/settings/regionAPI";
import { getStructuresForDropDown } from "../services/settings/structureAPI";
import { setStructures } from "../_redux/features/parametres/strucutureSlice";
import { getGradesForDropDown } from "../services/settings/gradeAPI";
import { getFamillesMetierForDropDown } from "../services/elaborations/familleMetierAPI";
import { useFetchData } from "./fechDataOptions";
import { getEtablissementsForDropDown } from "../services/settings/etablissementAPI";
import { setEtablissements } from "../_redux/features/parametres/etablissementSlice";
import { getAxesStrategiqueForDropDown } from "../services/elaborations/axeStrategiqueAPI";
import { setAxeStrategiques } from "../_redux/features/elaborations/axeStrategiqueSlice";
import { getProgrammeFormation, getProgrammeFormationForDropDown } from "../services/elaborations/programmeFormationAPI";
import { setProgrammeFormations } from "../_redux/features/elaborations/programmeFormationSlice";

const resources = [
  {
    apiFunction: getRegionsForDropDown,
    setData: setRegions,
    selector: (state: RootState) => state.regionSlice.data.regions,
  },
  {
    apiFunction: getStructuresForDropDown,
    setData: setStructures,
    selector: (state: RootState) => state.structureSlice.data.structures,
  },
  {
    apiFunction: getGradesForDropDown,
    setData: setGrades,
    selector: (state: RootState) => state.gradeSlice.data.grades,
  },
  {
    apiFunction: getFamillesMetierForDropDown,
    setData: setFamilleMetiers,
    selector: (state: RootState) => state.familleMetierSlice.data.familleMetiers,
  },
  {
    apiFunction: getEtablissementsForDropDown,
    setData: setEtablissements,
    selector: (state: RootState) => state.etablissementSlice.data.etablissements,
  },

  {
    apiFunction: getAxesStrategiqueForDropDown,
    setData: setAxeStrategiques,
    selector: (state: RootState) => state.axeStrategiqueSlice.data.axeStrategiques,
  },

  {
    apiFunction: getProgrammeFormationForDropDown,
    setData: setProgrammeFormations,
    selector: (state: RootState) => state.programmeFormationSlice.data.programmeFormations,
  },
];

export const useSettingData = (lang: string, isAuth:boolean) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Record<string, string | null>>({});
  const dispatch = useDispatch();

  const selectors = {
    regions: useSelector((state: RootState) => state.regionSlice.data.regions),
    structures: useSelector((state: RootState) => state.structureSlice.data.structures),
    grades: useSelector((state: RootState) => state.gradeSlice.data.grades),
    familleMetiers: useSelector((state: RootState) => state.familleMetierSlice.data.familleMetiers),
    etablissements:useSelector((state: RootState) => state.etablissementSlice.data.etablissements),
    axeStrategiques:useSelector((state: RootState) => state.axeStrategiqueSlice.data.axeStrategiques),
    programmeFomations:useSelector((state: RootState) => state.programmeFormationSlice.data.programmeFormations),

  };

  const fetchData = useFetchData();

  useEffect(() => {
    if(!isAuth) return;
    const fetchAllData = async () => {
      setLoading(true);
      setError({});

      try {
        await Promise.all(
          resources.map(({ apiFunction, setData }, index) =>
            fetchData({
              apiFunction,
              params: { lang },
              onSuccess: (data) => {
                dispatch(setData(data || []));
              },
              onError: (err) => {
                setError((prev) => ({
                  ...prev,
                  [resources[index].apiFunction.name]: err.message,
                }));
              },
            })
          )
        );
      } catch(e) {
        setError((prev) => ({
          ...prev,
          general: "Une erreur est survenue lors du chargement des données.",
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [lang, fetchData, dispatch]);

  return {
    loading,
    error,
    ...selectors,
  };
};

