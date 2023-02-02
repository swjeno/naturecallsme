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

$(document).ready(function () {
  const mapContainer = document.getElementById('map'); // 지도를 표시할 div 
  let mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 3 // 지도의 확대 레벨 
  };

  const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

  function toiletLoc(callback) {

    //geolocation API 시작
    navigator.geolocation.getCurrentPosition(function (position) {

      var lat = position.coords.latitude, // 위도
        lon = position.coords.longitude; // 경도

      var locPosition = new kakao.maps.LatLng(lat, lon) // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

      // 지도 중심좌표를 접속위치로 변경합니다
      map.setCenter(locPosition);

      // 마커와 인포윈도우를 표시합니다
      console.log(locPosition)

      // addr2coord 를 활용해 공공화장실 API 에서 도로명주소 필드명을 for문 돌리고 wgx84좌표 수집 -> 지도에 marker 표시

    });

    //테스트용 화장실 좌표정보 API ajax GET
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
})




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
    data: { content_give: content },
    success: function (response) {
      alert(response["msg"]);
      window.location.reload();
    },
  });
}
