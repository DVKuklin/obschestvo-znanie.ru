export const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const baseUrlApi = baseUrl + '/api';
export const baseUrlStorage = baseUrl + '/storage/';
export const baseImageURL = baseUrl + '/storage/';
export const token_key = 'token';

export const baseUrlImages = baseUrl + '/storage/'

const api = {
    sections: {
        get: baseUrlApi + "/sections",
    },
    themes_and_section: {
        get_by_section_url: baseUrlApi + "/get_themes_and_section_by_section_url",
    },
    additional_pages: {
        get_urls: baseUrlApi + "/get_additional_pages_urls",
    },
    themes: {
        get_by_section_id: baseUrlApi + "/get_themes_by_section_id"
    },
    paragraphs: {
        get_by_theme_and_section_url: baseUrlApi + "/get_paragraps_by_section_and_theme_url"
    },
    users: {
        authorization:  baseUrlApi + "/auth",
    },

    test: {
        get_headers: baseUrlApi + "/get_headers",
    },

    test: {
        get_token: baseUrlApi + "/test_get_token",
    },
    test: {
        get_me: baseUrlApi + "/test_get_me",
    },



    
    banner: {
        get: baseUrlApi + "/banner"
    },
    user: {
        register: baseUrlApi + '/register',
        isAuthorisated: baseUrlApi + '/user-check',
        login: baseUrlApi + "/login",
        resertPassword: baseUrlApi + '/resert-password',
        getInfo: baseUrlApi + '/get-info'
    }
}

export default api;