import { useState } from "react";

export default function Stats() {
    const [lastUsers, setLastUsers] = useState(1);
    const [users, setUsers] = useState(427);
    const percentageChange = ((users - lastUsers) / lastUsers) * 100;
    return (
        <>
            <div className="stats w-full max-md:stats-vertical max-md:max-w-sm mx-auto shadow ">

                <div className="stat">
                    <div className="stat-figure text-secondary text-3xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5" /></svg> </div>
                    <div className="stat-title">Visitas</div>
                    <div className="stat-value">31K</div>
                    <div className="stat-desc">Jan 1st - Feb 1st</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary text-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M7.879 7.5c.504-.61 1.267-1 2.121-1s1.617.39 2.121 1a2.75 2.75 0 1 1-4.243 0m5.871 1.75c0-.632-.156-1.228-.432-1.75H17.5A1.5 1.5 0 0 1 19 9v.5c0 1.587-1.206 3.212-3.315 3.784A2.5 2.5 0 0 0 13.5 12h-.95a3.74 3.74 0 0 0 1.2-2.75M13.5 13a1.496 1.496 0 0 1 1.5 1.5v.5c0 1.971-1.86 4-5 4s-5-2.029-5-4v-.5A1.496 1.496 0 0 1 6.5 13zM1 9.5c0 1.587 1.206 3.212 3.315 3.784A2.5 2.5 0 0 1 6.5 12h.95a3.74 3.74 0 0 1-1.2-2.75c0-.632.156-1.228.433-1.75H2.5A1.5 1.5 0 0 0 1 9zm7.75-5.75a2.75 2.75 0 1 0-5.5 0a2.75 2.75 0 0 0 5.5 0m8 0a2.75 2.75 0 1 0-5.5 0a2.75 2.75 0 0 0 5.5 0" /></svg>
                    </div>
                    <div className="stat-title">Nuestros Usuarios</div>
                    <div className={"stat-value "}>427</div>
                    <div className={"stat-desc " + (users - lastUsers > 0 ? "text-accent" : "")}>↗︎ 427 ({percentageChange}%)</div>
                </div>


            </div>
        </>
    );
}