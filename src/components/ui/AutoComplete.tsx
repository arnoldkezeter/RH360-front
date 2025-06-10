import { useState, useEffect } from "react";
import { apiSearchEnseignant } from "../../services/other_users/api_enseignant";

const AutoCompleteSearch = () => {
    const [searchString, setSearchString] = useState('');
    const [results, setResults] = useState<EnseignantType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchString.length > 0) {
            setIsLoading(true);
            apiSearchEnseignant({searchString:searchString}).then((result)=>{
                setResults(result.enseignants);
                setIsLoading(false);
            })
            
        } else {
            setResults([]);
        }
    }, [searchString]);

    return (
        <div>
            <input
                type="text"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                placeholder="Rechercher un enseignant"
                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            />
            {isLoading && <p>Loading...</p>}
            {results.length > 0 && (
                <ul className="border mt-2">
                    {results.map((enseignant) => (
                        <li key={enseignant._id} className="p-2 border-b">
                            {enseignant.nom} {enseignant?.prenom??""}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutoCompleteSearch;