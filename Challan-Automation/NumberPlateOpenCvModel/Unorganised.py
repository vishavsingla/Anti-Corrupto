import string
import matplotlib.pyplot as plt
import easyocr
import cv2

harcascade = "model/haarcascade_russian_plate_number.xml"

cap = cv2.VideoCapture(0)

cap.set(3, 640)  # width
cap.set(4, 480)  # height

min_area = 500
count = 0

# OCR
reader = easyocr.Reader(['en'])

while True:
    success, img = cap.read()

    plate_cascade = cv2.CascadeClassifier(harcascade)
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    plates = plate_cascade.detectMultiScale(img_gray, 1.1, 4)

    for (x, y, w, h) in plates:
        area = w * h

        if area > min_area:
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(img, "Number Plate", (x, y - 5), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (255, 0, 255), 2)

            img_roi = img[y: y + h, x:x + w]
            
            # OCR processing
            gray = cv2.cvtColor(img_roi, cv2.COLOR_BGR2GRAY)
            bfilter = cv2.bilateralFilter(gray, 11, 17, 17)  # Noise reduction
            
            # Saving the plate image
            cv2.imwrite("plates/scaned_img_" + str(count) + ".jpg", bfilter)

            # OCR recognition
            concatstringg = './plates/scaned_img_' + str(count) + ".jpg"
            output = reader.readtext(concatstringg)
            outputNumber = open("./OCRText.txt", "a")
            outputText = (output[0][1] + "  -  ")
            outputNumber.write(outputText)
            outputNumber.close()
            print(output[0][1])
            count += 1

            cv2.waitKey(1000)  

    cv2.imshow("Result", img)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
