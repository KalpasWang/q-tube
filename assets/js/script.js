let nextPage = () => {};
let prevPage = () => {};

$(function () {
  const $searchForm = $('#search-form');
  const $searchTrigger = $('#search-trigger');
  const $searchWrapper = $('#search-wrap');
  const $searchField = $('#query');
  const $searchBtn = $('#search-btn');
  const $results = $('#results');
  const $buttons = $('#buttons');
  const $loading = $('.loading');
  const api_url = 'https://www.googleapis.com/youtube/v3/search';
  const api_key = 'AIzaSyAbVFIp6nJHyoHZm_ZI3fQzq9ztabFDTG4';
  const api_params = {
    part: 'snippet',
    type: 'video',
    key: api_key,
    maxResults: 10,
  };

  // init fancybox
  $('.fancybox').fancybox();

  // Searchbar animation
  $searchWrapper.width(50);
  $searchWrapper.hide();
  $searchBtn.prop('disabled', true);

  $searchTrigger.click(function (e) {
    e.preventDefault();
    $(this).hide();
    $searchWrapper.show();
    $searchBtn.prop('disabled', false);
    $searchWrapper.animate(
      {
        width: $searchForm.width(),
      },
      250
    );
    setTimeout(() => {
      $searchField.focus();
    }, 250);
  });

  // Blur Event Handler
  $searchField.on('blur', function () {
    if ($searchField.val() == '') {
      $searchWrapper.animate(
        {
          width: '50px',
        },
        250
      );
      $searchBtn.prop('disabled', true);
      setTimeout(() => {
        $searchWrapper.hide();
        $searchTrigger.show();
      }, 250);
    }
  });

  $searchField.keydown(function (e) {
    if (e.key === 'Enter') {
      $searchForm.submit();
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
      const api_url2 = 'https://www.googleapis.com/youtube/v3/videos';
      const options = {
        part: 'statistics',
        key: api_key,
        id: item.id.videoId,
      };
      $.get(api_url2, options, (data) => {
        // console.log(data);
        const viewCount = data.items[0].statistics.viewCount || 0;
        // Get Output
        const output = getOutput({ ...item, viewCount });
        $results.append(output);
      });
    });

    const buttons = getButtons(prevPageToken, nextPageToken);
    $buttons.append(buttons);
    // Loading Animation
    $loading.addClass('complete');
    setTimeout(() => {
      $loading.removeClass('complete show');
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
    $.get(api_url, { ...api_params, q }, dataHandler);
  };

  // Next Page Function
  nextPage = function () {
    const pageToken = $('#next-button').data('token');
    const q = $('#next-button').data('query');

    init();
    $.get(
      api_url,
      {
        ...api_params,
        q,
        pageToken,
      },
      dataHandler
    );
  };

  // Prev Page Function
  prevPage = function () {
    const pageToken = $('#prev-button').data('token');
    const q = $('#prev-button').data('query');

    init();
    $.get(
      api_url,
      {
        ...api_params,
        q,
        pageToken,
      },
      dataHandler
    );
  };

  // Build Output
  function getOutput(item) {
    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const viewCount = item.viewCount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const description = item.snippet.description;
    const thumb = item.snippet.thumbnails.medium.url;
    const channelTitle = item.snippet.channelTitle;
    const videoDate = getDate(item.snippet.publishedAt);

    // Build Output String
    const output = `<li>
        <div class="list-left">
          <a href="https://www.youtube.com/embed/${videoId}" class="fancybox fancybox.iframe">
            <img src="${thumb}" alt="thumbnails">
          </a>
        </div>
        <div class="list-right">
          <h3>
            <a href="https://www.youtube.com/embed/${videoId}" class="fancybox fancybox.iframe">
              ${title}
            </a>
          </h3>
          <p class="subtitle">View: <span>${viewCount}  </span>．${videoDate}</p>
          <p class="cTitle">${channelTitle}</p>
          <p>${description}</p>
        </div>
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
