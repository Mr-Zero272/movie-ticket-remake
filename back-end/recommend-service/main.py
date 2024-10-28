import mysql.connector
import numpy as np
from sklearn.preprocessing import MinMaxScaler

# Connect to the database
def get_db_connection(databaseName):
    return mysql.connector.connect(
        host="localhost",       # e.g., "localhost"
        user="root",   # e.g., "root"
        password="Imgemini",
        database=databaseName  # e.g., "movies_db"
    )
    
# Fetch movie data
def fetch_movie_data():
    conn = get_db_connection("moonmovie-movie-service")
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

# Function to compute cosine similarity between two vectors
def cosine_similarity_cus(vec1, vec2):
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
            similarity = cosine_similarity_cus(target_vector, other_vector)
            similarity_scores[other_movieId] = similarity

    # Sort the movies by similarity score in descending order
    sorted_movies = sorted(similarity_scores.items(), key=lambda x: x[1], reverse=True)
    
    # Return the top N most similar movies
    return sorted_movies[:top_n]

# Fetch movie tittle data
def fetch_movie_title_data():
    conn = get_db_connection("moonmovie-movie-service")
    cursor = conn.cursor()
    query = "SELECT title FROM movie"
    cursor.execute(query)
    rows = cursor.fetchall()
    
    # Close the cursor and connection
    cursor.close()
    conn.close()
    
    return rows

# Title data
movie_titles = fetch_movie_title_data()
movie_titles = [title[0] for title in movie_titles]

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

## Title data vector
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(movie_titles)


cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix);

def recommend_keywords(query):
    user_query_vectorized = vectorizer.transform([query])
    similarity_scores = cosine_similarity(user_query_vectorized, tfidf_matrix).flatten();
    # Get indices of top matches
    related_docs_indices = similarity_scores.argsort()[:-15:-1]
    
    # Get suggestions
    suggestions = [movie_titles[i] for i in related_docs_indices]
    return suggestions

    
from flask import Flask, request, jsonify
import py_eureka_client.eureka_client as eureka_client
from datetime import datetime

rest_port = 8086
eureka_client.init(eureka_server="http://localhost:8761/eureka",
                   app_name="recommend-service",
                   instance_host="LAPTOP-AL04L3BE",
                   instance_port=rest_port)

app = Flask(__name__)

@app.route('/api/v2/moon-movie/recommend/keywords/history', methods=['GET'])
def getHistoryKeywords():
    user_id = request.headers.get('user-id')
    query = "SELECT keyword FROM keyword WHERE user_id= %s ORDER BY created_at DESC"
    conn = get_db_connection("moonmovie-recommend-service")
    cursor = conn.cursor()
    cursor.execute(query, (user_id,))
    keywords = cursor.fetchall()
    results = []
    for kw in keywords:
        results.append(kw[0])

    
    # Close the cursor and connection
    cursor.close()
    conn.close()
    
    return jsonify(results)

@app.route('/api/v2/moon-movie/recommend/keywords', methods=['GET'])
def recommend():
    user_id = request.headers.get('user-id')
    user_input = request.args.get('query')
    # save history search keywords
    conn = get_db_connection("moonmovie-recommend-service")
    cursor = conn.cursor()
    query = "SELECT COUNT(*) FROM keyword WHERE user_id = %s"
    cursor.execute(query, (user_id,))
    keyword_count = cursor.fetchone()[0];
    
    if keyword_count >= 10:
        select_oldest_query ="""
            SELECT id FROM keyword
            WHERE user_id = %s
            ORDER BY created_at ASC
            LIMIT 1
        """
        cursor.execute(select_oldest_query, (user_id,))
        oldest_id_keyword = cursor.fetchone()[0]
        delete_query="""
        DELETE FROM keyword WHERE id = %s
        """
        
        cursor.execute(delete_query, (oldest_id_keyword,))
        
    
    same_keyword_count_query = "SELECT COUNT(*) FROM keyword WHERE user_id = %s AND keyword = %s"
    cursor.execute(same_keyword_count_query, (user_id, user_input))
    same_keyword_count = cursor.fetchone()[0];
    if same_keyword_count == 0:
        insert_query = """
        INSERT INTO keyword (keyword, user_id, created_at)
        VALUES(%s, %s, %s)
        """
        cursor.execute(insert_query, (user_input, user_id, datetime.now()))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    
    # return recommend keywords
    recommendations = recommend_keywords(user_input)
    return jsonify(recommendations)


@app.route('/api/v2/moon-movie/recommend/<int:movieId>', methods=['GET'])
def suggest(movieId):
    try:
        # Get the top 5 similar movies (you can adjust top_n if needed)
        suggested_movies = suggest_movies(movieId, movie_vectors, top_n=10)
        
        # Return the results as JSON
        return jsonify({
            'movieId': movieId,
            'suggestions': suggested_movies
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port = rest_port)
