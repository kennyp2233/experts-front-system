import { useState } from 'react';
import Hero from './hero';
import Login from './login';
import Register from './register';
export default function AllInitial() {
    const [initialState, setInitialState] = useState(0);
    const handleInitialState = (n: number) => {
        setInitialState(n);
    }
    return (
        <>
            {
                initialState === 0 ? <Hero handleClick={handleInitialState} /> :
                    initialState === 1 ? <Login handleClick={handleInitialState} /> :
                        initialState === 2 ? <Register handleClick={handleInitialState} /> :
                            initialState === 3 ? <div>Forgot Password</div> :
                                <div>Error</div>
            }
        </>
    );
}