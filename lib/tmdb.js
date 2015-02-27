var request = require('request');
var em = require('events').EventEmitter;
String.prototype.format = function() {
    var content = this;
    for (var i=0; i < arguments.length; i++)
    {
        var replacement = '{' + i + '}';
        content = content.replace(replacement, arguments[i]);  
    }
    return content;
};

// TODO complete tv support
var me;
var tmdb = function(api_key, language) {
	me = this;
	this.api_key = api_key;
	this.config = null;
	this.language = language;
	this.base = 'http://api.themoviedb.org/3';  
	this.api_urls =
		{
			configuration:              this.base+'/configuration?api_key='+this.api_key,
			misc_latest:                this.base+'/movie/latest?api_key='+this.api_key+(this.language?'&language='+this.language:''),
            		misc_upcoming:              this.base+'/movie/upcoming?page={0}&api_key='+this.api_key+(this.language?'&language='+this.language:''),
			misc_now_playing:           this.base+'/movie/now-playing?page={0}&api_key='+this.api_key+(this.language?'&language='+this.language:''),
			misc_popular:               this.base+'/movie/popular?page={0}&api_key='+this.api_key+(this.language?'&language='+this.language:''),
			misc_top_rated:             this.base+'/movie/top-rated?page={0}&api_key='+this.api_key+(this.language?'&language='+this.language:''),
			movie_info:                 this.base+'/movie/{0}?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			movie_alternative_titles:   this.base+'/movie/{0}/alternative_titles?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			movie_casts:                this.base+'/movie/{0}/casts?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			movie_images:               this.base+'/movie/{0}/images?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			movie_keywords:             this.base+'/movie/{0}/keywords?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			movie_releases:             this.base+'/movie/{0}/releases?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			movie_trailers:             this.base+'/movie/{0}/trailers?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			movie_translations:         this.base+'/movie/{0}/translations?api_key='+this.api_key+(this.language?'&language='+this.language:''),
            		movie_similar:              this.base+'/movie/{0}/similar_movies?page={1}&api_key='+this.api_key+(this.language?'&language='+this.language:''),
            		tv_info:		    this.base+'/tv/{0}?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			tv_alternative_titles:      this.base+'/tv/{0}/alternative_titles?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			tv_credits:		    this.base+'/tv/{0}/credits?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			tv_images:		    this.base+'/tv/{0}/images?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			tv_keywords:		    this.base+'/tv/{0}/keywords?api_key='+this.api_key+(this.language?'&language='+this.language:''), 
			tv_similar:		    this.base+'/tv/{0}/similar?page={1}api_key='+this.api_key+(this.language?'&language='+this.language:''),
			tv_seasons_info:	    this.base+'/tv/{0}/season/{1}?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			tv_seasons_images:	    this.base+'/tv/{0}/season/{1}/images?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			tv_episodes_info:	    this.base+'/tv/{0}/season/{1}/episode/{2}?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			tv_episodes_images:	    this.base+'/tv/{0}/season/{1}/episode/{2}/images?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			person_info:                this.base+'/person/{0}?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			person_credits:             this.base+'/person/{0}/credits?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			person_images:              this.base+'/person/{0}/images?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			collection_info:            this.base+'/collection/{0}?api_key='+this.api_key+(this.language?'&language='+this.language:''),
			search_movie:               this.base+'/search/movie?query={0}&page={1}&api_key='+this.api_key+(this.language?'&language='+this.language:''),
			search_tv:           	    this.base+'/search/tv?query={0}&page={1}&api_key='+this.api_key+(this.language?'&language='+this.language:''),
			search_multi:      	    this.base+'/search/multi?query={0}&page={1}&api_key='+this.api_key+(this.language?'&language='+this.language:''),
			search_person:              this.base+'/search/person?query={0}&page={1}&api_key='+this.api_key+(this.language?'&language='+this.language:''),
            		search_companies:           this.base+'/search/company?query={0}&page={1}&api_key='+this.api_key+(this.language?'&language='+this.language:''),
			auth_request_token:			this.base+'/authentication/token/new?api_key='+this.api_key,
			auth_session_id:			this.base+'/authentication/session/new?request_token={0}&api_key='+this.api_key,
			write_rate_movie:			this.base+'/movie/{0}/rating?session_id={1}&api_key='+this.api_key+(this.language?'&language='+this.language:''),
	            	company_info:               this.base+'/company/{0}?api_key='+this.api_key+(this.language?'&language='+this.language:''),
            		company_movies:             this.base+'/company/{0}/movies?api_key='+this.api_key+(this.language?'&language='+this.language:''),
            		account_info:               this.base+'/account?session_id={0}&api_key='+this.api_key,
            		account_add_favorite:       this.base+'/account/{0}/favorite?session_id={1}&api_key='+this.api_key,
            		account_favorite_movies:    this.base+'/account/{0}/favorite_movies?session_id={1}&api_key='+this.api_key,
            		account_add_movie_watchlist: this.base+'/account/{0}/movie_watchlist?session_id={1}&api_key='+this.api_key,
            		account_movie_watchlist:    this.base+'/account/{0}/movie_watchlist?session_id={1}&api_key='+this.api_key,
            		account_rated_movies:       this.base+'/account/{0}/rated_movies?session_id={1}&api_key='+this.api_key,
            		genre_list:                 this.base+'/genre/list?api_key='+this.api_key+(this.language?'&language='+this.language:''),
            		genre_movies:               this.base+'/genre/{0}/movies?page={0}&page={1}&api_key='+this.api_key+(this.language?'&language='+this.language:'')
		};


	this.configuration(function(err,res) {
		if(!err) {
			me.config = res;
		} else {
			me.emit('error', JSON.stringify(err));
		}
	});
	
};

