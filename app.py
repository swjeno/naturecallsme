from flask import Flask, render_template, request, jsonify
app = Flask(__name__)
from pymongo import MongoClient
import certifi
ca = certifi.where()

client = MongoClient('mongodb+srv://test:sparta@cluster0.eklfbrj.mongodb.net/?retryWrites=true&w=majority',
                     tlsCAFile=ca)
db = client.dbnature

@app.route('/')
def home():
   return render_template('index.html')


@app.route("/naturecallsme", methods=["POST"])
def homework_post():
    content_receive = request.form['content_give']

    doc = {
        'content':content_receive
    }

    db.test.insert_one(doc)

    return jsonify({'msg':'등록 완료!'})

if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)

