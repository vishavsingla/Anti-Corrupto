import threading
import cv2
import easyocr
import time

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

    # Calculate the distance moved between the last two positions
    x1, y1 = positions[-2][:2]
    x2, y2 = positions[-1][:2]
    pixel_distance = ((x2 - x1)**2 + (y2 - y1)**2) ** 0.5

    # Calculate speed (pixels/frame)
    speed = pixel_distance * fps  # Conversion factor can be added here if needed
    return speed

def process_and_read_plate(img, count, reader):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    bfilter = cv2.bilateralFilter(gray, 9, 75, 75)  # Noise reduction
    filename = f"plates/scaned_img_{count}.jpg"
    cv2.imwrite(filename, bfilter)

    output = reader.readtext(filename)
    if output:
        output_text = f'{output[0][1]}  -  '
        with open("./OCRText.txt", "a") as output_number:
            output_number.write(output_text)
        print(output[0][1])
    
    return img

def capture_and_process(cap, reader, plate_cascade, fps):
    count = 0
    detected_positions = []

    while True:
        start_time = time.time()
        success, img = cap.read()
        if not success:
            break

        detected_plate, new_positions = detect_license_plate(img, plate_cascade)
        
        if new_positions:
            detected_positions.append(new_positions[-1])

        if detected_plate is not None:
            threading.Thread(target=process_and_read_plate, args=(detected_plate, count, reader)).start()
            count += 1

        speed = calculate_speed(detected_positions, fps)

        # Draw the box only if speed is calculated and greater than 0
        if detected_positions and speed is not None and speed > 0:
            last_position = detected_positions[-1]
            x, y, w, h = last_position
            cv2.putText(img, f"Speed: {speed:.2f} km/h", (x, y + h + 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)  # Draw moving box
            cv2.putText(img, "Tracking Box", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        cv2.imshow("Result", img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        # Wait to maintain FPS
        end_time = time.time()
        time_diff = end_time - start_time
        if time_diff < 1 / fps:
            time.sleep((1 / fps) - time_diff)

    cap.release()
    cv2.destroyAllWindows()

def main():
    plate_cascade = cv2.CascadeClassifier("model/haarcascade_russian_plate_number.xml")
    reader = easyocr.Reader(['en'], gpu=False)  # Use CPU for OCR
    cap = initialize_camera(640, 480)
    fps = 30  # Set your camera's FPS

    capture_and_process(cap, reader, plate_cascade, fps)

if __name__ == "__main__":
    main()
