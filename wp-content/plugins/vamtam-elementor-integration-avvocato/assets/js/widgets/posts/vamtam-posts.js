class VamtamPosts extends elementorModules.frontend.handlers.Base {

	onInit() {
		elementorModules.frontend.handlers.Base.prototype.onInit.apply( this, arguments );
		this.bindEvents();

		this.loadMoreMasonryFix();
		this.checkApplySafariFix();
	}

	checkApplySafariFix() {
		const _this = this;

		jQuery( window ).on( 'load', () => {
			if ( ! jQuery( 'html' ).hasClass( 'safari' ) ) {
				return;
			}

			setTimeout( () => {
				_this.onWindowResize();
			}, 10 );
		} );
	}

	recalculateMasonry() {
		this.elements = this.getDefaultElements(); // Update this.elements to include any new posts.
		this.onWindowResize();
	}

	checkDiscardDuplicates() {
		const $el           = this.$element,
			$postsContainer = $el.find('.elementor-posts-container'),
			$posts          = $postsContainer.find( '.elementor-post:visible' ),
			$stickyPosts    = jQuery( '.vamtam-blog-featured-post .elementor-post:visible' ),
			postIDs		    = [],
			stickyPostsIDs  = [];
		let removedPosts    = 0;

		if ( ! $posts.length ) {
			return;
		}

		// Discard duplicates.
		jQuery.each( $posts, ( index, post ) => {
			const postID = parseInt( $posts[ index ].classList[2].match(/\d+/)[0] );

			if ( postID && ! isNaN( postID ) ) {
				if ( -1 === postIDs.indexOf( postID ) ) {
					postIDs.push( postID );
				} else {
					// Duplicate post found. Remove it.
					jQuery( post ).remove();
					removedPosts++;
				}
			}
		} );

		// Discard sticky post/s.
		if ( $stickyPosts.length ) {

			// Get IDs of sticky posts.
			jQuery.each( $stickyPosts, index => {
				const stickyPostID = parseInt( $stickyPosts[ index ].classList[2].match(/\d+/)[0] );

				if ( stickyPostID && ! isNaN( stickyPostID ) ) {
					if ( -1 === stickyPostsIDs.indexOf( stickyPostID ) ) {
						stickyPostsIDs.push( stickyPostID );
					}
				}
			} );

			// We need updated posts reference.
			const $filteredPosts = $postsContainer.find( '.elementor-post:visible' );

			jQuery.each( $filteredPosts, ( index, post ) => {
				const postID = parseInt( $filteredPosts[ index ].classList[2].match(/\d+/)[0] );

				if ( postID && ! isNaN( postID ) ) {
					if ( -1 !== stickyPostsIDs.indexOf( postID ) ) {
						// Duplicate stiky post found. Remove it.
						jQuery( post ).remove();
						removedPosts++;
					}
				}
			} );
		}

		return removedPosts;
	}

	loadMoreMasonryFix() {
		const paginationType = this.getElementSettings()['pagination_type'];
		if ( 'load_more_on_click' !== paginationType && 'load_more_infinite_scroll' !== paginationType ) {
			return;
		}

		var $el = this.$element,
			$postsContainer = $el.find('.elementor-posts-container'),
			$loadMoreBtn = $el.find('.elementor-button'),
			$loadMoreAnchor = $el.find('.e-load-more-anchor'),
			loadMorePaginationEnd = 'e-load-more-pagination-end',
			postsCountBeforeLastAjax = null,
			postsCountAfterLastAjax = null,
			observer = null,
			_this = this;

		const handleInfiniteScroll = () => {
			if ( this.isEdit ) {
				return;
			}

			observer = elementorModules.utils.Scroll.scrollObserver( {
				callback: event => {
					if ( ! event.isInViewport ) {
						return;
					} // When the observer is triggered it won't be triggered without scrolling, but sometimes there will be no scrollbar to trigger it again.


					observer.unobserve( $loadMoreAnchor[0] );
					handleNewAjaxPosts();
				}
			} );

			observer.observe( $loadMoreAnchor[0] );
		}

		const onPaginationEnd = () => {
			if ( 'load_more_on_click' === paginationType ) {
				// Remove listener.
				jQuery( $loadMoreBtn ).off( 'click', handleNewAjaxPosts );
			} else {
				// Disconnect observer.
				observer.disconnect();
			}
		}

		const handleNewAjaxPosts = () => {
			postsCountBeforeLastAjax = $postsContainer.find( '.elementor-post:visible' ).length;

			let stoppedChecking = false;

			// Check every 50ms for changes and if we have more posts, recalculate Masonry.
			const quickTimer = setInterval( () => {
				postsCountAfterLastAjax = $postsContainer.find( '.elementor-post:visible' ).length;
				if ( postsCountBeforeLastAjax !== postsCountAfterLastAjax ) {
					const removedPosts = _this.checkDiscardDuplicates();

					_this.recalculateMasonry();

					postsCountBeforeLastAjax = postsCountAfterLastAjax - removedPosts;

					clearInterval(quickTimer);
					stoppedChecking = true;

					if ( observer ) {
						observer.observe( $loadMoreAnchor[0] );
					}
				}

				if ( $el.hasClass( loadMorePaginationEnd ) ) {
					onPaginationEnd();
				}
			}, 50 );

			if ( ! stoppedChecking ) {
				// After 5s stop checking.
				setTimeout( () => {
					clearInterval( quickTimer );
				}, 5000 );
			}
		};

		if ( 'load_more_on_click' === paginationType ) {
			// Add listener.
			jQuery( $loadMoreBtn ).on( 'click', handleNewAjaxPosts );
		} else {
			// Add observer.
			handleInfiniteScroll();
		}
	}

	getSkinPrefix() {
		return 'classic_';
	}

	bindEvents() {
		var cid = this.getModelCID();
		elementorFrontend.addListenerOnce( cid, 'resize', this.onWindowResize.bind( this ) );
	}

	getClosureMethodsNames() {
		return elementorModules.frontend.handlers.Base.prototype.getClosureMethodsNames.apply( this, arguments ).concat( ['fitImages', 'onWindowResize', 'runMasonry'] );
	}

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
	}

	getDefaultElements() {
		var selectors = this.getSettings( 'selectors' );
		return {
			$postsContainer: this.$element.find( selectors.postsContainer ),
			$posts: this.$element.find( selectors.post )
		};
	}

	fitImage( $post ) {
		var settings = this.getSettings(),
			$imageParent = $post.find( settings.selectors.postThumbnail ),
			$image = $imageParent.find( 'img' ),
			image = $image[0];

		if ( ! image ) {
			return;
		}

		var imageParentRatio = $imageParent.outerHeight() / $imageParent.outerWidth(),
			imageRatio = image.naturalHeight / image.naturalWidth;
		$imageParent.toggleClass( settings.classes.fitHeight, imageRatio < imageParentRatio );
	}

	fitImages() {
		var $ = jQuery,
			self = this,
			itemRatio = getComputedStyle( this.$element[0], ':after' ).content,
			settings = this.getSettings();
		this.elements.$postsContainer.toggleClass( settings.classes.hasItemRatio, !!itemRatio.match(/\d/) );

		if ( self.isMasonryEnabled() ) {
			return;
		}

		this.elements.$posts.each( function() {
			var $post = $( this ),
				$image = $post.find( settings.selectors.postThumbnailImage );
			self.fitImage( $post );
			$image.on('load', function() {
				self.fitImage( $post );
			} );
		} );
	}

	setColsCountSettings() {
		var currentDeviceMode = elementorFrontend.getCurrentDeviceMode(),
			settings = this.getElementSettings(),
			skinPrefix = this.getSkinPrefix(),
			colsCount;

		switch ( currentDeviceMode ) {
			case 'mobile':
				colsCount = settings[skinPrefix + 'columns_mobile'];
				break;

			case 'tablet':
				colsCount = settings[skinPrefix + 'columns_tablet'];
				break;

			default:
				colsCount = settings[skinPrefix + 'columns'];
		}

		this.setSettings( 'colsCount', colsCount );
	}

	isMasonryEnabled() {
		return !!this.getElementSettings( this.getSkinPrefix() + 'masonry' );
	}

	runMasonry() {
		var elements = this.elements;
		elements.$posts.css( {
			marginTop: '',
			transitionDuration: ''
		} );
		this.setColsCountSettings();
		var colsCount = this.getSettings( 'colsCount' ),
			hasMasonry = this.isMasonryEnabled() && colsCount >= 2;
		elements.$postsContainer.toggleClass( 'elementor-posts-masonry', hasMasonry );

		if ( ! hasMasonry ) {
			elements.$postsContainer.height( '' );
			return;
		}
		/* The `verticalSpaceBetween` variable is setup in a way that supports older versions of the portfolio widget */


		var verticalSpaceBetween = this.getElementSettings( this.getSkinPrefix() + 'row_gap.size' );

		if ( '' === this.getSkinPrefix() && '' === verticalSpaceBetween ) {
			verticalSpaceBetween = this.getElementSettings( this.getSkinPrefix() + 'item_gap.size' );
		}

		var masonry = new elementorModules.utils.Masonry( {
			container: elements.$postsContainer,
			items: elements.$posts.filter( ':visible' ),
			columnsCount: this.getSettings( 'colsCount' ),
			verticalSpaceBetween
		} );
		masonry.run();
	}

	onWindowResize() {
		this.fitImages();
		this.runMasonry();
	}

}

jQuery( window ).on( 'elementor/frontend/init', () => {
	if ( !elementorFrontend.elementsHandler || !elementorFrontend.elementsHandler.attachHandler ) {
		const addHandler = ( $element ) => {
			elementorFrontend.elementsHandler.addHandler( VamtamPosts, {
				$element,
			} );
		};

		elementorFrontend.hooks.addAction( 'frontend/element_ready/posts.default', addHandler, 100 );
	} else {
		elementorFrontend.elementsHandler.attachHandler( 'posts', VamtamPosts, 'classic' );
	}
} );
