(function (){
	function _search(elem, options){
		this.elem = elem;
		this.input = $$('input', elem),
		this.layer = $$('.dropdown-layer', elem),
		this.form = $$('form', elem);
		this.options = options;
		
		this.xhr;
		
		this.lievent = $$.addCustomEventType('lievent', {
			bubbles: true,
			cancelable: true,
		});
		this.havedata = $$.addCustomEventType('havedata', {
			bubbles: true,
			cancelable: true,
		});
		this.nodata = $$.addCustomEventType('nodata', {
			bubbles: true,
			cancelable: true,
		});
	}
	_search.DEFAULT = {
		url: 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1571301316158_552&callback=jsonp553&k=1&area=c2c&bucketid=12',
		autoComplete: true,
		ajaxDataInterval: 0
	}
	// submit事件
	_search.prototype.submit = function (){
		var searchObj = this;
		this.form.addEventListener('submit', function (e){
			var keyword = $$.stringUtil.trimSpace(searchObj.input.elemList[0].value);
			if (keyword === ''){
				e.preventDefault();
				return false;
			}
		});
	};
	// 自动完成
	_search.prototype.autoComplete = function (){
		var searchObj = this;
		this.layer.addEventListener('click', function (e, target){
			searchObj.input.elemList[0].value = target.innerHTML;
			this.dispatchEvent(searchObj.lievent);
		}, {
			agent: true
		});
	};
	// 获取远程(淘宝)关键字搜索数据
	_search.prototype.ajaxData = function (){
		var searchObj = this,
			timeoutID;
			
		this.input.addEventListener('input', function (){
			var keyword = $$.stringUtil.trimSpace(this.value);
				
			clearTimeout(timeoutID);	
			// keyword为空时,清空layer,直接结束
			if (keyword === ''){
				while (searchObj.layer.elemList[0].hasChildNodes()){
					searchObj.layer.elemList[0].removeChild(searchObj.layer.elemList[0].firstChild);
				}
				return ;
			}
			// 中止之前未完成的ajax请求
			if (searchObj.xhr){
				searchObj.xhr.abort();
			}
			
			// 两次输入间隔比较短只发一次ajax
			timeoutID = setTimeout(function (){
				searchObj.xhr = $$.ajax({
					url: searchObj.options.url + '&q=' + encodeURIComponent(keyword),
					dataType: 'jsonp',
					success: function (data){
						var length = data.result.length;
						while (searchObj.layer.elemList[0].hasChildNodes()){
							searchObj.layer.elemList[0].removeChild(searchObj.layer.elemList[0].firstChild);
						}
						if (length === 0){
							return ;
						}
						length >= 5 && (length = 5);
						for (var i = 0; i < length; i++){
							var li = document.createElement('li');
							li.classList.add('textOverflow');
							li.innerHTML = data.result[i][0];
							searchObj.layer.elemList[0].appendChild(li);
						}
					},
					complete: function (){
						searchObj.xhr = undefined;
					}
				});
			}, searchObj.options.ajaxDataInterval);
			
		});
	}
	
	$$.extend({
		search: function (options){
			if (typeof options !== 'object'){
				options = _search.DEFAULT;
			}
			else {
				options = {
					url: options.url || _search.DEFAULT.url,
					autoComplete: options.autoComplete ||  _search.DEFAULT.autoComplete,
					ajaxDataInterval: options.ajaxDataInterval ||  _search.DEFAULT.ajaxDataInterval
				};
			}
			this.each(function (){
				var _searchObj = $$(this).cache('_searchObj');
				if (!_searchObj[0]){ //单例
					_searchObj = new _search($$(this), options);
					$$(this).cache('_searchObj', _searchObj);
				}
				_searchObj.submit();
				options.autoComplete && _searchObj.autoComplete();
				_searchObj.ajaxData();
			}); 
		}
	});
})($$);