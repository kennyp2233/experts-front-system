export function dispatchMenssage(type: string, message: string) {
    const event = new CustomEvent(type, { detail: message });
    window.dispatchEvent(event);
}