tmdb.prototype = Object.create(em.prototype);

/**
 * factory function
 **/
module.exports.init = function(apikey, language) {
	return new tmdb(apikey, language);
};

/**
 * misc methods
 * all but the 'latest'-function can be supplied with a page argument,
 * if page is left out the first page is returned
 **/
tmdb.prototype.misc = {
    upcoming: function(p, callback) {
		if(arguments.length === 1) {
			callback = p;
			var page = 1;
		} else {
			var page = ((typeof p !== 'number') ? page = 1 : page = p);
		}
		var url = me.api_urls.misc_upcoming.format(page);
		executeQuery({url: url}, callback);
	},
	latest: function(callback) {
		var url = me.api_urls.misc_latest;
		executeQuery({url: url}, callback);
	},
	nowPlaying: function(p, callback) {
		if(arguments.length === 1) {
			callback = p;
			var page = 1;
		} else {
			var page = ((typeof p !== 'number') ? page = 1 : page = p);
		}
		var url = me.api_urls.misc_now_playing.format(page);
		executeQuery({url: url}, callback);
	},
	popular: function(p, callback) {
		if(arguments.length === 1) {
			callback = p;
			var page = 1;
		} else {
			var page = ((typeof p !== 'number') ? page = 1 : page = p);
		}
		var url = me.api_urls.misc_popular.format(page);
		executeQuery({url: url}, callback);
	},
	topRated: function(p, callback) {
		if(arguments.length === 1) {
			callback = p;
			var page = 1;
		} else {
			var page = ((typeof p !== 'number') ? page = 1 : page = p);
		}
		var url = me.api_urls.misc_top_rated.format(page);
		executeQuery({url: url}, callback);
	},
};

/**
 * genre methods
 **/
tmdb.prototype.genre = {
    list: function(callback) {
        var url = me.api_urls.genre_list;
        executeQuery({url:url}, callback);
    },
    
    movies: function(q, p, callback) {
        if(arguments.length === 2) {
            callback = p;
            p = 1;
        } else {
            if (typeof p !== 'number') { p = 1; }
        }
        var url = me.api_urls.genre_movies.format(q,p);
        executeQuery({url:url}, callback);
    }
};

/**
 * tv methods
 **/
tmdb.prototype.tv = {
    info: function(q, callback) {
        var url = me.api_urls.tv_info.format(q);
        executeQuery({url:url}, callback);
    },
    alternative_titles: function(q, callback) {
        var url = me.api_urls.tv_alternative_titles.format(q);
        executeQuery({url:url}, callback);
    },
    credits: function(q, callback) {
        var url = me.api_urls.tv_credits.format(q);
        executeQuery({url:url}, callback);
    },
    images: function(q, callback) {
        var url = me.api_urls.tv_images.format(q);
        executeQuery({url:url}, callback);
    },
    keywords: function(q, callback) {
        var url = me.api_urls.tv_keywords.format(q);
        executeQuery({url:url}, callback);
    },
    similar: function(q, callback) {
        var url = me.api_urls.tv_similar.format(q);
        executeQuery({url:url}, callback);
    },
    seasons_info: function(q, p, callback) {
        var url = me.api_urls.tv_seasons_info.format(q,p);
        executeQuery({url:url}, callback);
    },
    seasons_images: function(q, p, callback) {
        var url = me.api_urls.tv_seasons_images.format(q,p);
        executeQuery({url:url}, callback);
    },
    episodes_info: function(q, p, r, callback) {
        var url = me.api_urls.tv_episodes_info.format(q,p,r);
        executeQuery({url:url}, callback);
    },
    episodes_images: function(q, p, r, callback) {
        var url = me.api_urls.tv_episodes_images.format(q,p,r);
        executeQuery({url:url}, callback);
    }
};

