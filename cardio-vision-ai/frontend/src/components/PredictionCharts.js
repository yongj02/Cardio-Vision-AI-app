import React from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { Bar, Pie, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler } from 'chart.js';

// Register Chart.js components
ChartJS.register(
    Title, Tooltip, Legend,
    BarElement, CategoryScale, LinearScale,
    PointElement, LineElement, Filler,
    ArcElement
);

const PredictionCharts = ({ updatedResults, openCharts, setOpenCharts }) => {
    // Prepare data for charts
    const ages = updatedResults.map(result => result[0]);
    const genders = updatedResults.map(result => result[1]);
    const bloodPressures = updatedResults.map(result => result[3]);
    const cholesterols = updatedResults.map(result => result[4]);
    const fastingBS = updatedResults.map(result => result[5]);
    const maxHRs = updatedResults.map(result => result[7]);
    const exerciseAnginas = updatedResults.map(result => result[8]);
    const oldpeaks = updatedResults.map(result => result[9]);
    const stSlopes = updatedResults.map(result => result[10]);
    const predictions = updatedResults.map(result => result[11]);

    const ageRanges = [
        { range: '0 - 10', highRisk: 0, lowRisk: 0 },
        { range: '11 - 20', highRisk: 0, lowRisk: 0 },
        { range: '21 - 30', highRisk: 0, lowRisk: 0 },
        { range: '31 - 40', highRisk: 0, lowRisk: 0 },
        { range: '41 - 50', highRisk: 0, lowRisk: 0 },
        { range: '51 - 60', highRisk: 0, lowRisk: 0 },
        { range: '61 - 70', highRisk: 0, lowRisk: 0 },
        { range: '71 - 80', highRisk: 0, lowRisk: 0 },
        { range: '81 - 90', highRisk: 0, lowRisk: 0 },
        { range: '>90', highRisk: 0, lowRisk: 0 }
    ];

    // Group ages into ranges and count high/low risk predictions
    updatedResults.forEach(result => {
        const age = result[0];
        const prediction = result[11];

        if (age >= 0 && age <= 10) ageRanges[0][prediction === 1 ? 'highRisk' : 'lowRisk']++;
        else if (age >= 11 && age <= 20) ageRanges[1][prediction === 1 ? 'highRisk' : 'lowRisk']++;
        else if (age >= 21 && age <= 30) ageRanges[2][prediction === 1 ? 'highRisk' : 'lowRisk']++;
        else if (age >= 31 && age <= 40) ageRanges[3][prediction === 1 ? 'highRisk' : 'lowRisk']++;
        else if (age >= 41 && age <= 50) ageRanges[4][prediction === 1 ? 'highRisk' : 'lowRisk']++;
        else if (age >= 51 && age <= 60) ageRanges[5][prediction === 1 ? 'highRisk' : 'lowRisk']++;
        else if (age >= 61 && age <= 70) ageRanges[6][prediction === 1 ? 'highRisk' : 'lowRisk']++;
        else if (age >= 71 && age <= 80) ageRanges[7][prediction === 1 ? 'highRisk' : 'lowRisk']++;
        else if (age >= 81 && age <= 90) ageRanges[8][prediction === 1 ? 'highRisk' : 'lowRisk']++;
        else if (age >= 91) ageRanges[9][prediction === 1 ? 'highRisk' : 'lowRisk']++;
    });

    const ageChartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // Set the step size to 1
                    callback: function(value) {
                        return Math.abs(value);
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += Math.abs(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        }
    };
    
    const ageData = {
        labels: ageRanges.map(range => range.range),
        datasets: [
            {
                label: 'High Risk',
                data: ageRanges.map(range => range.highRisk),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Low Risk',
                data: ageRanges.map(range => range.lowRisk),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    }

    const countOccurrences = (array) => {
        return array.reduce((acc, value) => {
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
    };

    const genderCounts = countOccurrences(genders);
    const genderData = {
        labels: Object.keys(genderCounts),
        datasets: [{
            label: 'Gender Distribution',
            data: Object.values(genderCounts),
            backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1,
        }],
    };

    const bloodPressureData = {
        labels: ['Blood Pressure'],
        datasets: [{
            label: 'Cardiovascular Disease',
            data: bloodPressures.map((bp, index) => ({ x: bp, y: predictions[index] })),
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
            showLine: false,
        }],
    };

    const cholesterolData = {
        labels: ['Cholesterol'],
        datasets: [{
            label: 'Cardiovascular Disease',
            data: cholesterols.map((chol, index) => ({ x: chol, y: predictions[index] })),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            showLine: false,
        }],
    };

    const fastingBSData = {
        labels: ['Fasting Blood Sugar'],
        datasets: [{
            label: 'Cardiovascular Disease',
            data: fastingBS.map((bs, index) => ({ x: bs, y: predictions[index] })),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            showLine: false,
        }],
    };

    const maxHRData = {
        labels: ['Max Heart Rate'],
        datasets: [{
            label: 'Cardiovascular Disease',
            data: maxHRs.map((hr, index) => ({ x: hr, y: predictions[index] })),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            showLine: false,
        }],
    };

    const exerciseAnginaCounts = countOccurrences(exerciseAnginas);
    const exerciseAnginaData = {
        labels: Object.keys(exerciseAnginaCounts),
        datasets: [{
            label: 'Cardiovascular Disease by Exercise Angina',
            data: Object.keys(exerciseAnginaCounts).map(status => {
                return updatedResults.filter((_, i) => exerciseAnginas[i] === status).map(result => result[11]).reduce((acc, value) => {
                    acc[value] = (acc[value] || 0) + 1;
                    return acc;
                }, {});
            }),
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            borderColor: 'rgba(255, 205, 86, 1)',
            borderWidth: 1,
        }],
    };

    const oldpeakData = {
        labels: ['Oldpeak'],
        datasets: [{
            label: 'Cardiovascular Disease',
            data: oldpeaks.map((peak, index) => ({ x: peak, y: predictions[index] })),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            showLine: false,
        }],
    };

    const stSlopeCounts = countOccurrences(stSlopes);
    const stSlopeData = {
        labels: Object.keys(stSlopeCounts),
        datasets: [{
            label: 'Cardiovascular Disease by ST Slope',
            data: Object.keys(stSlopeCounts).map(status => {
                return updatedResults.filter((_, i) => stSlopes[i] === status).map(result => result[11]).reduce((acc, value) => {
                    acc[value] = (acc[value] || 0) + 1;
                    return acc;
                }, {});
            }),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    return (
        <>
            <Button
                variant="secondary"
                onClick={() => setOpenCharts(!openCharts)}
                aria-controls="collapsible-charts"
                aria-expanded={openCharts}
                className="w-100 mb-3"
            >
                {openCharts ? 'Hide Charts' : 'Show Charts'}
            </Button>

            <Collapse in={openCharts}>
                <div id="collapsible-charts">
                    <div className="charts">
                        <h3>Charts</h3>
                        <div className="chart-container mb-3">
                            <h4>Age Distribution</h4>
                            <Bar data={ageData} options={ageChartOptions} />
                        </div>
                        <div className="chart-container mb-3">
                            <h4>Gender Distribution</h4>
                            <Pie data={genderData} />
                        </div>
                        <div className="chart-container mb-3">
                            <h4>Blood Pressure vs. Cardiovascular Disease</h4>
                            <Scatter data={bloodPressureData} />
                        </div>
                        <div className="chart-container mb-3">
                            <h4>Cholesterol Levels vs. Cardiovascular Disease</h4>
                            <Scatter data={cholesterolData} />
                        </div>
                        <div className="chart-container mb-3">
                            <h4>Fasting Blood Sugar vs. Cardiovascular Disease</h4>
                            <Scatter data={fastingBSData} />
                        </div>
                        <div className="chart-container mb-3">
                            <h4>Max Heart Rate vs. Cardiovascular Disease</h4>
                            <Scatter data={maxHRData} />
                        </div>
                        <div className="chart-container mb-3">
                            <h4>Exercise Angina vs. Cardiovascular Disease</h4>
                            <Bar data={exerciseAnginaData} />
                        </div>
                        <div className="chart-container mb-3">
                            <h4>Oldpeak vs. Cardiovascular Disease</h4>
                            <Scatter data={oldpeakData} />
                        </div>
                        <div className="chart-container mb-3">
                            <h4>ST Slope vs. Cardiovascular Disease</h4>
                            <Bar data={stSlopeData} />
                        </div>
                    </div>
                </div>
            </Collapse>
        </>
    );
};

export default PredictionCharts;
