// autocomplete ext
(function ($) {
	var getShengmu = (function () {
		var idx = -1;
		var MAP = 'ABCDEFGHJKLMNOPQRSTWXYZ';
		var boundaryChar = '驁簿錯鵽樲鰒餜靃攟鬠纙鞪黁漚曝裠鶸蜶籜鶩鑂韻糳';

	    if ( !String.prototype.localeCompare ) {
	    	return function (a) {
	    		return a;
	    	};
	        // throw Error('String.prototype.localeCompare not supported.');
	    }

	    return function getShengmu(c) {
	        if ( /[^\u4e00-\u9fa5]/.test(c) ) {
	            return c;
	        }
	        for (var i = 0; i < boundaryChar.length; i++) {
	            if (boundaryChar[i].localeCompare( c, 'zh-CN-u-co-pinyin' ) >= 0) {
	                idx = i;
	                break;
	            }
	        }
	        return MAP[idx];
	    };
	}());
	function getCharListShengmu(cl) {
		var list = cl.split('');
		var s = '';
		for (var i = 0; i < list.length; i++) {
			s += getShengmu( list[i] );
		}
		return s;
	}

	function filter(array, term) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex( term ), "i" );
		return $.grep( array, function( value ) {
			var v = value.label || value.value || value;
			var sm = getCharListShengmu(v);
			return matcher.test( v ) || matcher.test(value.sm || sm);
		} );
	}
	$.ui.autocomplete.prototype._initSource = function () {
		if ( this.options.sm && $.isArray(this.options.source) ) {
			this.source = function( request, response ) {
				response( filter( this.options.source, request.term ) );
			};
		} else {
			initSource.call( this );
		}
	};

	// 中文搜索value不合适作为展示结果
	// 这里通过在标签上设置data-for="select"
	// 来关联一个隐藏域的方式来展示中文，提交id
	function autoSetHandler(event) {
		var source = $(this).autocomplete('option').source;
		var text = this.value;
		var filterData = $.map(source, function(item) {
			if (item.label === text) return item;
		});
		var $for = $($(this).data('for'));
		if (!$for.length) {
			return true;
		}
		if (!filterData.length) {
			$for.val('');
		} else {
			$for.val( filterData[0].id );
		}
	}
	$('body').on('input propertychange autocompletechange', '.ui-autocomplete-input', autoSetHandler)
	.on('click', '.ui-autocomplete-input', function(event) {
		var v = this.value || '';
		$(this).autocomplete('search', v);
	});
}(jQuery));