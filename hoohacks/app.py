import openai
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


openai.api_key = "INSERT_KEY_HERE"

def generate_recommendations(user_data):
    """
    Generate AI-driven planned parenthood locations near a city.
    """
    prompt = f"""
    Provide Planned Parenthood locations based on:
    - City: {user_data['city']}, {user_data['state']}

    Provide details such as:
    - Hours
    """

    try:
        print("Calling OpenAI API...")
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a real estate expert providing neighborhood recommendations."},
                {"role": "user", "content": prompt}
            ],
        )
        return response.choices[0].message['content'].strip()
    
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return "AI recommendations could not be generated due to an API error."



@app.route('/')
def home():
    return render_template('index.html')


@app.route('/recommend', methods=['POST'])
def recommend():
    user_data = request.json
    print("Received User Data:", user_data)


    ai_recommendations = generate_recommendations(user_data)
    print("Recommendations:", ai_recommendations)


    return jsonify({"ai_recommendations": ai_recommendations})


if __name__ == '__main__':
    app.run(debug=True)
