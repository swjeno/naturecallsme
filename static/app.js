// $(document).ready(function () {
//     var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
//     var options = { //지도를 생성할 때 필요한 기본 옵션
//         center: new kakao.maps.LatLng(37.566727, 126.978677), //지도의 중심좌표.
//         level: 3 //지도의 레벨(확대, 축소 정도)
//     };
//
//     var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
//
//     // 지도 이동 시 center 좌표 받아오기
//     kakao.maps.event.addListener(map, 'center_changed', function () {
//
//         // 지도의  레벨을 얻어옵니다
//         var level = map.getLevel();
//
//         // 지도의 중심좌표를 얻어옵니다
//         var latlng = map.getCenter();
//
//         var message = '<p>지도 레벨은 ' + level + ' 이고</p>';
//         message += '<p>중심 좌표는 위도 ' + latlng.getLat() + ', 경도 ' + latlng.getLng() + '입니다</p>';
//
//         var resultDiv = document.getElementById('result');
//         resultDiv.innerHTML = message;
//
//     });
// });

// geolocation API를 사용하여 현재 위치 얻어오기
function myLocation(callback) {
    navigator.geolocation.getCurrentPosition(function (position) {
            // 현재 위치의 위도와 경도
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            // 지도 표시
            var mapContainer = document.getElementById("map"),
                mapOption = {
                    center: new kakao.maps.LatLng(lat, lng),
                    level: 3,
                };

            var map = new kakao.maps.Map(mapContainer, mapOption);

            // 현재 위치에 마커 표시
            var marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng),
            });
            marker.setMap(map);

            let positions = [];

            $.ajax({
                type: "GET",
                url: "http://openapi.seoul.go.kr:8088/6b716f6a533439343237426a4d7a75/json/SearchPublicToiletPOIService/1/5/",
                data: {},
                success: function (response) {

                    var data = response["SearchPublicToiletPOIService"]["row"];
                    for (var i in data) {
                        var position = {};
                        position["FNAME"] = data[i]["FNAME"];
                        position["latlng"] = new kakao.maps.LatLng(data[i]["X_WGS84"], data[i]["Y_WGS84"]);
                        positions.push(position);
                    }
                    console.log(positions)
                },
            });

            var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

            for (var i = 0; i < positions.length; i++) {
                // 마커 이미지의 이미지 크기 입니다
                var imageSize = new kakao.maps.Size(24, 35);

                // 마커 이미지를 생성합니다
                var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

                // 마커를 생성합니다
                var marker = new kakao.maps.Marker({
                    map: map, // 마커를 표시할 지도
                    position: positions[i].latlng, // 마커를 표시할 위치
                    title: positions[i].FNAME, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                    image: markerImage // 마커 이미지
                });

            }

            // 지도 이동 시 center 좌표 받아오기
            kakao.maps.event.addListener(map, "drag", function () {
                // 지도의 중심좌표를 얻어옵니다
                var latlng = map.getCenter();

                var message = "<p>지도를 드래그 하고 있습니다</p>";
                message +=
                    "<p>중심 좌표는 위도 " +
                    latlng.getLat() +
                    ", 경도 " +
                    latlng.getLng() +
                    "입니다</p>";

                var resultDiv = document.getElementById("result");
                resultDiv.innerHTML = message;
            });
        }
    )
    ;
}

function toiletLoc(callback) {
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 마커를 표시할 위치와 title 객체 배열입니다
var positions = [
    {
        title: '카카오',
        latlng: new kakao.maps.LatLng(33.450705, 126.570677)
    },
    {
        title: '생태연못',
        latlng: new kakao.maps.LatLng(33.450936, 126.569477)
    },
    {
        title: '텃밭',
        latlng: new kakao.maps.LatLng(33.450879, 126.569940)
    },
    {
        title: '근린공원',
        latlng: new kakao.maps.LatLng(33.451393, 126.570738)
    }
];

// 마커 이미지의 이미지 주소입니다
var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

for (var i = 0; i < positions.length; i ++) {

    // 마커 이미지의 이미지 크기 입니다
    var imageSize = new kakao.maps.Size(24, 35);

    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: positions[i].latlng, // 마커를 표시할 위치
        title : positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image : markerImage // 마커 이미지
    });
}

}

function getcoords() {
    $.ajax({
        type: "GET",
        url: "http://openapi.seoul.go.kr:8088/6b716f6a533439343237426a4d7a75/json/SearchPublicToiletPOIService/1/5/",
        data: {},
        success: function (response) {
            let positions = [];
            var data = response["SearchPublicToiletPOIService"]["row"];
            for (var i in data) {
                var position = {};
                position["FNAME"] = data[i]["FNAME"];
                position["latlng"] = new kakao.maps.LatLng(data[i]["X_WGS84"], data[i]["Y_WGS84"]);
                positions.push(position);
            }
            console.log(positions)
        },
    });
}

function getJSON() {
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/data/toiletloc.json",
        data: {},
        success: function (response) {
            console.log(response["DATA"]);
        },
    });
}

// mongoDB에 POST 기능
function inputDB() {
    let content = $("#contentInput").val();

    $.ajax({
        type: "POST",
        url: "/naturecallsme",
        data: {content_give: content},
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        },
    });
}
