import mysql.connector
import numpy as np
from sklearn.preprocessing import MinMaxScaler

# Connect to the database
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",       # e.g., "localhost"
        user="root",   # e.g., "root"
        password="Imgemini",
        database="moonmovie-movie-service"  # e.g., "movies_db"
    )

# Fetch movie data
def fetch_movie_data():
    conn = get_db_connection()
    cursor = conn.cursor()

    # SQL query to get movieId, voteAverage, and genreName
    query = """
    SELECT m.id, m.vote_average, g.name
    FROM Movie m
    JOIN movie_genre mg ON m.id = mg.movie_id
    JOIN Genre g ON mg.genre_id = g.id;
    """
    
    cursor.execute(query)
    rows = cursor.fetchall()

    # Close connection
    cursor.close()
    conn.close()

    return rows

# Build movie vectors
def build_movie_vectors():
    # Fetch movie data
    rows = fetch_movie_data()
    
    # Extract unique genres
    genres = list({row[2] for row in rows})  # Create a set of unique genres and convert to list
    genre_to_index = {genre: idx for idx, genre in enumerate(genres)}  # Map genre to index

    # Create a dictionary to store movie information
    movie_dict = {}
    
    for row in rows:
        movieId, voteAverage, genreName = row
        if movieId not in movie_dict:
            movie_dict[movieId] = {
                "voteAverage": voteAverage,
                "genres": np.zeros(len(genres))  # Create a zeroed genre vector
            }
        # Set the corresponding genre index to 1
        movie_dict[movieId]["genres"][genre_to_index[genreName]] = 1

    # Normalize vote averages
    vote_averages = np.array([movie_dict[movieId]["voteAverage"] for movieId in movie_dict])
    scaler = MinMaxScaler()
    normalized_vote_averages = scaler.fit_transform(vote_averages.reshape(-1, 1))

    # Build movie vectors
    movie_vectors = {}
    
    for i, movieId in enumerate(movie_dict):
        # Concatenate normalized vote average with genre vector
        movie_vector = np.concatenate([movie_dict[movieId]["genres"], normalized_vote_averages[i]])
        movie_vectors[movieId] = movie_vector
    
    return movie_vectors, genre_to_index

# Example Usage
movie_vectors, genre_to_index = build_movie_vectors()

from flask import Flask, request, jsonify
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Function to compute cosine similarity between two vectors
def cosine_similarity(vec1, vec2):
    dot_product = np.dot(vec1, vec2)
    norm_vec1 = np.linalg.norm(vec1)
    norm_vec2 = np.linalg.norm(vec2)
    return dot_product / (norm_vec1 * norm_vec2)


def suggest_movies(movieId, movie_vectors, top_n=5):
    # Check if movieId exists in the movie_vectors dictionary
    if movieId not in movie_vectors:
        return f"Movie with ID {movieId} not found!"
    
    # Get the vector for the given movie
    target_vector = movie_vectors[movieId]

    # Compute similarity with all other movies
    similarity_scores = {}
    for other_movieId, other_vector in movie_vectors.items():
        if other_movieId != movieId:  # Skip the same movie
            similarity = cosine_similarity(target_vector, other_vector)
            similarity_scores[other_movieId] = similarity

    # Sort the movies by similarity score in descending order
    sorted_movies = sorted(similarity_scores.items(), key=lambda x: x[1], reverse=True)
    
    # Return the top N most similar movies
    return sorted_movies[:top_n]

from flask import Flask, request, jsonify
import py_eureka_client.eureka_client as eureka_client

rest_port = 5000
eureka_client.init(eureka_server="http://localhost:8761/eureka",
                   app_name="recommend-service",
                   instance_host="LAPTOP-AL04L3BE",
                   instance_port=rest_port)

app = Flask(__name__)

@app.route('/api/v2/moon-movie/recommend/<int:movieId>', methods=['GET'])
def suggest(movieId):
    try:
        # Get the top 5 similar movies (you can adjust top_n if needed)
        suggested_movies = suggest_movies(movieId, movie_vectors, top_n=5)
        
        # Return the results as JSON
        return jsonify({
            'movieId': movieId,
            'suggestions': suggested_movies
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port = rest_port)