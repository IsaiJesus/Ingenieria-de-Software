import joblib
import pandas as pd
import re
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet, stopwords
from flask import Flask, request, jsonify

print("Cargando artefactos de IA...")
try:
    PREPROCESSOR = joblib.load('./model_artifacts/preprocessor.pkl')
    MODEL = joblib.load('./model_artifacts/model.pkl')
    print("¡Modelos cargados exitosamente!")
except FileNotFoundError:
    print("Error: No se encontraron los archivos .pkl")
    PREPROCESSOR = None
    MODEL = None

lemmatizer = WordNetLemmatizer()
stop_words_set = set(stopwords.words('english'))
ACTION_VERBS = ['accomplished', 'managed', ...] 
SOFT_SKILLS = ['communication', 'teamwork', ...]

def count_words(text, word_list):
    count = 0
    clean_text = str(text).lower() 
    for word in word_list:
        count += clean_text.count(word)
    return count

def get_wordnet_pos(nltk_tag):
    if nltk_tag.startswith('J'):
        return wordnet.ADJ
    elif nltk_tag.startswith('V'):
        return wordnet.VERB
    elif nltk_tag.startswith('N'):
        return wordnet.NOUN
    elif nltk_tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN

def clean_and_process_resume(raw_text):
    text = str(raw_text).lower()
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = text.split(' ')
    tokens = [token for token in tokens if token]
    tokens = [token for token in tokens if token not in stop_words_set]
    pos_tags = nltk.pos_tag(tokens)
    lemmatized_tokens = [
        lemmatizer.lemmatize(word, get_wordnet_pos(tag)) 
        for word, tag in pos_tags
    ]
    return ' '.join(lemmatized_tokens)

# --- Inicializar Flask ---
app = Flask(__name__)

# --- Crear el Endpoint de Predicción ---
@app.route('/predict', methods=['POST'])
def predict():
    if not MODEL or not PREPROCESSOR:
        return jsonify({'error': 'Modelo no cargado'}), 500

    try:
        # --- Recibir Datos del backend de Node.js ---
        data = request.json
        raw_text = data['raw_text'] # Contenido del CV
        category = data['category'] # Titulo del puesto
        lang_test = data['language_test'] # Resultado de la prueba de idioma
        tech_test = data['technical_test'] # Resultado de la prueba técnica

        action_verbs = count_words(raw_text, ACTION_VERBS)
        soft_skills = count_words(raw_text, SOFT_SKILLS)
        resume_clean_text = clean_and_process_resume(raw_text)

        data_dict = {
            'resume_clean': [resume_clean_text],
            'category': [category.lower()],
            'language_test': [lang_test],
            'technical_test': [tech_test],
            'action_verbs_count': [action_verbs],
            'soft_skills_count': [soft_skills]
        }
        new_data_df = pd.DataFrame(data_dict)

        # --- Predecir ---
        X_processed = PREPROCESSOR.transform(new_data_df)
        prediction = MODEL.predict(X_processed)
        
        # Devolver el resultado (un 1 o 0)
        return jsonify({'ia_shortlisted': int(prediction[0])})

    except Exception as e:
        print(f"Error en la predicción: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5001, host='0.0.0.0')