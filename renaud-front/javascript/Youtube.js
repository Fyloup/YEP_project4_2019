window.$ = window.jQuery = require('jquery');
let request = require('request');

window.api.receive("fromMain", (type, data) => {

  if (type === "page" && data.page === "Youtube") {
    let resultView = document.getElementById("result_view")
    document.getElementById("youtube_search_input").addEventListener('change', async function() {
    console.log(this.value);
    let query = this.value;
    let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=9&q=' + query + "&key=AIzaSyDuiEn0Ewl8E99QzYXVapkhxFA2puswZU4";
    request(url, function(error, info) {
      let data = JSON.parse(info.body);
      let i = 0;
      // $('#result_view').empty();
      resultView.innerHTML = ""
      for (i = 0; i != 8; i++) {
          drawResult(data.items[i], resultView);
      }
      document.getElementsByClassName("mini")[0].addEventListener("click", () => {
        let player = document.getElementById("player")
        let frame = document.createElement("iframe")

        player.innerHTML = ""
        frame.id = "player"
        frame.type = "text/html"
        frame.style.width = "1280px"
        frame.style.height = "720px"
        frame.src = "http://www.youtube.com/embed/" + this.getAttribute('vid_id') + "?enablejsapi=1&origin=http://example.com'frameborder='0'"
        player.appendChild(frame)
      })
      // $(".mini").on('click', function() {
      //   $('#player').empty();
      //   $('#player').append("<iframe id='player' type='text/html' width='1280' height='720' src='http://www.youtube.com/embed/" + this.getAttribute('vid_id') + "?enablejsapi=1&origin=http://example.com'frameborder='0'></iframe>");
      // });
    });
  });
  }
})

function drawResult(item, resultView) {
  let elem = document.createElement("img")
  elem.className = "mini"
  elem.style.border = "#c4302b"
  elem.style.margin = "3px"
  elem.style.height = "90px"
  elem.vid_id = item.id.videoId
  elem.src = item.snippet.thumbnails.medium.url
  resultView.appendChild(elem)
  // $('#result_view').append("<img style='border: #c4302b; margin: 3px' class='mini' vid_id='"+ item.id.videoId +"' src='" + item.snippet.thumbnails.medium.url + "' height='90' >");
};
