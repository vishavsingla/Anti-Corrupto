import pandas as pd

def filterDataSpeedAndNPD():
    # Load the CSV file
    df = pd.read_csv("output.csv")

    # Ensure 'license_plate_text' and 'speed_kmh' columns exist
    if 'license_plate_text' not in df.columns or 'speed_kmh' not in df.columns:
        raise ValueError("The CSV file must contain 'license_plate_text' and 'speed_kmh' columns.")

    # Filter rows where license_plate_text or speed_kmh are missing
    df_filtered = df.dropna(subset=['license_plate_text', 'speed_kmh'])

    # Remove spaces from the license plate text
    df_filtered['license_plate_text'] = df_filtered['license_plate_text'].apply(lambda x: str(x).replace(" ", ""))

    # Filter for number plates that start with "PB"
    df_filtered = df_filtered[df_filtered['license_plate_text'].str.startswith("PB")]

    # Remove duplicates, keeping the last occurrence for each license plate
    df_unique = df_filtered.drop_duplicates(subset=['license_plate_text'], keep='last')

    # Select only the 'license_plate_text' and 'speed_kmh' columns
    df_selected = df_unique[['license_plate_text', 'speed_kmh']]

    # Print the filtered DataFrame
    print(df_selected)

    # Save the filtered DataFrame to a new CSV file
    df_selected.to_csv("filtered_data_for_challan.csv", index=False)

# Call the function
filterDataSpeedAndNPD()
