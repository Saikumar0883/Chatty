
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from './userContext'

function Header() {
    const { userInfo, setUserInfo, isLoading } = useContext(UserContext)
    function logout() {
        fetch('http://127.0.0.1:4000/logout', {
            credentials: 'include',
            method:'POST',
        })
        setUserInfo(null)
    }
    if (isLoading) {
        return <div>Loading...</div>
    }
    const userName=userInfo?.userName
    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            <section className='hide'>hello</section>
            <Link to="/" className="logo">DialogueSpace</Link>
            <nav>
                {userName && (
                    <>
                        Hello {userName}
                        <a onClick={logout}>Logout</a>
                    </>
                )}
                {!userName && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}

            </nav>
        </header>
    )
}

export default Header