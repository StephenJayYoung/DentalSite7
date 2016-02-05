loader.js(function () {

    var parentSrc;
    var scripts = document.getElementsByTagName("script");
    for (i = 0; i < scripts.length; i++) {
        if (scripts[i].src.indexOf('/reviews/loader.js') != -1) {
            parentSrc = scripts[i].src;
        }
    }
    // get the host name that this script came from
    var hostName = parentSrc.substring(parentSrc.indexOf('//')+2, parentSrc.indexOf('/reviews/loader.js'));

    function ajax(options) {
        var xmlhttp;
        // code for IE7+, Firefox, Chrome, Opera, Safari
        if (window.XDomainRequest) {
            xmlhttp = new window.XDomainRequest();
            xmlhttp.onload = function() {
                options.success(xmlhttp.responseText);
            }

            // IE behaves better with XDR if all handlers are set (http://stackoverflow.com/questions/5250256/inconsistent-ajax-xdr-response-from-ie)
            var noop = function() {
                return;
            }
            xmlhttp.onerror = noop;
            xmlhttp.ontimeout = noop;
            xmlhttp.onprogress = noop;
        } else if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                options.success(xmlhttp.responseText);
            }
        }

        xmlhttp.open("GET", options.url, true);
        xmlhttp.send();
    }

    var WidgetClass = function(data) {
        var self = this;
        self.id = data.id;
        self.divId = data.reviewDivId;
        self.seoFriendlyName = data.seoFriendlyName;
        // default to dark template
        self.template = data.template || 'dark';

        self.$ = null;

        function getFirstScriptElement() {
            return document.getElementsByTagName('script')[0];
        }

        function createScriptTag(url) {
            var element = document.createElement('script');
            element.type = 'text/javascript';
            element.async = "true";
            element.src = url;
            return element;
        }

        function loadScript(url, callback) {

            var script = createScriptTag(url);

            if (script.readyState) { //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else { //Others
                script.onload = function () {
                    callback();
                };
            }

            var firstScriptElement = getFirstScriptElement();
            firstScriptElement.parentNode.insertBefore(script, firstScriptElement);
        }

        function populateStats(stats) {
            if (stats.averageRating >= 4 && stats.recommendationRate >= 85) {
                self.$('#rating-header-1').show();
                self.$('.rating-group').attr('data-rating-value', stats.averageRating);
                self.$('.review-count').text("("+stats.count+")");
                self.$('.recommendation-rate').attr('data-recommendation-rate', stats.recommendationRate);
                self.$('.recommendation-rate').text(stats.recommendationRate + "% Would Recommend");
            } else {
                self.$('#rating-header-2').show();
            }
        }

        function populateReviews(reviews) {
            var seoNameString = self.seoFriendlyName ? self.seoFriendlyName + "/" : "";
            self.$('#rab-link').attr('href', 'http://www.rateabiz.com/reviews/' + seoNameString + self.id + '/summary');

            self.$('.reviews-list').empty();
            var index = 0;
            for (index = 0; index < reviews.length; ++index) {
                var review = reviews[index];
                var $reviewItem = self.$('<div/>', {
                    "class": 'list-item',
                    "data-review-id": review.id
                });
                if (index == 0) {
                    $reviewItem.addClass('first');
                }
                if (index == review.length - 1) {
                    $reviewItem.addClass('last');
                }

                var $ratingGroup = self.$('\
                <ul class="rating-group"> \
                    <li class="rating-item"><span class="icon-star">*</span></li> \
                    <li class="rating-item"><span class="icon-star">*</span></li> \
                    <li class="rating-item"><span class="icon-star">*</span></li> \
                    <li class="rating-item"><span class="icon-star">*</span></li> \
                    <li class="rating-item last"><span class="icon-star">*</span></li> \
                </ul>');
                $ratingGroup.attr('data-rating-value', review.rating);
                $reviewItem.append($ratingGroup);

                if (review.title) {
                    $reviewItem.append('<p class="review-title">'+review.title+'</p>');
                }
                $reviewItem.append('<p class="review-body">'+review.text+'</p>');

                var reviewerName = review.authorFirstName;
                if (review.authorLastName) {
                    reviewerName = reviewerName + " " + review.authorLastName.charAt(0) + ".";
                }
                var reviewDate = review.createdDate.month + "/" + review.createdDate.day + "/" + review.createdDate.year;
                $reviewItem.append('\
                <p class="reviewer-info"> \
                - <span class="reviewer-name">' + reviewerName + '</span> \
                    <span class="review-date">' + reviewDate + '</span> \
                </p>');

                self.$('.reviews-list').append($reviewItem);
            }
        }

        function initWidget(widget) {
            ajax({
                url: "//"+ hostName + "/reviews/" + self.id + "/reviews.json",
                success: function (data) {
                    var reviewData = JSON.parse(data);
                    if (reviewData.reviews.length > 0) {
                        self.$("#" + self.divId).append(widget);
                        populateStats(reviewData.stats);
                        populateReviews(reviewData.reviews);
                        self.$('.rating-group').each(function () {
                            populateRatingGroup(self.$(this));
                        });
                        initReviewBody();
                    }
                }
            });
        }

        function initReviewBody(){
            self.$('.reviews-list .list-item').each(function(){
                var $title = self.$(this).find('.review-title'),
                    $body = self.$(this).find('.review-body'),
                    fullTitleText = $title.text(),
                    fullBodyText = $body.text(),
                    truncatedTitleText,
                    truncatedBodyText,
                    $link = self.$('<span class="link">'),
                    isLinkDisplayed = false;

                if (fullTitleText.length > 30) {
                    truncatedTitleText = fullTitleText.slice(0, 30).split(" ").slice(0, -1).join(" ") + "..."
                    $title.text(truncatedTitleText);
                    isLinkDisplayed = true;
                }

                if (fullBodyText.length > 90) {
                    truncatedBodyText = fullBodyText.slice(0, 89).split(" ").slice(0, -1).join(" ") + "..."
                    $body.text(truncatedBodyText);
                    isLinkDisplayed = true;
                }

                if(isLinkDisplayed) {
                    $link.text("More").addClass('expand');
                    $body.append($link);
                }

                $body.on('click', '.expand', function(){
                    $link.removeClass('expand').text('Less').addClass('hide');
                    $title.text(fullTitleText);
                    $body.text(fullBodyText).append($link);
                });

                $body.on('click', '.hide', function(){
                    $link.removeClass('hide').text('More').addClass('expand');
                    $title.text(truncatedTitleText);
                    $body.text(truncatedBodyText).append($link);
                });
            });
        }

        function populateRatingGroup($ratingGroup) {
            var ratingValue = $ratingGroup.attr('data-rating-value'),
                integerPart = Math.floor(ratingValue),
                decimalPart = ratingValue - integerPart;

            var $ratingItems = $ratingGroup.find('.rating-item');

            for (var i=0; i<integerPart; i++){
                $ratingItems.eq(i).find('.icon-star').addClass('on');
            }

            if (decimalPart>0) {
                var $halfStarItem = $ratingItems.eq(integerPart).find('.icon-star'),
                    $halfStarWrapper = self.$('<span class="icon-star-bg">*</span>');
                //Adding half star
                $halfStarItem.addClass('half');

                var roundedWidth = parseInt(decimalPart/0.25)
                roundedWidth = (decimalPart % 0.25) > 0.125?(roundedWidth+1):roundedWidth;
                roundedWidth = roundedWidth * 25;

                $halfStarItem.css('width', roundedWidth + "%");

                $halfStarItem.wrap($halfStarWrapper);
            }
        }

        this.appendElements = function() {
            loadScript("//" + hostName + "/js/jIsland.min.js", function() {
                jIsland("1.10.2", function(jq) {
                    self.$ = jq;
                    ajax({
                        url: "//" + hostName + "/reviews/widget_" + self.template + ".html",
                        success: initWidget
                    })
                });
            });
        };
    };

    var InitWrapper = function (widget) {
        var self = this;
        this.widget = widget;

        this.completed = function () {
            document.removeEventListener('DOMContentLoaded', self.completed);
            window.removeEventListener('load', self.completed);
            self.widget.appendElements();
        }
    };

    var WidgetLoaderQ = function() {
        this.push = function(data) {
            var widget = new WidgetClass(data);
            loadWidget(widget);
        };

        function loadWidget(widget) {
            if (document.readyState === 'complete') {
                widget.appendElements();
            }
            else {
                var initWrapper = new InitWrapper(widget);
                document.addEventListener('DOMContentLoaded', initWrapper.completed);
                window.addEventListener('load', initWrapper.completed);
            }
        }
    };

    var origQ = window._rab_review_q || [];
    var newQ = new WidgetLoaderQ();
    for (var i=0; i < origQ.length; i++) {
        newQ.push(origQ[i]);
    }
    window._rab_review_q = newQ;

})();