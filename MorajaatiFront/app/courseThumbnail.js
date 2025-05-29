import apiClient from "./api";

export const getCourseThumbnail = async (courseId) => {
    const url = `/api/courses/${courseId}/thumbnail`;
    try {
        const response = await apiClient.get(url, {
            responseType: 'arraybuffer',
        });

        // Convert ArrayBuffer to base64 (React Native compatible)
        const base64 = arrayBufferToBase64(response.data);
        return `data:image/jpeg;base64,${base64}`;
    } catch (e) {
        console.warn("Failed to fetch thumbnail for course "+ courseId);
    }
}

const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};
