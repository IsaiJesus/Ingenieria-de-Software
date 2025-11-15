import joblib
import pandas as pd
import re
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet, stopwords
from flask import Flask, request, jsonify

import matplotlib.pyplot as plt
import numpy as np
import os
from dotenv import load_dotenv
import sys
from supabase import create_client, Client
import unicodedata

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
BUCKET_NAME = "plots"

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
ACTION_VERBS = [
    'accomplished', 'accelerated', 'achieved', 'acted', 'added', 'adapted', 
    'addressed', 'administered', 'advised', 'allocated', 'analyzed', 
    'appraised', 'approved', 'arbitrated', 'arranged', 'assembled', 
    'assessed', 'assigned', 'assisted', 'attained', 'audited', 'authored', 
    'balanced', 'broadened', 'budgeted', 'built', 'calculated', 'cataloged', 
    'centralized', 'chaired', 'changed', 'clarified', 'classified', 'coached', 
    'collaborated', 'collected', 'communicated', 'compiled', 'completed', 
    'composed', 'computed', 'conceived', 'conceptualized', 'concluded', 
    'conducted', 'consolidated', 'constructed', 'contracted', 'controlled', 
    'convinced', 'coordinated', 'corresponded', 'counseled', 'created', 
    'critiqued', 'customized', 'defined', 'delegated', 'delivered', 
    'demonstrated', 'demystified', 'derived', 'designed', 'determined', 
    'developed', 'devised', 'diagnosed', 'directed', 'discovered', 
    'dispatched', 'documented', 'drafted', 'earned', 'edited', 'educated', 
    'enabled', 'encouraged', 'energized', 'engineered', 'enhanced', 
    'enlisted', 'established', 'evaluated', 'examined', 'executed', 
    'expanded', 'expedited', 'explained', 'extracted', 'fabricated', 
    'facilitated', 'familiarized', 'fashioned', 'forecasted', 'formed', 
    'formulated', 'founded', 'gained', 'gathered', 'generated', 'goals', 
    'guided', 'handled', 'headed', 'illustrated', 'impacted', 'implemented', 
    'improved', 'increased', 'influenced', 'informed', 'initiated', 
    'inspected', 'installed', 'instituted', 'instructed', 'integrated', 
    'interpreted', 'interviewed', 'introduced', 'invented', 'investigated', 
    'launched', 'led', 'lectured', 'liaised', 'maintained', 'managed', 
    'marketed', 'mastered', 'maximized', 'mediated', 'minimized', 'modeled', 
    'moderated', 'monitored', 'motivated', 'negotiated', 'operated', 
    'optimized', 'orchestrated', 'organized', 'originated', 'overhauled', 
    'oversaw', 'participated', 'performed', 'persuaded', 'planned', 
    'predicted', 'prepared', 'presented', 'prioritized', 'processed', 
    'produced', 'programmed', 'projected', 'promoted', 'proposed', 
    'provided', 'proved', 'publicized', 'purchased', 'reconciled', 
    'recorded', 'recruited', 'redesigned', 'reduced', 'referred', 
    'regulated', 'rehabilitated', 'reinforced', 'remodeled', 'reorganized', 
    'repaired', 'reported', 'represented', 'researched', 'resolved', 
    'retrieved', 'reviewed', 'revised', 'revitalized', 'rewrote', 
    'scheduled', 'screened', 'selected', 'served', 'set', 'shaped', 
    'simplified', 'sold', 'solved', 'spearheaded', 'specified', 'spoke', 
    'standardized', 'steered', 'stimulated', 'streamlined', 'strengthened', 
    'structured', 'studied', 'suggested', 'summarized', 'supervised', 
    'supported', 'surpassed', 'surveyed', 'synthesized', 'systematized', 
    'tabulated', 'taught', 'tested', 'trained', 'translated', 'unified', 
    'updated', 'upgraded', 'utilized', 'validated', 'verbalized', 
    'verified', 'visualized', 'wrote'
]
SOFT_SKILLS = [
    'adaptability', 'collaboration', 'communication', 'creativity', 
    'critical thinking', 'decision-making', 'detail-oriented', 'empathy', 
    'flexibility', 'initiative', 'interpersonal', 'leadership', 
    'management', 'mentoring', 'motivated', 'negotiation', 'organization', 
    'patience', 'persuasion', 'planning', 'problem solving', 'proactive', 
    'resourceful', 'teamwork', 'time management'
]

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

