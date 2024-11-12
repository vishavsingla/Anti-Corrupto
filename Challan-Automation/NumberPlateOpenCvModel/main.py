import requests
import threading
import cv2
import easyocr
import time
import csv
import os

def initialize_camera(width, height):
    cap = cv2.VideoCapture(0)
    cap.set(3, width)  # Set width
    cap.set(4, height)  # Set height
    return cap

def detect_license_plate(img, plate_cascade, min_area=500):
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    plates = plate_cascade.detectMultiScale(img_gray, 1.1, 4)
    detected_positions = []

    for (x, y, w, h) in plates:
        area = w * h
        if area > min_area:
            img_roi = img[y: y + h, x:x + w]
            detected_positions.append((x, y, w, h))
            return img_roi, detected_positions
    return None, detected_positions

def calculate_speed(positions, fps):
    if len(positions) < 2:
        return None

    x1, y1 = positions[-2][:2]
    x2, y2 = positions[-1][:2]
    pixel_distance = ((x2 - x1)**2 + (y2 - y1)**2) ** 0.5

    return pixel_distance

def process_and_read_plate(img, count, reader):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    bfilter = cv2.bilateralFilter(gray, 9, 75, 75)  # Noise reduction
    filename = f"plates/scaned_img_{count}.jpg"
    cv2.imwrite(filename, bfilter)

    output = reader.readtext(filename)
    if output:
        license_text = output[0][1]
        print(license_text)
        return license_text
    return None

def save_to_csv(data, filename="../output.csv"):
    file_exists = os.path.isfile(filename)
    with open(filename, mode='a', newline='') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(["license_plate_text","speed_kmh"])  # Header
        writer.writerows(data)

def capture_and_process(cap, reader, plate_cascade, fps):
    count = 0
    detected_positions = []
    csv_data = []
    last_save_time = time.time()

    while True:
        start_time = time.time()
        success, img = cap.read()
        if not success:
            break

        detected_plate, new_positions = detect_license_plate(img, plate_cascade)
        
        if new_positions:
            detected_positions.append(new_positions[-1])

        if detected_plate is not None:
            license_text = process_and_read_plate(detected_plate, count, reader)
            if license_text:
                csv_data.append([license_text, None])  # Initial speed as None for now
            count += 1

        speed = calculate_speed(detected_positions, fps)
        
        if detected_positions and speed is not None and speed > 0:
            last_position = detected_positions[-1]
            x, y, w, h = last_position
            cv2.putText(img, f"Speed: {speed:.2f} km/h", (x, y + h + 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(img, "Tracking Box", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

            if csv_data and csv_data[-1][1] is None:  # Update speed for the last detected plate
                csv_data[-1][1] = speed

        cv2.imshow("Result", img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        if time.time() - last_save_time >= 10:
            save_to_csv(csv_data)

            response = requests.get('http://127.0.0.1:5000/generatechallans')
            csv_data = []
            last_save_time = time.time()

        end_time = time.time()
        time_diff = end_time - start_time
        if time_diff < 1 / fps:
            time.sleep((1 / fps) - time_diff)

    if csv_data:
        save_to_csv(csv_data)  # Save any remaining data
    cap.release()
    cv2.destroyAllWindows()

def main():
    plate_cascade = cv2.CascadeClassifier("model/haarcascade_russian_plate_number.xml")
    reader = easyocr.Reader(['en'], gpu=False)
    cap = initialize_camera(640, 480)
    fps = 30

    capture_and_process(cap, reader, plate_cascade, fps)

if __name__ == "__main__":
    main()
