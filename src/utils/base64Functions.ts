export const base64ToUint8Array = (base64: string) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

export const byteArrayToBase64 = (byteArray: Uint8Array) => {
    let binary = '';
    byteArray.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
};

export const stringToBase64 = (str: string) => {
    const coverArray = new Uint8Array(atob(str).split('').map(char => char.charCodeAt(0)));
    const chunkSize = 65536;
    let result = '';
    for (let i = 0; i < coverArray.length; i += chunkSize) {
        const chunk = coverArray.subarray(i, i + chunkSize);
        result += String.fromCharCode(...Array.from(chunk));
    }
    return window.btoa(result);
};