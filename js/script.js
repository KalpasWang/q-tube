let nextPage = () => {};
let prevPage = () => {};

$(function () {
  const $searchForm = $('#search-form');
  const $searchField = $('#query');
  const $icon = $('#search-btn');
  const api_url = 'https://www.googleapis.com/youtube/v3/search';
  const api_key = 'AIzaSyAbVFIp6nJHyoHZm_ZI3fQzq9ztabFDTG4';

  // Searchbar Handler
  // Focus Event Handler
  $searchField.on('focus', function () {
    $(this).animate(
      {
        width: '100%',
      },
      400
    );
    $icon.animate(
      {
        left: '95%',
      },
      400
    );
  });

  // Blur Event Handler
  $searchField.on('blur', function () {
    if ($searchField.val() == '') {
      $(this).animate(
        {
          width: '45%',
        },
        400
      );
      $icon.animate(
        {
          left: '40%',
        },
        400
      );
    }
  });

  $searchForm.submit(function (e) {
    e.preventDefault();
    search();
  });

  function search() {
    // Clear Results
    $('#results').html('');
    $('#buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
      api_url,
      {
        part: 'snippet',
        q: q,
        type: 'video',
        key: api_key,
      },
      function (data) {
        var nextPageToken = data.nextPageToken;
        var prevPageToken = data.prevPageToken;

        // console.log(data);

        $.each(data.items, function (i, item) {
          // Get Output
          var output = getOutput(item);

          // Display Results
          $('#results').append(output);
        });

        var buttons = getButtons(prevPageToken, nextPageToken);

        // Display Buttons
        $('#buttons').append(buttons);
      }
    );
  }

  // Next Page Function
  nextPage = function () {
    var token = $('#next-button').data('token');
    var q = $('#next-button').data('query');

    // Clear Results
    $('#results').html('');
    $('#buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
      api_url,
      {
        part: 'snippet',
        q: q,
        pageToken: token,
        type: 'video',
        key: api_key,
      },
      function (data) {
        var nextPageToken = data.nextPageToken;
        var prevPageToken = data.prevPageToken;

        // console.log(data);

        $.each(data.items, function (i, item) {
          // Get Output
          var output = getOutput(item);

          // Display Results
          $('#results').append(output);
        });

        var buttons = getButtons(prevPageToken, nextPageToken);

        // Display Buttons
        $('#buttons').append(buttons);
      }
    );
  };

  // Prev Page Function
  prevPage = function () {
    var token = $('#prev-button').data('token');
    var q = $('#prev-button').data('query');

    // Clear Results
    $('#results').html('');
    $('#buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
      api_url,
      {
        part: 'snippet',
        q: q,
        pageToken: token,
        type: 'video',
        key: api_key,
      },
      function (data) {
        var nextPageToken = data.nextPageToken;
        var prevPageToken = data.prevPageToken;

        // console.log(data);

        $.each(data.items, function (i, item) {
          // Get Output
          var output = getOutput(item);

          // Display Results
          $('#results').append(output);
        });

        var buttons = getButtons(prevPageToken, nextPageToken);

        // Display Buttons
        $('#buttons').append(buttons);
      }
    );
  };

  // Build Output
  function getOutput(item) {
    var videoId = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var videoDate = getDate(item.snippet.publishedAt);

    // Build Output String
    var output =
      '<li>' +
      '<div class="list-left">' +
      '<img src="' +
      thumb +
      '">' +
      '</div>' +
      '<div class="list-right">' +
      '<h3><a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/' +
      videoId +
      '">' +
      title +
      '</a></h3>' +
      '<small>By <span class="cTitle">' +
      channelTitle +
      '</span> on ' +
      videoDate +
      '</small>' +
      '<p>' +
      description +
      '</p>' +
      '</div>' +
      '</li>' +
      '<div class="clearfix"></div>' +
      '';

    return output;
  }

  function getDate(isoDateString) {
    date = new Date(isoDateString);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }

    return year + '-' + month + '-' + dt;
  }

  // Build the buttons
  function getButtons(prevPageToken, nextPageToken) {
    if (!prevPageToken) {
      var btnoutput =
        '<div class="button-container">' +
        '<button id="next-button" class="paging-button" data-token="' +
        nextPageToken +
        '" data-query="' +
        q +
        '"' +
        'onclick="nextPage();">Next Page</button></div>';
    } else {
      var btnoutput =
        '<div class="button-container">' +
        '<button id="prev-button" class="paging-button" data-token="' +
        prevPageToken +
        '" data-query="' +
        q +
        '"' +
        'onclick="prevPage();">Prev Page</button>' +
        '<button id="next-button" class="paging-button" data-token="' +
        nextPageToken +
        '" data-query="' +
        q +
        '"' +
        'onclick="nextPage();">Next Page</button></div>';
    }

    return btnoutput;
  }
});
