window.api.receive("fromMain", (type, data) => {

  let resultView = document.getElementById("result_view")
  if (type === "page" && data.page === "Youtube") {
    document.getElementById("youtube_search_input").addEventListener('change', async function() {
      console.log(this.value);
      let query = this.value;
      let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=9&q=' + query + "&key=AIzaSyDuiEn0Ewl8E99QzYXVapkhxFA2puswZU4";
      window.api.send("toMain", "DoRequest", url)
    });
  }
  if (type === "answer") {
    console.log("data: ", data)
    let source = JSON.parse(data.info);
    let i = 0;
    resultView.innerHTML = ""
    for (i = 0; i != 8; i++) {
        drawResult(source.items[i], resultView, i);
    }
  }
})

const playVid = (id) => {
  let player = document.getElementById("player")
  let frame = document.createElement("iframe")

  player.innerHTML = ""
  frame.id = "player"
  frame.type = "text/html"
  frame.style.width = "1280px"
  frame.style.height = "720px"
  // frame.src = "http://www.youtube.com/embed/" + this.getAttribute('vid_id') + "?enablejsapi=1&origin=http://example.com'frameborder='0'"
  frame.src = "http://www.youtube.com/embed/" + id + "?enablejsapi=1&origin=http://example.com'frameborder='0'"
  player.appendChild(frame)
}

function drawResult(item, resultView, idx) {
  let elem = document.createElement("img")
  elem.id = "video-" + idx
  elem.className = "mini"
  elem.style.border = "#c4302b"
  elem.style.margin = "3px"
  elem.style.height = "90px"
  elem.vid_id = item.id.videoId
  elem.src = item.snippet.thumbnails.medium.url
  elem.addEventListener("click", () => {playVid(elem.vid_id)})
  resultView.appendChild(elem)
  // $('#result_view').append("<img style='border: #c4302b; margin: 3px' class='mini' vid_id='"+ item.id.videoId +"' src='" + item.snippet.thumbnails.medium.url + "' height='90' >");
};