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
        var mapContainer = document.getElementById('map'),
            mapOption = {
                center: new kakao.maps.LatLng(lat, lng),
                level: 3
            };

        var map = new kakao.maps.Map(mapContainer, mapOption);

        // 현재 위치에 마커 표시
        var marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lat, lng)
        });
        marker.setMap(map);

        // var clusterer = new kakao.maps.MarkerClusterer({
        //     map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
        //     averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        //     minLevel: 6 // 클러스터 할 최소 지도 레벨
        // });
        //
        // // 데이터를 가져와 마커를 생성하고 클러스터러 객체에 넘겨줍니다
        // $.get("/data/toiletloc.json", function (data) {
        //     // 데이터에서 좌표 값을 가지고 마커를 표시합니다
        //     // 마커 클러스터러로 관리할 마커 객체는 생성할 때 지도 객체를 설정하지 않습니다
        //     var markers = $(data.positions).map(function (i, position) {
        //         return new kakao.maps.Marker({
        //             position: new kakao.maps.LatLng(position.lat, position.lng)
        //         });
        //     });
        //
        //     // 클러스터러에 마커들을 추가합니다
        //     clusterer.addMarkers(markers);
        // });

        // 지도 이동 시 center 좌표 받아오기
        kakao.maps.event.addListener(map, 'drag', function () {

            // 지도의 중심좌표를 얻어옵니다
            var latlng = map.getCenter();

            var message = '<p>지도를 드래그 하고 있습니다</p>';
            message += '<p>중심 좌표는 위도 ' + latlng.getLat() + ', 경도 ' + latlng.getLng() + '입니다</p>';

            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = message;

        });
    });
}

function getcoords() {
    $.ajax({
        url: "http://localhost:5000/data/toiletloc.json",
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response["DATA"][0]["x_wgs84"])
            }
    })
}

// mongoDB에 POST 기능
function inputDB() {
    let content = $('#contentInput').val()

    $.ajax({
        type: "POST",
        url: "/naturecallsme",
        data: {content_give: content},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}