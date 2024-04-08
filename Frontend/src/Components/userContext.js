import React, { createContext, useEffect, useState } from 'react'

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:4000/profile', {
            credentials: 'include',
        })
        .then((res) => {
            if (res.ok || res.status === 304) {
                res.json().then(userInfo => {
                    setUserInfo(userInfo);
                    setIsLoading(false);
                });
            } else {
                setIsLoading(false);
                console.log("Error: Response not OK");
            }
        })
        .catch(error => {
            setIsLoading(false);
            console.log("Fetch error:", error);
        });
    }, []);
    

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, isLoading}}>
            {children}
        </UserContext.Provider>
    )
}