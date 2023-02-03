import certifi
from pymongo import MongoClient
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)

ca = certifi.where()

client = MongoClient('mongodb+srv://test:sparta@cluster0.eklfbrj.mongodb.net/?retryWrites=true&w=majority',
                     tlsCAFile=ca)
db = client.dbnature

# [조경현] 최초 랜딩페이지 (index.html)


@app.route('/')
def home():
    return render_template('index.html')

# [조경현] dbnature.test에 insert하는 POST 메서드


@app.route("/naturecallsme", methods=["POST"])
def homework_post():
    content_receive = request.form['content_give']

    doc = {
        'content': content_receive
    }

    db.test.insert_one(doc)

    return jsonify({'msg': '등록 완료!'})

# [조경현] 테스트용 로컬 json 파일 (서울 공공화장실 API)


@app.route('/data/toiletloc.json', methods=["GET"])
def get_toiletloc_json():
    return send_from_directory(app.static_folder, 'data/toiletloc.json', as_attachment=False)

# # [조정현] 리뷰 작성 화면 (/review/write/화장실번호)
# @app.route('/review/write/<toilet_num_receive>')
# def review_write_page(toilet_num_receive):
#     return render_template('review_write.html', toilet_num=toilet_num_receive)


@app.route('/review/write')
def write_review():
    return render_template('review/write/review_write.html')

# [test] 리뷰 등록 API
 @app.route("/api/review/write", methods=["POST"])
def review_post():
    review_id = get_next_sequence()

    toilet_num_receive = request.form['toilet_num_give']
    name_receive = request.form['name_give']
    password_receive = request.form['password_give']
    cleanliness_receive = request.form['cleanliness_give']
    accessibility_receive = request.form['accessibility_give']
    equipment_receive = request.form['equipment_give']
    text_receive = request.form['text_give']

    total_score = int(cleanliness_receive) + \
        int(accessibility_receive) + int(equipment_receive)
    overall_grade = round(total_score / 3, 2)

    review = {
        '_id': review_id,
        'is_deleted': 'no',
        'toilet_num': int(toilet_num_receive),
        'name': name_receive,
        'password': password_receive,
        'cleanliness': int(cleanliness_receive),
        'accessibility': int(accessibility_receive),
        'equipment': int(equipment_receive),
        'overall_grade': overall_grade,
        'text': text_receive,
    }

    try:
        db.test.insert_one(review)

    except:
        print(review)
        return jsonify({'msg': '리뷰 등록에 실패했습니다.'})

    else:
        print(review)
        return jsonify({'msg': '리뷰 등록이 완료되었습니다.'})


# # [조정현] 리뷰 등록 API
# @app.route("/api/review/write", methods=["POST"])
# def review_post():
#     review_id = get_next_sequence()

#     toilet_num_receive = request.form['toilet_num_give']
#     name_receive = request.form['name_give']
#     password_receive = request.form['password_give']
#     cleanliness_receive = request.form['cleanliness_give']
#     accessibility_receive = request.form['accessibility_give']
#     equipment_receive = request.form['equipment_give']
#     text_receive = request.form['text_give']

#     total_score = int(cleanliness_receive) + \
#         int(accessibility_receive) + int(equipment_receive)
#     overall_grade = round(total_score / 3, 2)

#     review = {
#         '_id': review_id,
#         'is_deleted': 'no',
#         'toilet_num': int(toilet_num_receive),
#         'name': name_receive,
#         'password': password_receive,
#         'cleanliness': int(cleanliness_receive),
#         'accessibility': int(accessibility_receive),
#         'equipment': int(equipment_receive),
#         'overall_grade': overall_grade,
#         'text': text_receive,
#     }

#     try:
#         db.toilet_review.insert_one(review)

#     except:
#         print(review)
#         return jsonify({'msg': '리뷰 등록에 실패했습니다.'})

#     else:
#         print(review)
#         return jsonify({'msg': '리뷰 등록이 완료되었습니다.'})


# [조정현] 리뷰 ID 구현을 위한 함수
def get_next_sequence():
    ret = db.toilet_review_counter.find_one_and_update(
        {"_id": "review_id"},
        {"$inc": {"seq": 1}},
        new=True
    )
    return ret['seq']


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
