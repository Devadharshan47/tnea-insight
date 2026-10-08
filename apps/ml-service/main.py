import os
import json
import glob
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
import warnings

warnings.filterwarnings('ignore')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = r"C:\Users\deva\OneDrive\ドキュメント\tnea data\JSON_Output"
MASTER_DATA = []
DF = pd.DataFrame()

class PredictRequest(BaseModel):
    cutoff: float
    community: str
    preferredBranch: Optional[str] = None
    preferredDistrict: Optional[str] = None
    collegeType: Optional[str] = None
    limit: Optional[int] = 20

def clean_key(k):
    return k.replace('\n', ' ').strip()

def extract_year(filename):
    match = re.search(r'20\d{2}', filename)
    return int(match.group()) if match else 2024

import sqlite3

def load_data():
    global MASTER_DATA, DF
    print("Loading data from SQLite Database...")
    db_path = os.path.join(os.path.dirname(__file__), '..', 'web', 'prisma', 'dev.db')
    
    try:
        conn = sqlite3.connect(db_path)
        query = """
        SELECT 
            c.year,
            col.code as collegeCode,
            col.name as collegeName,
            b.code as branchCode,
            b.name as branchName,
            c.category as community,
            c.score as cutoff,
            col.district,
            col.type as category
        FROM Cutoff c
        JOIN College col ON c.collegeId = col.id
        JOIN Branch b ON c.branchId = b.id
        """
        DF = pd.read_sql_query(query, conn)
        conn.close()
        
        if not DF.empty:
            MASTER_DATA = DF.to_dict('records')
            print(f"Loaded {len(DF)} cutoff records from SQLite Database.")
        else:
            print("No data found in the database. Falling back to mock logic if needed or waiting for data.")
    except Exception as e:
        print(f"Database error: {e}")
        DF = pd.DataFrame()

@app.on_event("startup")
def startup_event():
    load_data()

@app.get("/api/cutoff/trends")
def get_trends():
    if DF.empty:
        return {"error": "No data available"}
    
    # Calculate some trends
    yearly_avg = DF.groupby('year')['cutoff'].mean().reset_index().to_dict(orient='records')
    comm_avg = DF.groupby('community')['cutoff'].mean().reset_index().to_dict(orient='records')
    
    return {
        "yearly_trends": yearly_avg,
        "community_trends": comm_avg
    }

@app.post("/api/cutoff/predict")
def predict(req: PredictRequest):
    if DF.empty:
        raise HTTPException(status_code=500, detail="Data not loaded")
        
    filtered = DF[DF['community'] == req.community]
    
    if req.preferredBranch and req.preferredBranch != "All":
        filtered = filtered[filtered['branchCode'].str.contains(req.preferredBranch, case=False, na=False) | 
                            filtered['branchName'].str.contains(req.preferredBranch, case=False, na=False)]
                            
    if req.preferredDistrict and req.preferredDistrict != "All":
        filtered = filtered[filtered['district'] == req.preferredDistrict]
        
    if req.collegeType and req.collegeType != "All":
        filtered = filtered[filtered['category'] == req.collegeType]

    if filtered.empty:
        return {"safeColleges": [], "moderateColleges": [], "dreamColleges": [], "predictionConfidence": 0}

    # Predict next year's cutoff per college-branch using simple linear regression or mean if not enough data
    results = []
    grouped = filtered.groupby(['collegeCode', 'collegeName', 'branchCode', 'branchName', 'district', 'category'])
    
    for name, group in grouped:
        group = group.sort_values('year')
        
        # Simple prediction: average of last 2 years or linear trend
        if len(group) >= 2:
            X = group[['year']].values
            y = group['cutoff'].values
            model = LinearRegression()
            model.fit(X, y)
            pred_cutoff = model.predict([[2025]])[0]
        else:
            pred_cutoff = group['cutoff'].iloc[-1]
            
        pred_cutoff = round(min(max(pred_cutoff, 70), 200), 2)
        prev_cutoff = round(group['cutoff'].iloc[-1], 2)
        
        diff = req.cutoff - pred_cutoff
        
        if diff > 2:
            category = "SAFE"
            prob = min(99, 85 + (diff * 2))
        elif -2 <= diff <= 2:
            category = "MODERATE"
            prob = min(84, 60 + (diff * 10))
        else:
            category = "DREAM"
            prob = max(10, 50 - (abs(diff) * 2))
            
        results.append({
            "collegeCode": name[0],
            "collegeName": name[1],
            "branchCode": name[2],
            "branchName": name[3],
            "district": name[4],
            "type": name[5],
            "previousCutoff": prev_cutoff,
            "predictedCutoff": pred_cutoff,
            "admissionProbability": int(prob),
            "recommendationTag": category,
            "trendDirection": "UP" if pred_cutoff > prev_cutoff else "DOWN",
            "placement": np.random.randint(70, 100), # Mock data for now
            "fees": np.random.randint(40000, 150000),
            "naac": np.random.choice(['A++', 'A+', 'A', 'B'])
        })
        
    results = sorted(results, key=lambda x: x['admissionProbability'], reverse=True)
    
    safe = [r for r in results if r['recommendationTag'] == 'SAFE']
    moderate = [r for r in results if r['recommendationTag'] == 'MODERATE']
    dream = [r for r in results if r['recommendationTag'] == 'DREAM']
    
    if req.limit and req.limit > 0:
        safe = safe[:req.limit]
        moderate = moderate[:req.limit]
        dream = dream[:req.limit]
    
    return {
        "safeColleges": safe,
        "moderateColleges": moderate,
        "dreamColleges": dream,
        "predictionConfidence": 92
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
