let nextPage = () => {};
let prevPage = () => {};

$(function () {
  const $searchForm = $('#search-form');
  const $searchField = $('#query');
  const $searchWrapper = $('#search-wrap');
  const $results = $('#results');
  const $buttons = $('#buttons');
  const $loading = $('.loading');
  const $monster = $('.monster');
  const api_url = 'https://www.googleapis.com/youtube/v3/search';
  const api_key = 'AIzaSyAbVFIp6nJHyoHZm_ZI3fQzq9ztabFDTG4';

  // init fancybox
  $('.fancybox').fancybox();

  // Searchbar Handler
  // Focus Event Handler
  $searchField.on('focus', function () {
    $searchWrapper.animate(
      {
        width: $searchForm.width(),
      },
      400
    );
  });

  // Blur Event Handler
  $searchField.on('blur', function () {
    if ($searchField.val() == '') {
      $searchWrapper.animate(
        {
          width: '250px',
        },
        400
      );
    }
  });

  $searchForm.submit(function (e) {
    e.preventDefault();
    search();
  });

  const dataHandler = (data) => {
    const nextPageToken = data.nextPageToken;
    const prevPageToken = data.prevPageToken;

    // console.log(data);
    $.each(data.items, function (i, item) {
      // Get Output
      const output = getOutput(item);
      $results.append(output);
    });

    const buttons = getButtons(prevPageToken, nextPageToken);
    $buttons.append(buttons);
    $loading.addClass('complete');
    setTimeout(() => {
      $monster.addClass('disappers');
    }, 50);
    setTimeout(() => {
      $loading.removeClass('complete show');
      $monster.removeClass('disappers');
    }, 550);
  };

  const init = () => {
    $results.html('');
    $buttons.html('');
    $loading.addClass('show');
  };

  const search = () => {
    init();

    // Get Form Input
    q = $searchField.val();

    // Run GET Request on API
    $.get(
      api_url,
      {
        part: 'snippet',
        q: q,
        type: 'video',
        key: api_key,
      },
      dataHandler
    );
  };

  // Next Page Function
  nextPage = function () {
    const token = $('#next-button').data('token');
    const q = $('#next-button').data('query');

    init();

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
      dataHandler
    );
  };

  // Prev Page Function
  prevPage = function () {
    const token = $('#prev-button').data('token');
    const q = $('#prev-button').data('query');

    init();

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
      dataHandler
    );
  };

  // Build Output
  function getOutput(item) {
    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const description = item.snippet.description;
    const thumb = item.snippet.thumbnails.high.url;
    const channelTitle = item.snippet.channelTitle;
    const videoDate = getDate(item.snippet.publishedAt);

    // Build Output String
    const output = `<li>
        <div class="list-left"><img src="${thumb}" alt="thumbnails"></div>
        <div class="list-right">
          <h3>
            <a href="https://www.youtube.com/embed/${videoId}" class="fancybox fancybox.iframe">
              ${title}
            </a>
          </h3>
          <p class="subtitle">By <span class="cTitle">${channelTitle}</span>
          on ${videoDate}</p>
          <p>${description}</p>
        </div>
        <div class="clearfix"></div>
      </li>`;

    return output;
  }

  function getDate(isoDateString) {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }

    return `${year}-${month}-${dt}`;
  }

  // Build the buttons
  function getButtons(prevPageToken, nextPageToken) {
    let btnOutput = `<button
          class="paging-button"
          id="next-button"
          data-token="${nextPageToken}"
          data-query="${q}"
          onclick="nextPage()"
        >Next</button>`;

    if (prevPageToken) {
      btnOutput = `<button
            class="paging-button"
            id="prev-button"
            data-token="${prevPageToken}"
            data-query="${q}"
            onclick="prevPage()"
          >Prev</button>
          ${btnOutput}`;
    }

    return btnOutput;
  }
});
