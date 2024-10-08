# Cardio Vision AI - Upload Dataset Page

## Overview
The "Upload Dataset" page is designed for admins and developers to manage datasets used by the deep learning model for predicting cardiovascular disease. This page allows you to upload new datasets and delete existing ones. The datasets are stored in MongoDB.

## Accessing the Upload Dataset Page
The "Upload Dataset" page is not linked in the navigation bar to restrict access. To access the page, you need to manually type the URL in your browser's address bar:

http://yourdomain.com/upload-dataset

Replace `yourdomain.com` with the actual domain where your application is hosted.

## Functionalities

### Uploading a Dataset
1. Navigate to the "Upload Dataset" page by typing the URL.
2. Click on the "Choose File" button.
3. Select the dataset file from your local machine. Note that the file must be in either CSV or Excel format and have the appropriate columns. Refer to the section "Required Columns for Dataset" for a detailed explanation of the required columns.
4. Click "Upload" to upload the dataset. The dataset will be stored in MongoDB.

### Deleting a Dataset
1. Navigate to the "Upload Dataset" page by typing the URL.
2. You will see a table listing the existing datasets.
3. Click the "Delete" button next to the dataset you want to remove.
4. Confirm the deletion. The dataset will be removed from MongoDB.

## Required Columns for Dataset
To make predictions, your dataset must include the following columns with exact names and data types:

| Variable       | Example Value | Description                                                                 |
|----------------|---------------|-----------------------------------------------------------------------------|
| Age            | 45            | Patient's age in years.                                                     |
| Sex            | M             | Patient's sex: M (male) or F (female).                                      |
| ChestPainType  | ATA           | Type of chest pain experienced by the patient: ATA (typical angina), NAP (non-anginal pain), etc. |
| RestingBP      | 120           | Resting blood pressure in mmHg.                                             |
| Cholesterol    | 210           | Serum cholesterol level in mg/dl.                                           |
| FastingBS      | 0             | Fasting blood sugar level: 1 if > 120 mg/dl, 0 otherwise.                   |
| RestingECG     | Normal        | Results of resting electrocardiographic measurement: Normal, ST, etc.       |
| MaxHR          | 150           | Maximum heart rate achieved during exercise.                                |
| ExerciseAngina | N             | Exercise induced angina: Y (yes) or N (no).                                 |
| Oldpeak        | 1.0           | Depression induced by exercise relative to rest.                            |
| ST_Slope       | Up            | Slope of the peak exercise ST segment: Up, Flat, Down.                      |

**Note:** The column names in your dataset must exactly match those listed above.

## Notes
- Ensure you have the necessary permissions to access and modify the datasets.
- Only authorized personnel should have access to the "Upload Dataset" page to maintain data integrity and security.