/**
 * Get current configuration for constructing complete image urls
 **/
tmdb.prototype.configuration = function(callback) {
	var url = me.api_urls.configuration;
	executeQuery({url: url}, callback);
};

/**
 * movie methods
 * q = id (can be either tmdb id or imdb id)
 **/
tmdb.prototype.movie = {
    info: function(q, callback) {
        var url = me.api_urls.movie_info.format(q);
        executeQuery({url:url}, callback);
    },
    alternativeTitles: function(q, callback) {
        var url = me.api_urls.movie_alternative_titles.format(q);
        executeQuery({url:url}, callback);
    },
    casts: function(q, callback) {
        var url = me.api_urls.movie_casts.format(q);
        executeQuery({url:url}, callback);
    },
    images: function(q, callback) {
        var url = me.api_urls.movie_images.format(q);
        executeQuery({url:url}, callback);
    },
    keywords: function(q, callback) {
        var url = me.api_urls.movie_keywords.format(q);
        executeQuery({url:url}, callback);
    },
    releases: function(q, callback) {
        var url = me.api_urls.movie_releases.format(q);
        executeQuery({url:url}, callback);
    },
    trailers: function(q, callback) {
        var url = me.api_urls.movie_trailers.format(q);
        executeQuery({url:url}, callback);
    },
    translations: function(q, callback) {
        var url = me.api_urls.movie_translations.format(q);
        executeQuery({url:url}, callback);
    },
    similar: function(q, p, callback) {
        if(arguments.length === 2) {
            callback = p;
            p = 1;
        } else {
            if (typeof p !== 'number') { p = 1; }
        }
        var url = me.api_urls.movie_similar.format(q,p);
        executeQuery({url:url}, callback);
    }
};

/**
 * search methods
 * q = searchterm, p = page
 * page defaults to 1 if not specified or invalid
 **/
tmdb.prototype.search = {
    movie: function(q, p, callback) {
		if(arguments.length === 2) {
			callback = p;
			p = 1;
		} else {
			if (typeof p !== 'number') { p = 1; }
		}
        var url = me.api_urls.search_movie.format(q, p);
        executeQuery({url:url}, callback);
    },
    tv: function(q, p, callback) {
		if(arguments.length === 2) {
			callback = p;
			p = 1;
		} else {
			if (typeof p !== 'number') { p = 1; }
		}
        var url = me.api_urls.search_tv.format(q, p);
        executeQuery({url:url}, callback);
    },
    multi: function(q, p, callback) {
		if(arguments.length === 2) {
			callback = p;
			p = 1;
		} else {
			if (typeof p !== 'number') { p = 1; }
		}
        var url = me.api_urls.search_multi.format(q, p);
        executeQuery({url:url}, callback);
    },
    person: function(q, p, callback) {
		if(arguments.length === 2) {
			callback = p;
			p = 1;
		} else {
			if (typeof p !== 'number') { p = 1; }
		}
        var url = me.api_urls.search_person.format(q, p);
        executeQuery({url:url}, callback);
	},
    companies: function(q, p, callback) {
		if(arguments.length === 2) {
			callback = p;
			p = 1;
		} else {
			if (typeof p !== 'number') { p = 1; }
		}
        var url = me.api_urls.search_companies.format(q, p);
        executeQuery({url:url}, callback);
    },
};

/**
 * person methods
 * id = person id
 **/
tmdb.prototype.person = {
    info: function(id, callback) {
        var url = me.api_urls.person_info.format(id);
        executeQuery({url:url}, callback);
    },
    credits: function(id, callback) {
        var url = me.api_urls.person_credits.format(id);
        executeQuery({url:url}, callback);       
    },
    images: function(id, callback) {
        var url = me.api_urls.person_images.format(id);
        executeQuery({url:url}, callback);       
    },
};

/**
 * collection methods
 * id = collection id
 **/
tmdb.prototype.collection = {
    info: function(id, callback) {
        var url = me.api_urls.collection_info.format(id);
        executeQuery({url: url}, callback);
    },
};

/**
 * authentication methods
 **/
