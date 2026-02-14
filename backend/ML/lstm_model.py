# Import Sequential model class from Keras
from tensorflow.keras.models import Sequential

# Import LSTM and Dense layers from Keras
from tensorflow.keras.layers import LSTM, Dense

# Define a function to create an LSTM model
def create_lstm(input_shape):
    # Create a sequential neural network
    model = Sequential([
        # First LSTM layer with 64 units, returns full sequence for next LSTM
        LSTM(64, return_sequences=True, input_shape=input_shape),
        
        # Second LSTM layer with 32 units, returns final output
        LSTM(32),
        
        # Dense layer with 1 unit, produces the final prediction
        Dense(1)
    ])
    
    # Compile the model with Adam optimizer and mean squared error loss
    model.compile(optimizer="adam", loss="mse")
    
    # Return the compiled model
    return model
