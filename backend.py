from flask import Flask, render_template
import random

app = Flask(__name__)

words = [
    {'tamil': 'நாய்', 'english': 'dog'},
    {'tamil': 'பூனை', 'english': 'cat'},
    {'tamil': 'காகம்', 'english': 'crow'},
    # Add more words as needed
]

@app.route('/')
def index():
    random.shuffle(words)
    return render_template('index.html', words=words)

if __name__ == '__main__':
    app.run(debug=True)