def sanitize_filename(name):
    # Quita acentos
    s = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode('utf-8')
    # Reemplaza espacios
    s = s.replace(' ', '_')
    # Elimina caracteres no válidos (se queda con letras, números, _, .)
    s = re.sub(r'[^\w.-]', '', s)
    return s.lower()    

def generar_grafica_radar(nombre_empleado, info_contexto, ratings_dict, ruta_guardado):
    keys = [
        "Eficiencia",
        "Resolución de Problemas",
        "Trabajo en Equipo",
        "Puntualidad",
        "Calidad del Trabajo"
    ]
    
    labels = [
        "Eficiencia",
        "Resolución de\nProblemas", 
        "Trabajo en Equipo",
        "Puntualidad",
        "Calidad del\nTrabajo"
    ]
    
    calificaciones = [ratings_dict[key] for key in keys]
    N = len(keys)
    
    angulos = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
    calificaciones += calificaciones[:1]
    angulos += angulos[:1]
    
    fig, ax = plt.subplots(figsize=(7, 7), subplot_kw=dict(polar=True))
    ax.set_ylim(0, 5)
    ax.set_rgrids([1, 2, 3, 4, 5], color="grey", alpha=0.4, size=9)
    ax.set_rlabel_position(0)
    ax.set_xticks(angulos[:-1])
    ax.set_xticklabels(labels, size=11)
    ax.tick_params(colors='black', size=10)
    
    ax.plot(angulos, calificaciones, color='#007bff', linewidth=2, linestyle='solid', marker='o')
    ax.fill(angulos, calificaciones, color='#007bff', alpha=0.25)
    
    fig.suptitle(f"{nombre_empleado}", size=16, color='black', weight='bold')
    subtitulo = (
        f"Edad: {info_contexto['age']}  |  "
        f"Género: {info_contexto['gender']}  |  "
        f"Periodo: {info_contexto['period']}"
    )
    ax.set_title(subtitulo, size=11, color='gray', pad=20) 
    
    fig.tight_layout(rect=[0, 0.03, 1, 0.90]) 
    
    plt.savefig(ruta_guardado, dpi=100)
    plt.close(fig)
    print(f"Gráfica temporal guardada en: {ruta_guardado}")

@app.route('/generate-graph', methods=['POST'])
def generate_graph():
    try:
        data = request.json
        
        employee_name = data['employee_name']
        context_info = data['context_info'] # <- 'contextInfo'
        ratings_dict = data['ratings_dict'] # <- 'ratings'

        sanitized_name = sanitize_filename(employee_name)
        temp_file_name = f"eval_{sanitized_name}.png"

        # Definir rutas de archivos
        # (Guardamos en la misma carpeta de la app)
        temp_file_path = os.path.join(os.path.dirname(__file__), temp_file_name)
        
        # Generar la gráfica
        generar_grafica_radar(employee_name, context_info, ratings_dict, temp_file_path)

        # Subir a Supabase
        print(f"Subiendo {temp_file_path} a Supabase bucket: {BUCKET_NAME}...")
        file_options = {
            "cache-control": "3600", 
            "upsert": "true",
            "content-disposition": f"attachment; filename=\"{temp_file_name}\"",
            "content_type": "image/png"
        }
        with open(temp_file_path, 'rb') as f:
            supabase.storage.from_(BUCKET_NAME).upload(
                file=f,
                path=temp_file_name,
                file_options=file_options # 'upsert: true' sobrescribe
            )
        
        # Obtener la URL pública
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(temp_file_name)
        print(f"URL Pública: {public_url}")

        # Limpiar archivo temporal
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            print(f"Archivo temporal {temp_file_path} eliminado.")

        # Devolver la URL a Node.js
        return jsonify({'plot_link': public_url})

    except Exception as e:
        print(f"Error en /generate-graph: {e}")
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(port=5001, host='0.0.0.0')