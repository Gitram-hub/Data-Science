import streamlit as st
import pickle

# Load data
similarity = pickle.load(open('similarity.pkl', 'rb'))
movies_dict = pickle.load(open('movie_list.pkl', 'rb'))

movies_list = movies_dict['title'].values
new_df = movies_dict

def recommend(movie):
    movie_index = new_df[new_df['title'] == movie].index[0]
    distances = similarity[movie_index]
    movies_indices = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
    
    recommended_movies = [new_df.iloc[i[0]].title for i in movies_indices]
    return recommended_movies

# Streamlit UI
st.title("🎬 Movie Recommendation System")
st.write("Select a movie and get similar movie suggestions!")

option = st.selectbox("🎥 Choose a movie", movies_list)

if st.button("Recommend"):
    st.subheader("✨ Recommended Movies For You:")
    recommendations = recommend(option)

    # Display in columns (3 per row)
    cols = st.columns(3)

    for index, movie in enumerate(recommendations):
        with cols[index % 3]:
            st.markdown(
                f"""
                <div style="
                    background-color:#262730;
                    padding:10px;
                    border-radius:10px;
                    margin-bottom:10px;
                    box-shadow:0 4px 8px rgba(0,0,0,0.2);
                    text-align:center;
                    color:white;
                ">
                    <h4>{movie}</h4>
                </div>
                """,
                unsafe_allow_html=True
            )
