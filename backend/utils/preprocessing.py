"""
This file contains helper functions used for data preprocessing
in machine learning or deep learning models.

"""
import numpy as np
# Import MinMaxScaler to normalize data between a given range
from sklearn.preprocessing import MinMaxScaler


def scale_data(data):
    # Create a MinMaxScaler object that scales values to the range [0, 1]
    scaler = MinMaxScaler(feature_range=(0, 1))

    # Fit the scaler to the data and transform the data
    scaled = scaler.fit_transform(data)

    # Return the scaled data and the scaler object
    return scaled, scaler


def create_sequences(data, seq_length=60):
    """
    Converts time-series data into input-output sequences.
    """
    # List to store input sequences
    X = []
    # List to store output values (labels)
    y = []
    for i in range(seq_length, len(data)):
        # Take previous 'seq_length' values as input
        X.append(data[i-seq_length:i, 0])
        # Take the current value as the target output
        y.append(data[i, 0])
    # Convert lists into NumPy arrays before returning
    return np.array(X), np.array(y)