tmdb.prototype.authentication = {
	requestToken: function(callback) {
		var url = me.api_urls.auth_request_token;
		executeQuery({url:url}, callback);
	},
	sessionId: function(token, callback) {
		var url = me.api_urls.auth_session_id.format(token);
		executeQuery({url:url}, callback);
	}
};

/**
 * company methods
 **/
tmdb.prototype.company = {
    info: function(id, callback) {
        var url = me.api_urls.company_info.format(id);
        executeQuery({url: url}, callback);
    },
    movies: function(id, callback) {
        var url = me.api_urls.company_movies.format(id);
        executeQuery({url: url}, callback);
    },
};

/**
 * account methods
 **/
tmdb.prototype.account = {
    info: function(sid, callback) {
        var url = me.api_urls.account_info.format(sid);
        executeQuery({url: url}, callback);
    },
    favorite_movies: function(id, sid, callback) {
        var url = me.api_urls.account_favorite_movies.format(id,sid);
        executeQuery({url: url}, callback);
    },
    rated_movies: function(id, sid, callback) {
        var url = me.api_urls.account_rated_movies.format(id,sid);
        executeQuery({url: url}, callback);
    },
    add_favorite: function(aid, mid, sid, isfavorite, callback) {
        var url = me.api_urls.account_add_favorite.format(aid,sid);
        executePost({url: url},{movie_id: mid, favorite: isfavorite}, callback);
    },
    movie_watchlist: function(id, sid, callback) {
        var url = me.api_urls.account_movie_watchlist.format(id,sid);
        executeQuery({url: url}, callback);
    },
    add_movie_watchlist: function(aid, mid, sid, isinwatchlist, callback) {
        var url = me.api_urls.account_add_movie_watchlist.format(aid,sid);
        executePost({url: url},{movie_id: mid, movie_watchlist: isinwatchlist}, callback);
    },
};


/**
 * write methods
 * id = item id (movie id etc.)
 * sid = session id
 **/
tmdb.prototype.write = {
	rateMovie: function(id, sid, rating, callback) {
		var url = me.api_urls.write_rate_movie.format(id,sid);
		executePost({url:url}, {value:rating}, callback);
	},
};

/**
 * Sends the query to tmdb and ships the response of to be processed
 **/
var executeQuery = function(url,callback) {
    request(
        {
            uri:encodeURI(url.url),
            headers: {"Accept": 'application/json'}
        },
        function(err,res,body) {
            processQuery(url,err,res,body,callback);
        }
    );
}

/**
 * Processes the query response from TMDb
 **/
var processQuery = function(url, error, response, body, callback) {
    var res = null;
    try {
        res = JSON.parse(body);
    } catch(e) {
    }

    if(!error && response.statusCode === 200 && !res.status_code) {
        callback(undefined,res);
        return;
    }

	if(res.status_code) {
		switch(res.status_code) {
			case 6: // Invalid id
				callback(res,undefined);
				break;
			case 7: // Invalid API key
				callback(res,undefined);
				break;
			case 10: // API key suspended, not good
				callback(res,undefined);
				break;
			case 12: // The item/record was updated successfully
				callback(res,undefined);
				break;
			case 17: // Session denied
				callback(res,undefined);
				break;
		}
	} else {
		callback(error,res);
	}
}

/**
 * posts the data to TMDb and ships the response of to be processed
 **/
var executePost = function(url,data,callback) {
    request(
        {
			method: 'POST',
            uri:encodeURI(url.url),
			json: data,
            headers: {"Content-Type": 'application/json', "Accept": 'application/json'},
        },
        function(err,res,body) {
            processPost(url,err,res,body,callback);
        }
    );
}

/**
 * Processes the post response from TMDb
 **/
var processPost = function(url, error, response, body, callback) {
    var res = null;
    try {
        res = body;
    } catch(e) {
    }

    if(!error && response.statusCode === 200 && !res.status_code) {
        callback(undefined,res);
        return;
    }

	if(res.status_code) {
		switch(res.status_code) {
            case 5: // not valid json supplied
                callback(res,undefined);
                break;
			case 6: // Invalid id
				callback(res,undefined);
				break;
			case 7: // Invalid API key
				callback(res,undefined);
				break;
			case 10: // API key suspended, not good
				callback(res,undefined);
				break;
			case 12: // The item/record was updated successfully
				callback(undefined,res);
				break;
            case 13: // The item/record was deleted successfully
                callback(undefined,res);
                break;
			case 17: // Session denied
				callback(res,undefined);
				break;
		}
	} else {
		callback(error,res);
	}
}

