export async function logoutFunction() {
    localStorage.removeItem("jwt");
    window.location.href = '/auth/signin';
    
}