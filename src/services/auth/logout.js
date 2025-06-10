import { wstjqer } from "../../config.js";

export async function logoutFunction() {
    localStorage.removeItem(wstjqer);
    window.location.href = '/signin';

}