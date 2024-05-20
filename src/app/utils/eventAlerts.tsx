import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function EventAlerts() {
    useEffect(() => {
        const handleSuccess = (e: Event) => {
            toast.success((e as CustomEvent).detail);
        };

        const handleError = (e: Event) => {
            toast.error((e as CustomEvent).detail);
        }

        const handleInfo = (e: Event) => {
            toast((e as CustomEvent).detail, {
                icon: <svg className='text-lg' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4fd1d9" /><g fill="#fff"><path d="M27 27.8h10v24H27z" /><circle cx="32" cy="17.2" r="5" /></g></svg>,

            });
        }

        window.addEventListener('success', handleSuccess);
        window.addEventListener('error', handleError)
        window.addEventListener('info', handleInfo);
        return () => {
            window.removeEventListener('success', handleSuccess);
            window.removeEventListener('error', handleError);
            window.removeEventListener('info', handleInfo);
        };
    }, []);

    return (
        <Toaster position="top-right" />
    );
}