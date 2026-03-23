import numpy as np
import os

def generate_synthetic_data(width=100, height=100):
    """
    Generates a pseudo-satellite image with 4 bands (Blue, Green, Red, NIR).
    Classes -> 0: Background, 1: Rice, 2: Wheat, 3: Sugarcane
    """
    y_true = np.zeros((width, height), dtype=np.int32)
    
    # Assign basic regions for different crops
    y_true[10:40, 10:40] = 1 # Rice
    y_true[50:90, 10:45] = 2 # Wheat
    y_true[15:85, 55:90] = 3 # Sugarcane
    
    # Base noise
    X = np.random.rand(width, height, 4) * 0.1 
    
    # Spectral signatures approximated for Blue, Green, Red, NIR
    X[y_true == 1] += np.array([0.1, 0.2, 0.1, 0.6]) # Rice
    X[y_true == 2] += np.array([0.1, 0.15, 0.2, 0.5]) # Wheat
    X[y_true == 3] += np.array([0.1, 0.3, 0.1, 0.8]) # Sugarcane
    X[y_true == 0] += np.array([0.2, 0.2, 0.3, 0.3]) # Background (e.g. soil/urban)
    
    # Add some gaussian noise
    X += np.random.normal(0, 0.05, X.shape)
    # Clip values to valid reflectance range [0, 1]
    X = np.clip(X, 0, 1)
    
    return X, y_true

def compute_ndvi(X):
    """
    Computes NDVI from multispectral array.
    Assuming X has shape (..., 4) where channel 2 is Red and 3 is NIR
    NDVI = (NIR - Red) / (NIR + Red)
    """
    red = X[..., 2]
    nir = X[..., 3]
    ndvi = (nir - red) / (nir + red + 1e-8)
    return ndvi

if __name__ == "__main__":
    X, y = generate_synthetic_data()
    print("Generated Synthetic Data with shape:", X.shape)
    
