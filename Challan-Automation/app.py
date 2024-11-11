import os
import json
import requests
from flask import Flask, request, jsonify
from web3 import Web3
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, MetaData
from sqlalchemy import Table, MetaData, insert, select
import subprocess
import pandas as pd
import random
import time


load_dotenv()
db = SQLAlchemy()

app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] ="postgresql://postgres.pgxcbqefaxqptyzgjyvr:terabhaijod@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    # Reflect existing tables
    metadata = MetaData()
    metadata.reflect(bind=db.engine)

    # Access the existing challan table
    Challan = Table('Challan', metadata, autoload_with=db.engine)
    Vehicle = Table('Vehicle', metadata, autoload_with=db.engine)
# Load ML model
# model = joblib.load('model.pkl')  

# Connect to blockchain
infura_project_id = os.getenv("INFURA_PROJECT_ID")
private_key = os.getenv("PRIVATE_KEY")
etherscan_api_key = os.getenv("ETHERSCAN_API_KEY")
contract_address = os.getenv("CONTRACT_ADDRESS")


web3 = Web3(Web3.HTTPProvider(f"https://sepolia.infura.io/v3/{infura_project_id}"))

etherscan_url = f"https://api.etherscan.io/api?module=contract&action=getabi&address={contract_address}&apikey={etherscan_api_key}"
with open('challanABI.json', 'r') as file:
    contract_abi = json.load(file)

contract = web3.eth.contract(address=contract_address, abi=contract_abi['abi'])

def filterDataSpeedAndNPD():
    # Load the CSV file
    df = pd.read_csv("output.csv")

    # Filter rows where license_plate_text or speed_kmh are missing
    df_filtered = df.dropna(subset=['license_plate_text', 'speed_kmh'])

    # Remove duplicates, keeping the last occurrence for each license plate
    df_unique = df_filtered.drop_duplicates(subset=['license_plate_text'], keep='last')

    # Select only the license_plate_text and speed_kmh columns
    df_selected = df_unique[['license_plate_text', 'speed_kmh']]

    # Get the first 5 rows
    df_first_five = df_selected.head(5)

    # Convert to JSON format
    json_output = df_first_five.to_dict(orient="records")

    # Print JSON output
    print(json_output)

    # Save the first 5 rows of the filtered DataFrame to a new CSV file
    df_first_five.to_csv("filtered_data_for_challan.csv", index=False)


@app.route('/hello', methods=['GET'])
def terabhaijod():
    return jsonify({"status": "Transaction complete"})

# Helper function to get vehicleId from plateNumber
def get_vehicle_id(plate_number):
    query = select(Vehicle.c.id).where(Vehicle.c.plateNumber == plate_number)
    result = db.session.execute(query).first()
    return result[0] if result else None

def generate_random_7_digit_id():
    return ''.join(random.choices('0123456789', k=7))

@app.route('/createchallan', methods=['POST'])
def create_challan():
    try:
        data = request.get_json()
        amount = '0.01'
        reason = 'Over Speeding'
        plate_number = data.get('plateNumber')
        # challan_id = data.get('challanId')

        # Get vehicle ID from plate number
        vehicle_id = get_vehicle_id(plate_number)
        if not vehicle_id:
            return jsonify({'error': 'Vehicle not found for the provided plate number'}), 404

        # Validate required fields
        if not amount or not reason or not vehicle_id:
            return jsonify({'error': 'Please provide all required fields'}), 203
        
        challanDbRandomId = generate_random_7_digit_id()

        # Create a new challan entry using SQLAlchemy insert
        stmt = insert(Challan).values(
            id=challanDbRandomId,
            fine=amount,
            reason=reason,
            vehicleId=vehicle_id,
            location="Delhi",
        )
        db.session.execute(stmt)
        db.session.commit()

        # Return created challan data
        return jsonify({
            'fine': amount,
            'reason': reason,
            'vehicle_id': vehicle_id,
            'location': "Delhi",
        }), 200

    except Exception as error:
        # Handle exceptions and return error message
        return jsonify({
            'error': 'An error occurred while creating the challan',
            'details': str(error)
        }), 500



# Blockchain transaction endpoint
@app.route('/transact', methods=['GET'])
def transact():
    # data = request.json
    # prediction = model.predict([data['features']])
    data = request.get_json()
    plate_number = data.get('plateNumber')
    # Prepare transaction
    print('hi0')
    account = web3.eth.account.from_key(private_key)
    print('hi1')
    print(account)
    tx_data={
        'vehicleId': plate_number,
        'amount':'100',
        'reason':'Over Speeding',
        'location':'Delhi',
    }
    print('hi2')
    nonce = web3.eth.get_transaction_count(
            account.address)
    print(tx_data)
    print(nonce)
    transaction = contract.functions.issueChallan( tx_data['vehicleId'],
    tx_data['amount'],
    tx_data['reason'],
    tx_data['location']).build_transaction({
        'nonce': nonce
    })

    print('hi3')
    # Sign and send transaction
    signed_txn = web3.eth.account.sign_transaction(transaction,private_key)
    # signed_txn = web3.eth.account.signTransaction(transaction, private_key=private_key)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
    print(tx_hash.hex())
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return jsonify({"status": "Transaction complete", "tx_hash": tx_hash.hex()})

@app.route('/generatechallans', methods=['GET'])
def fetch_data():
    # Run the fetchData.py script
    try:
        filterDataSpeedAndNPD()
        try:
        # Load the filtered data from CSV
            df = pd.read_csv('filtered_data_for_challan.csv')

            # Iterate over the rows of the DataFrame
            for index, row in df.iterrows():
                license_plate = row['license_plate_text']
                speed = row['speed_kmh']
                
                # Send a request to the desired endpoint
                response = requests.get('http://127.0.0.1:5000/transact', json={
                    'plateNumber': license_plate,
                    'speed': speed
                })
                print('Response 1 : ', response.json())
                response2 = requests.post('http://127.0.0.1:5000/createchallan', json={
                    'plateNumber': license_plate
                })
                print('Response 2 : ', response2.json())
                
                # Log the response (optional)
                print(f'Sent data: {{license_plate: {license_plate}, speed: {speed}}} - Response: {response.json()}')

                # Wait for 1 minute before sending the next request
                if index < len(df) - 1:  # Avoid sleep after the last request
                    time.sleep(25)

            return jsonify({"status": "All data processed successfully."}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    except:
        return jsonify({"status": "Data Fetch is Incompleted"})

if __name__ == '__main__':
    app.run(debug=True)