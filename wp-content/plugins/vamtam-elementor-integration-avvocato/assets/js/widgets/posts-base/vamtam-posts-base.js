// Default JS handler for posts widget. We add it to posts/archive-posts for our custom skin (vamtam_classic).
var defaultPosts = elementorModules.frontend.handlers.Base.extend({
	getSkinPrefix() {
	  return 'vamtam_classic_';
	},

	bindEvents() {
	  var cid = this.getModelCID();
	  elementorFrontend.addListenerOnce(cid, 'resize', this.onWindowResize);
	},

	getClosureMethodsNames() {
	  return elementorModules.frontend.handlers.Base.prototype.getClosureMethodsNames.apply(this, arguments).concat(['fitImages', 'onWindowResize', 'runMasonry']);
	},

	getDefaultSettings() {
	  return {
		classes: {
		  fitHeight: 'elementor-fit-height',
		  hasItemRatio: 'elementor-has-item-ratio'
		},
		selectors: {
		  postsContainer: '.elementor-posts-container',
		  post: '.elementor-post',
		  postThumbnail: '.elementor-post__thumbnail',
		  postThumbnailImage: '.elementor-post__thumbnail img'
		}
	  };
	},

	getDefaultElements() {
	  var selectors = this.getSettings('selectors');
	  return {
		$postsContainer: this.$element.find(selectors.postsContainer),
		$posts: this.$element.find(selectors.post)
	  };
	},

	fitImage($post) {
	  var settings = this.getSettings(),
		  $imageParent = $post.find(settings.selectors.postThumbnail),
		  $image = $imageParent.find('img'),
		  image = $image[0];

	  if (!image) {
		return;
	  }

	  var imageParentRatio = $imageParent.outerHeight() / $imageParent.outerWidth(),
		  imageRatio = image.naturalHeight / image.naturalWidth;
	  $imageParent.toggleClass(settings.classes.fitHeight, imageRatio < imageParentRatio);
	},

	fitImages() {
	  var $ = jQuery,
		  self = this,
		  itemRatio = getComputedStyle(this.$element[0], ':after').content,
		  settings = this.getSettings();
	  this.elements.$postsContainer.toggleClass(settings.classes.hasItemRatio, !!itemRatio.match(/\d/));

	  if (self.isMasonryEnabled()) {
		return;
	  }

	  // Update posts.
	  this.elements.$posts = this.elements.$postsContainer.find( settings.selectors.post );
	  this.elements.$posts.each(function () {
		var $post = $(this),
			$image = $post.find(settings.selectors.postThumbnailImage);
		self.fitImage($post);
		$image.on('load', function () {
		  self.fitImage($post);
		});
	  });
	},

	setColsCountSettings() {
	  var currentDeviceMode = elementorFrontend.getCurrentDeviceMode(),
		  settings = this.getElementSettings(),
		  skinPrefix = this.getSkinPrefix(),
		  colsCount;

	  switch (currentDeviceMode) {
		case 'mobile':
		  colsCount = settings[skinPrefix + 'columns_mobile'];
		  break;

		case 'tablet':
		  colsCount = settings[skinPrefix + 'columns_tablet'];
		  break;

		default:
		  colsCount = settings[skinPrefix + 'columns'];
	  }

	  this.setSettings('colsCount', colsCount);
	},

	isMasonryEnabled() {
	  return !!this.getElementSettings(this.getSkinPrefix() + 'masonry');
	},

	initMasonry() {
	  imagesLoaded(this.elements.$posts, this.runMasonry);
	},

	runMasonry() {
	  var elements = this.elements;
	  elements.$posts.css({
		marginTop: '',
		transitionDuration: ''
	  });
	  this.setColsCountSettings();
	  var colsCount = this.getSettings('colsCount'),
		  hasMasonry = this.isMasonryEnabled() && colsCount >= 2;
	  elements.$postsContainer.toggleClass('elementor-posts-masonry', hasMasonry);

	  if (!hasMasonry) {
		elements.$postsContainer.height('');
		return;
	  }
	  /* The `verticalSpaceBetween` variable is setup in a way that supports older versions of the portfolio widget */


	  var verticalSpaceBetween = this.getElementSettings(this.getSkinPrefix() + 'row_gap.size');

	  if ('' === this.getSkinPrefix() && '' === verticalSpaceBetween) {
		verticalSpaceBetween = this.getElementSettings(this.getSkinPrefix() + 'item_gap.size');
	  }

	  var masonry = new elementorModules.utils.Masonry({
		container: elements.$postsContainer,
		items: elements.$posts.filter(':visible'),
		columnsCount: this.getSettings('colsCount'),
		verticalSpaceBetween
	  });
	  masonry.run();
	},

	run() {
	  // For slow browsers
	  setTimeout(this.fitImages, 0);
	  this.initMasonry();
	},

	onInit() {
	  elementorModules.frontend.handlers.Base.prototype.onInit.apply(this, arguments);
	  this.bindEvents();
	  this.run();
	},

	onWindowResize() {
	  this.fitImages();
	  this.runMasonry();
	},

	onElementChange() {
	  this.fitImages();
	  setTimeout(this.runMasonry);
	}
});

