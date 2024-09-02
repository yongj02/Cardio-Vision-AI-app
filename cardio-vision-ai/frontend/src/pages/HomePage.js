import React from 'react';

function HomePage() {
    return (
        <div className="container">
            <h1>Welcome to CardioVisionAI</h1>
            <p>CardioVisionAI helps doctors make better decisions by predicting cardiovascular disease risks using AI.</p>
            <p><a href="/signup" className="btn btn-primary">Get Started</a></p>
        </div>
    );
}

export default HomePage;
