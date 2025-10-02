import streamlit as st
import pickle

similarity = pickle.load(open('simlarity.pkl', 'rb'))
movies_dict = pickle.load(open('movies.pkl', 'rb'))
movies_list = movies_dict['title'].values
new_df = movies_dict

def recommend(movie):
    movie_index = new_df[new_df['title'] == movie].index[0]
    distances = similarity[movie_index]
    movies_indices = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
    
    recommended_movies = [new_df.iloc[i[0]].title for i in movies_indices]
    return recommended_movies

st.title('Movies Recommended System')

option = st.selectbox("Choose a movie", movies_list)
st.write("You selected:", option)

if st.button("Recommend"):
    recommendations = recommend(option)
    for movie in recommendations:
        st.write(movie)
