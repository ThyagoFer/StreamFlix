const API_URL = "http://127.0.0.1:8000";

export async function apiLogin(email, password) {
    return fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    }).then(r => r.json());
}

export async function apiRegister(email, password) {
    return fetch(`${API_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    }).then(r => r.json());
}

export async function apiMinhaLista(token) {
    return fetch(`${API_URL}/me/list/`, {
        headers: { 
            "Authorization": `Bearer ${token}` 
        },
    }).then(r => r.json());
}

export async function apiAddToMinhaLista(token, id) {
    return fetch(`${API_URL}/me/list/add/${id}/`, {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${token}`
        }
    }).then(r => r.json());
}

export async function apiRemoveFromMinhaLista(token, id) {
    return fetch(`${API_URL}/me/list/remove/${id}/`, {
        method: "DELETE",
        headers: { 
            "Authorization": `Bearer ${token}`
        }
    }).then(r => r.json());
}