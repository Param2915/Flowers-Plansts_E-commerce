from flask import Flask, request, jsonify
import pandas as pd
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)

# Load plant dataset from CSV
plants = pd.read_csv("plants.csv")

# One-hot encode categorical features for plants
plant_features = pd.get_dummies(plants[["light", "maintenance", "purpose", "environment"]])
plant_model = NearestNeighbors(n_neighbors=3)
plant_model.fit(plant_features)

# Load flower dataset from CSV
flowers = pd.read_csv("flowers.csv")

# One-hot encode categorical features for flowers
flower_features = pd.get_dummies(flowers[["occasion", "color", "type", "size"]])
flower_model = NearestNeighbors(n_neighbors=3)
flower_model.fit(flower_features)

@app.route('/api/recommend_plants', methods=['POST'])
def recommend_plants():
    data = request.get_json()

    # Ensure all required fields are present in the request
    required_fields = ['light', 'maintenance', 'purpose', 'environment']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing required fields. Expected fields: {', '.join(required_fields)}."}), 400

    input_df = pd.DataFrame([data])
    input_encoded = pd.get_dummies(input_df).reindex(columns=plant_features.columns, fill_value=0)

    distances, indices = plant_model.kneighbors(input_encoded)

    if len(indices[0]) == 0:
        return jsonify({"error": "No similar plants found."}), 404

    recommendations = plants.iloc[indices[0]].to_dict(orient="records")
    return jsonify(recommendations)

@app.route('/api/recommend_flowers', methods=['POST'])
def recommend_flowers():
    data = request.get_json()

    # Extract the 'occasion' from input data to prioritize it
    occasion_input = data.get('occasion', None)

    # If the occasion is missing, return a message
    if not occasion_input:
        return jsonify({"error": "Occasion is required"}), 400

    # Filter flowers based on the given occasion
    flowers_for_occasion = flowers[flowers['occasion'] == occasion_input]

    if flowers_for_occasion.empty:
        return jsonify({"error": f"No flowers found for the occasion: {occasion_input}"}), 404

    # If there are flowers matching the occasion, apply the recommendation model
    flower_features_for_occasion = pd.get_dummies(flowers_for_occasion[["occasion", "color", "type", "size"]])

    input_df = pd.DataFrame([data])
    input_encoded = pd.get_dummies(input_df).reindex(columns=flower_features.columns, fill_value=0)

    # Find nearest neighbors based on the features
    distances, indices = flower_model.kneighbors(input_encoded)

    if len(indices[0]) == 0:
        return jsonify({"error": "No similar flowers found."}), 404

    # Retrieve the recommended flowers for that occasion
    recommendations = flowers_for_occasion.iloc[indices[0]].to_dict(orient="records")
    
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)











# from flask import Flask, request, jsonify
# import pandas as pd
# from sklearn.neighbors import NearestNeighbors

# app = Flask(__name__)

# # Load dataset from CSV
# plants = pd.read_csv("plants.csv")

# # One-hot encode categorical features
# features = pd.get_dummies(plants[["light", "maintenance", "purpose", "environment"]])
# model = NearestNeighbors(n_neighbors=3)
# model.fit(features)

# @app.route('/api/recommend', methods=['POST'])
# def recommend():
#     data = request.get_json()

#     input_df = pd.DataFrame([data])
#     input_encoded = pd.get_dummies(input_df).reindex(columns=features.columns, fill_value=0)

#     distances, indices = model.kneighbors(input_encoded)

#     recommendations = plants.iloc[indices[0]].to_dict(orient="records")
#     return jsonify(recommendations)

# if __name__ == '__main__':
#     app.run(debug=True)
