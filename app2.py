from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

client = MongoClient("mongodb+srv://아이디:비밀번호@Cluster0.qvsvsek.mongodb.net/?retryWrites=true&w=majority")
db = client.dbsparta

app = Flask(__name__)


# 리뷰 작성 화면 (/review/write/화장실번호)
@app.route('/review/write/<toilet_num_receive>')
def review_write_page(toilet_num_receive):
    return render_template('review_write.html', toilet_num=toilet_num_receive)


# 리뷰 등록 API
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

    total_score = int(cleanliness_receive) + int(accessibility_receive) + int(equipment_receive)
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
        db.toilet_review.insert_one(review)

    except:
        print(review)
        return jsonify({'msg': '리뷰 등록에 실패했습니다.'})

    else:
        print(review)
        return jsonify({'msg': '리뷰 등록이 완료되었습니다.'})


# 리뷰 ID 구현을 위한 함수
def get_next_sequence():
    ret = db.toilet_review_counter.find_one_and_update(
        {"_id": "review_id"},
        {"$inc": {"seq": 1}},
        new=True
    )
    return ret['seq']


if __name__ == '__main__':
    app.run('0.0.0.0', port=8000, debug=True)
