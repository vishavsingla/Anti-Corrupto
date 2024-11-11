import matplotlib.pyplot as plt
import easyocr
import cv2


def initialize_camera(width, height):
    cap = cv2.VideoCapture(0)
    cap.set(3, width)  # Set width
    cap.set(4, height)  # Set height
    return cap

def detect_license_plate(img, min_area=500):
    plate_cascade = cv2.CascadeClassifier("model/haarcascade_russian_plate_number.xml")
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    plates = plate_cascade.detectMultiScale(img_gray, 1.1, 4)

    for (x, y, w, h) in plates:
        area = w * h
        if area > min_area:
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(img, "Number Plate", (x, y - 5), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (255, 0, 255), 2)
            img_roi = img[y: y + h, x:x + w]
            return img_roi
    return None

def process_and_read_plate(img, count, reader):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    bfilter = cv2.bilateralFilter(gray, 11, 17, 17)  # Noise reduction
    cv2.imwrite(f"plates/scaned_img_{count}.jpg", bfilter)

    concatstringg = f'./plates/scaned_img_{count}.jpg'
    output = reader.readtext(concatstringg)

    output_number = open("./OCRText.txt", "a")
    output_text = f'{output[0][1]}  -  '
    output_number.write(output_text)
    output_number.close()

    print(output[0][1])
    return img

def main():
    cap = initialize_camera(640, 480)
    count = 0
    reader = easyocr.Reader(['en'])

    while True:
        success, img = cap.read()

        detected_plate = detect_license_plate(img)

        if detected_plate is not None:
            processed_img = process_and_read_plate(detected_plate, count, reader)
            cv2.imshow("Results", processed_img)
            cv2.waitKey(500)  # Adjust this delay if needed

        cv2.imshow("Result", img)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
