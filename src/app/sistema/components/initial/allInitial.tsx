import { useEffect, useState } from 'react';
import Hero from './hero';
import Login from './login';
import Register from './register';
import { useAuth } from '../../providers/authProvider';
import { useSistemState } from '../../providers/sistemStateContext';

export default function AllInitial() {
    const [initialState, setInitialState] = useState(0);
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const { sistemState, handleSistemState } = useSistemState();

    const handleInitialState = (n: number) => {
        setInitialState(n);
    }
    const handleClickLogo = () => {
        console.log('clickLogo');
        setInitialState(0);
        handleSistemState(0);
    };

    window.addEventListener('clickLogo', handleClickLogo);

    /*
    useEffect(() => {
        
        return () => {
            window.removeEventListener('clickLogo', handleClickLogo);
        };
    }, []);
*/
    return (
        <>
            {
                initialState === 0 ? <Hero handleClick={handleInitialState} /> :
                    initialState === 1 ? <Login handleClick={handleInitialState} /> :
                        initialState === 2 ? <Register handleClick={handleInitialState} /> :
                            initialState === 3 ? <div>Forgot Password</div> :
                                <div className='text-primary min-h-screen'>Error</div>
            }
        </>
    );
}