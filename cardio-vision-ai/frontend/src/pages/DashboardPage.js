import React from 'react';

function DashboardPage() {
    return (
        <div className="container">
            <h2>Dashboard</h2>
            <p>Welcome to CardioVisionAI. Please select an option to proceed:</p>
            <ul>
                <li><a href="/prediction">Make a Prediction</a></li>
                <li><a href="/profile">View Profile</a></li>
            </ul>
        </div>
    );
}

export default DashboardPage;
