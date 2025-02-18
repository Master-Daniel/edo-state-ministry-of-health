import { swal } from "../layouts/SweetAlertWrapper";

interface ErrorItem {
    type: string;
    msg: string;
    path: string;
    location: string;
}

interface ErrorResponse {
    errors?: ErrorItem[];
    message?: string;
}

export const setCookie = (name: string, value: string, duration: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (duration * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export const getCookie = (name: string) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    deleteCookie(name)
    return null;
}

export const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

export const decryptStr = (code: string) => {
    const key = 7;
    let value = "";
    for (let i = 0; i < code.length; i++) {
        value += String.fromCharCode(key ^ code.charCodeAt(i));
    }
    return value;
};

export const onErrorResponse = (error: ErrorResponse) => {
    if (error && typeof error === 'object') {
        if (Array.isArray(error.errors)) {
            error.errors.forEach((err) => {
                swal.fire({
                    icon: 'error',
                    text: err.msg,
                });
            });
        } else if (error.message) {
            swal.fire({
                icon: 'error',
                text: error.message,
            });
        }
    } else {
        swal.fire({
            icon: 'error',
            text: 'An unknown error occurred.',
        });
    }
};

export const onSuccessResponse = (message: string) => {
    if (message) {
        swal.fire({
            icon: 'success',
            title: 'Success',
            text: message
        });
    }
};