class VamtamLoadMore extends elementorModules.frontend.handlers.Base {
    getDefaultSettings() {
        return {
            selectors: {
                postsContainer: '.elementor-posts-container',
                loadMoreButton: '.elementor-button',
                loadMoreSpinnerWrapper: '.e-load-more-spinner',
                loadMoreSpinner: '.e-load-more-spinner i, .e-load-more-spinner svg',
                loadMoreAnchor: '.e-load-more-anchor'
            },
            classes: {
                loadMoreSpin: 'eicon-animation-spin',
                loadMoreIsLoading: 'e-load-more-pagination-loading',
                loadMorePaginationEnd: 'e-load-more-pagination-end',
                loadMoreNoSpinner: 'e-load-more-no-spinner'
            }
        };
    }

    getDefaultElements() {
        const selectors = this.getSettings('selectors');
        return {
            postsWidgetWrapper: this.$element[0],
            postsContainer: this.$element[0].querySelector(selectors.postsContainer),
            loadMoreButton: this.$element[0].querySelector(selectors.loadMoreButton),
            loadMoreSpinnerWrapper: this.$element[0].querySelector(selectors.loadMoreSpinnerWrapper),
            loadMoreSpinner: this.$element[0].querySelector(selectors.loadMoreSpinner),
            loadMoreAnchor: this.$element[0].querySelector(selectors.loadMoreAnchor)
        };
    }

    bindEvents() {
        super.bindEvents(); // Handle load more functionality for on-click type.

        if (!this.elements.loadMoreButton) {
            return;
        }

        this.elements.loadMoreButton.addEventListener('click', event => {
            if (this.isLoading) {
                return;
            }

            event.preventDefault();
            this.handlePostsQuery();
        });
    }

    onInit() {
        super.onInit();
        this.classes = this.getSettings('classes');
        this.isLoading = false;
        const paginationType = this.getElementSettings('pagination_type');

        if ('load_more_on_click' !== paginationType && 'load_more_infinite_scroll' !== paginationType) {
            return;
        }

        this.isInfinteScroll = 'load_more_infinite_scroll' === paginationType; // When spinner is not available, the button's text should not be hidden.

        this.isSpinnerAvailable = this.getElementSettings('load_more_spinner').value;

        if (!this.isSpinnerAvailable) {
            this.elements.postsWidgetWrapper.classList.add(this.classes.loadMoreNoSpinner);
        }

        if (this.isInfinteScroll) {
            this.handleInfiniteScroll();
        } else if (this.elements.loadMoreSpinnerWrapper && this.elements.loadMoreButton) {
            // Instead of creating 2 spinners for on-click and infinity-scroll, one spinner will be used so it should be appended to the button in on-click mode.
            this.elements.loadMoreButton.insertAdjacentElement('beforeEnd', this.elements.loadMoreSpinnerWrapper);
        } // Set the post id and element id for the ajax request.


        this.elementId = this.getID();
        this.postId = elementorFrontendConfig.post.id; // Set the current page and last page for handling the load more post and when no more posts to show.

        if (this.elements.loadMoreAnchor) {
            this.currentPage = parseInt(this.elements.loadMoreAnchor.getAttribute('data-page'));
            this.maxPage = parseInt(this.elements.loadMoreAnchor.getAttribute('data-max-page'));

            if (this.currentPage === this.maxPage || !this.currentPage) {
                this.handleUiWhenNoPosts();
            }
        }
    } // Handle load more functionality for infinity-scroll type.

    handleInfiniteScroll() {
        if (this.isEdit) {
            return;
        }

        this.observer = elementorModules.utils.Scroll.scrollObserver({
            callback: event => {
                if (!event.isInViewport || this.isLoading) {
                    return;
                } // When the observer is triggered it won't be triggered without scrolling, but sometimes there will be no scrollbar to trigger it again.


                this.observer.unobserve(this.elements.loadMoreAnchor);
                this.handlePostsQuery().then(() => {
                    if (this.currentPage !== this.maxPage) {
                        this.observer.observe(this.elements.loadMoreAnchor);
                    }
                });
            }
        });
        this.observer.observe(this.elements.loadMoreAnchor);
    }

    handleUiBeforeLoading() {
        this.isLoading = true;

        if (this.elements.loadMoreSpinner) {
            this.elements.loadMoreSpinner.classList.add(this.classes.loadMoreSpin);
        }

        this.elements.postsWidgetWrapper.classList.add(this.classes.loadMoreIsLoading);
    }

