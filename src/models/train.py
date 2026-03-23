import os
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from src.data.mock_gee import generate_synthetic_data, compute_ndvi

MODEL_DIR = os.path.join(os.path.dirname(__file__), "weights")
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "rf_model.pkl")

def train_model():
    print("Generating synthetic satellite imagery...")
    X_train_img, y_train_img = generate_synthetic_data(150, 150)
    X_test_img, y_test_img = generate_synthetic_data(50, 50)
    
    # Flatten images into pixel arrays
    def extract_features(X_img):
        # Calculate NDVI
        ndvi = compute_ndvi(X_img)
        # Stack all bands + NDVI
        features = np.concatenate([X_img, ndvi[..., np.newaxis]], axis=-1)
        # Reshape to (number_of_pixels, features)
        return features.reshape(-1, 5)

    print("Extracting features (Bands + NDVI)...")
    X_train = extract_features(X_train_img)
    y_train = y_train_img.flatten()
    
    X_test = extract_features(X_test_img)
    y_test = y_test_img.flatten()
    
    print("Training Random Forest Classifier...")
    clf = RandomForestClassifier(n_estimators=50, random_state=42)
    clf.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=["Background", "Rice", "Wheat", "Sugarcane"])
    
    print(f"Accuracy: {acc:.4f}")
    print("Classification Report:\n", report)
    
    # Save model
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(clf, f)
    print(f"Model saved to {MODEL_PATH}")
    
    return acc, report

def load_model():
    if not os.path.exists(MODEL_PATH):
        train_model()
    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)

if __name__ == "__main__":
    train_model()
