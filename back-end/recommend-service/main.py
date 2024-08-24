import mysql.connector

conn = mysql.connector.connect(
    host="localhost",       # e.g., "localhost"
    user="root",   # e.g., "root"
    password="Imgemini",
    database="moonmovie-movie-service"  # e.g., "movies_db"
)

# Create a cursor object
cursor = conn.cursor()

# Define the SQL query
query = "SELECT title FROM movie"

# Execute the query
cursor.execute(query)

# Fetch all results
movie_titles = cursor.fetchall()

movie_titles = [title[0] for title in movie_titles]

# Close the cursor and connection
cursor.close()
conn.close()

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(movie_titles)


cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix);

def recommend_keywords(query):
    user_query_vectorized = vectorizer.transform([query])
    similarity_scores = cosine_similarity(user_query_vectorized, tfidf_matrix).flatten();
    # Get indices of top matches
    related_docs_indices = similarity_scores.argsort()[:-8:-1]
    
    # Get suggestions
    suggestions = [movie_titles[i] for i in related_docs_indices]
    return suggestions

    
from flask import Flask, request, jsonify
import py_eureka_client.eureka_client as eureka_client

rest_port = 5000
eureka_client.init(eureka_server="http://localhost:8761/eureka",
                   app_name="recommend-service",
                   instance_host="LAPTOP-AL04L3BE",
                   instance_port=rest_port)

app = Flask(__name__)

@app.route('/api/v2/moon-movie/recommend', methods=['GET'])
def recommend():
    user_input = request.args.get('query')
    recommendations = recommend_keywords(user_input)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port = rest_port)
