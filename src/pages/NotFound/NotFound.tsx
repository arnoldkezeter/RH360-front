export function NotFound() {
    return (
        <div className='h-screen w-screen flex items-center justify-center text-2xl'>
            <h1 className='text-center text-gray-600'>
                Page non trouvée!
            </h1>
        </div>
    );
}
export function NotFoundIsAuth() {
    return (
        <div className='mt-60 flex items-center justify-center text-2xl'>
            <h1 className='text-center text-gray-600'>
                Une erreur est survenue!
            </h1>
        </div>
    );
}


