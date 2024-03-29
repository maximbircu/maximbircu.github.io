jQuery(document).ready(function($) {
  /* jQuery RSS - https://github.com/sdepold/jquery-rss */
  $('#rss-feeds').rss(
      //Change this to your own rss feeds
      "http://feeds.feedburner.com/TechCrunch/startups",

      {
        // how many entries do you want?
        // default: 4
        // valid values: any integer
        limit: 3,

        // the effect, which is used to let the entries appear
        // default: 'show'
        // valid values: 'show', 'slide', 'slideFast', 'slideSynced', 'slideFastSynced'
        effect: 'slideFastSynced',

        // outer template for the html transformation
        // default: "<ul>{entries}</ul>"
        // valid values: any string
        layoutTemplate: "<div class='item'>{entries}</div>",

        // inner template for each entry
        // default: '<li><a href="{url}">[{author}@{date}] {title}</a><br/>{shortBodyPlain}</li>'
        // valid values: any string
        entryTemplate: '<h3 class="title"><a href="{url}" target="_blank">{title}</a></h3><div><p>{shortBodyPlain}</p><a class="more-link" href="{url}" target="_blank"><i class="fa fa-external-link"></i>Read more</a></div>'
      }
  );

  triggerOpenAnimation = function(elementClass) {
    let el = $('.' + elementClass + '-open');
    el.addClass(elementClass + '-close');
    el.removeClass(elementClass + '-open');
  };

  $('.contact-me-btn, .post-link').click(function(event) {
    event.preventDefault();
    let url = $(this).attr('href');
    triggerOpenAnimation('heading-wrapper');
    triggerOpenAnimation('sections-wrapper');
    setTimeout(function() {
      window.open(url, '_self');
    }, 400);
  });
});
