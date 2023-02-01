import certifi
from pymongo import MongoClient
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)

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
        'content': content_receive
    }

    db.test.insert_one(doc)

    return jsonify({'msg': '등록 완료!'})


@app.route('/data/<string:filename>')
def get_data(filename):
    try:
        with open(f'static/data/toiletloc.json', 'r') as json_file:
            data = json_file.read()
            return jsonify(data)
    except exception as e:
        return f'Error: {e}'


@app.route('/data/toiletloc.json', methods=["GET"])
def get_toiletloc_json():
    return send_from_directory(app.static_folder, 'data/toiletloc.json', as_attachment=False)


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
