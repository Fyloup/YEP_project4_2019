window.$ = window.jQuery = require('jquery');
let request = require('request');

function drawResult(item) {
  $('#result_view').append("<img style='border: #c4302b; margin: 3px' class='mini' vid_id='"+ item.id.videoId +"' src='" + item.snippet.thumbnails.medium.url + "' height='90' >");
};
$('#youtube_search_input').on('change', async function() {
    console.log(this.value);
    let query = this.value;
  let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=9&q=' + query + "&key=AIzaSyDuiEn0Ewl8E99QzYXVapkhxFA2puswZU4";
  request(url, function(error,info) {
    let data = JSON.parse(info.body);
    let i = 0;
    $('#result_view').empty();
    for (i = 0; i != 8; i++) {
        drawResult(data.items[i]);
    }
    $(".mini").on('click', function() {
      $('#player').empty();
      $('#player').append("<iframe id='player' type='text/html' width='1280' height='720' src='http://www.youtube.com/embed/" + this.getAttribute('vid_id') + "?enablejsapi=1&origin=http://example.com'frameborder='0'></iframe>");
    });
  });
});
