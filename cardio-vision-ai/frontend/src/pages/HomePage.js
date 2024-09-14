import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Adjust the path as needed

function HomePage() {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <div className="container text-center">
            <h1>Welcome to Cardio Vision AI</h1>
            <p>Cardio Vision AI helps doctors make better decisions by predicting cardiovascular disease risks using AI.</p>
            
            {isLoggedIn ? (
                <p>
                    <a href="/prediction" className="btn btn-primary">Continue</a>
                </p>
            ) : (
                <>
                    <p><a href="/prediction" className="btn btn-primary">Get Started Without Signing Up</a></p>
                    <hr />
                    <p>
                        <a href="/login" className="btn btn-primary btn-space">Log In</a>
                        <a href="/signup" className="btn btn-secondary">Create Account</a>
                    </p>
                </>
            )}
        </div>
    );
}

export default HomePage;
