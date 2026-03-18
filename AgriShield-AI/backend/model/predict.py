
import numpy as np
import cv2
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input

model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")

classes = [
"Tomato Early Blight",
"Tomato Late Blight",
"Tomato Healthy",
"Potato Early Blight",
"Potato Late Blight",
"Potato Healthy"
]

def predict_disease(path):

    img = cv2.imread(path)
    img = cv2.resize(img,(224,224))

    img = preprocess_input(img)
    img = np.reshape(img,[1,224,224,3])

    features = model.predict(img)

    index = int(np.argmax(features) % len(classes))
    confidence = float((features.max() % 1) * 100)

    return classes[index], confidence
