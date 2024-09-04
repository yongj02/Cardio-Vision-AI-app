import React from 'react';

function HomePage() {
    return (
        <div className="container text-center">
            <h1>Welcome to CardioVisionAI</h1>
            <p>CardioVisionAI helps doctors make better decisions by predicting cardiovascular disease risks using AI.</p>
            <p><a href="/prediction" className="btn btn-primary">Get Started Without Logging In</a></p>
            <hr />
            <p><a href="/signup" className="btn btn-secondary">Create Account</a></p>
        </div>
    );
}

export default HomePage;