    handleUiAfterLoading() {
        this.isLoading = false;

        if (this.elements.loadMoreSpinner) {
            this.elements.loadMoreSpinner.classList.remove(this.classes.loadMoreSpin);
        }

        if (this.isInfinteScroll && this.elements.loadMoreSpinnerWrapper && this.elements.loadMoreAnchor) {
            // Since the spinner has to be shown after the new content (posts), it should be appended after the anchor element.
            this.elements.loadMoreAnchor.insertAdjacentElement('afterend', this.elements.loadMoreSpinnerWrapper);
        }

        this.elements.postsWidgetWrapper.classList.remove(this.classes.loadMoreIsLoading);
    }

    handleUiWhenNoPosts() {
        this.elements.postsWidgetWrapper.classList.add(this.classes.loadMorePaginationEnd);
    }

    handleSuccessFetch(result) {
        this.handleUiAfterLoading(); // Grabbing only the new articles from the response without the existing once (prevent posts duplication).

        const posts = result.querySelectorAll(`[data-id="${this.elementId}"] .elementor-posts-container > article`);
        const nextPageUrl = result.querySelector('.e-load-more-anchor').getAttribute('data-next-page'); // Converting HTMLCollection to an Array and iterate it.

        const postsHTML = [...posts].reduce((accumulator, post) => {
            return accumulator + post.outerHTML;
        }, '');
        this.elements.postsContainer.insertAdjacentHTML('beforeend', postsHTML);
        this.elements.loadMoreAnchor.setAttribute('data-page', this.currentPage);
        this.elements.loadMoreAnchor.setAttribute('data-next-page', nextPageUrl);

        if (this.currentPage === this.maxPage) {
            this.handleUiWhenNoPosts();
        }

		// Trigger a resize so fitImages() is called with the new posts.
		setTimeout( () => {
			jQuery( window ).trigger( 'resize' );
		}, 10 );
    }

    handlePostsQuery() {
        this.handleUiBeforeLoading();
        this.currentPage++;
        const nextPageUrl = new URL( this.elements.loadMoreAnchor.getAttribute('data-next-page') );
        nextPageUrl.searchParams.set( 'vamtam_posts_fetch', 1 );

		return fetch( nextPageUrl.toString() ).then(response => response.text()).then(html => {
            // Convert the HTML string into a document object
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            this.handleSuccessFetch(doc);
        }).catch(err => {
            console.warn('Something went wrong.', err);
        });
    }

}

class VamtamPostsBase extends elementorModules.frontend.handlers.Base {
    getDefaultSettings() {
        return {
            selectors: {
                postsContainer: '.elementor-posts-container',
            }
        };
    }

    getDefaultElements() {
        const selectors = this.getSettings('selectors');
        return {
            postsContainer: this.$element[0].querySelector(selectors.postsContainer),
        };
    }

    onInit() {
        super.onInit();
		this.handleTitleUnderlineAnimation();
    }

	handleTitleUnderlineAnimation() {
		const isTouchDevice = window.VAMTAM.CUSTOM_ANIMATIONS.VamtamCustomAnimations.utils.isTouchDevice();

		// We don't want to add the navigation on touch devices.
		if ( isTouchDevice ) {
			return;
		}

		if ( ! this.$element.hasClass( 'vamtam-has-title-underline-anim' ) ) {
			return;
		}

		// Add class on hover to trigger the animation.
		jQuery( this.$element ).on( 'mouseenter', '.elementor-post__title a', (e) => {
			const $el = jQuery( e.target );

			if ( $el.hasClass( 'hovered' ) ) {
				return;
			}

			$el.addClass( 'hovered' );

			// This timeout is used as a guard to avoid flickering caused by very fast chnages of hover state.
			setTimeout(() => {
				$el.removeClass( 'hovered' );
			}, 600 );
		} );
	}
}

jQuery( window ).on( 'elementor/frontend/init', () => {
	if ( !elementorFrontend.elementsHandler || !elementorFrontend.elementsHandler.attachHandler ) {
		const addHandler = ( $element ) => {
			elementorFrontend.elementsHandler.addHandler( defaultPosts, {
				$element,
			} );
		};

		elementorFrontend.hooks.addAction( 'frontend/element_ready/posts.vamtam_classic', addHandler, 100 );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/archive-posts.vamtam_classic', addHandler, 100 );
	} else {
		elementorFrontend.elementsHandler.attachHandler( 'posts', defaultPosts, 'vamtam_classic' );
		elementorFrontend.elementsHandler.attachHandler( 'posts', VamtamLoadMore, 'vamtam_classic' );
		elementorFrontend.elementsHandler.attachHandler( 'posts', VamtamPostsBase, 'vamtam_classic' );
		elementorFrontend.elementsHandler.attachHandler( 'archive-posts', defaultPosts, 'vamtam_classic' );
		elementorFrontend.elementsHandler.attachHandler( 'archive-posts', VamtamLoadMore, 'vamtam_classic' );
		elementorFrontend.elementsHandler.attachHandler( 'archive-posts', VamtamPostsBase, 'vamtam_classic' );
	}
} );
