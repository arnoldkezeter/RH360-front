import { useEffect } from "react";


const AccessDenied = () => {    
        
    useEffect(() => {
        // Modifier le code d'état HTTP
        document.title = "401 - Unauthorized";
    }, []);

    return (
        <div className="h-screen w-screen bg-white flex items-center justify-center">
            <div className="text-center p-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">401 - Accès non autorisé</h1>
                <p className="text-lg text-gray-600">
                    Vous n'avez pas la permission d'accéder à cette page.
                </p>
            </div>
        </div>
    );
        
};

export default AccessDenied;

