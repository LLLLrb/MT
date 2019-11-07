( function (func){
	func.call(window);
}(function (){
	var _$$ = function (selector, context){
		return new _$$.prototype.init(selector, context);
	};
	var inst, elemList;
	
	_$$.prototype.init = function (selector, context){
		this.is$$ = true;
		this.selector = selector;
		this.elemList = [];
		inst = this;
		// window || document
		if (selector === window || selector === document){
			this.elemList[0] = elemList[0] = selector;
			this.context = selector;
			return ;
		}
		// selector为object
		if (typeof selector === 'object'){
			// $$对象
			if(selector.is$$){
				this.elemList = elemList = selector.elemList;
				this.context = selector.context;
				this.selector = selector.selector;
				this.display = selector.display;
				return ;
			}
			else {
				switch (selector.nodeType){
					// HTML对象
					case 1:
						this.elemList[0] = elemList[0] = selector;
						this.context = document;
						break;
				}
				return ;
			}
		}
		// context为$$
		if (typeof context === 'object' && context.is$$){
			for (var i = 0; i < context.elemList.length; i++) {
				push(context.elemList[i].querySelectorAll(selector));
			}
			elemList = this.elemList;
		}
		// context为HTML对象 X
		else if(typeof context === 'object'){
			this.elemList = elemList = context.querySelectorAll(selector);
			this.context = context;
		}
		// 一般的初始化
		else {
			this.elemList = elemList = Array.from(document.querySelectorAll(selector));
			this.context = document;
		}
		function push(nodeList){
			for (var i = 0; i < nodeList.length; i++) {
				inst.elemList.push(nodeList[i])
			}
		}
	}
	_$$.prototype.init.prototype = _$$.prototype;
	
	var globalCache = {},
		cacheMark = '$$' + Math.random().toString().replace(/\D/g, ''),
		guid = 0;
	_$$.gc = globalCache;
	// 检测元素是否有cache缓存池实例
	function _cacheInit(){
		var cache = globalCache[this[cacheMark]];
		if (!cache){
			this[cacheMark] = ++guid;
			cache = globalCache[this[cacheMark]] = {};
		}
		return cache;
	}
	/*
	* 获取、修改元素的$$.cache
	* @param {String} key - 键
	* @param {String} [value] - 值
	* @return {Array[String]} 返回一个保存了css元素的字符串数组
	*/
	_$$.prototype.cache = function (key, value){
		if (value){
			return _each.call(this, _setCache, [key, value]);
		}
		return _each.call(this, _getCache, [key]);
	};
	function _getCache(key){
		return _cacheInit.call(this)[key];
	}
	function _setCache(key, value){
		_cacheInit.call(this)[key] = value;
	}
	
	/*
	* 循环执行代码
	* @param {String} func - 回调函数
	* @param {String} [data] - 数据集
	* @return {$$} 返回$$对象
	*/
	_$$.prototype.each = function (func, data){
		_each.call(this, func, [data]);
		return this;
	};
	function _each(func, params){
		var returnValue = [];
		for (var i = 0; i < this.elemList.length; i++) {
			func.index = i;
			returnValue.push(params ? func.apply(this.elemList[i], params) : func.call(this.elemList[i]));
		}
		return returnValue;
	};
	
	/*
	* 获取、修改元素data数据集
	* @param {String} attr - 属性名
	* @param {String} [value] - 数值
	* @return {$$ | Array[String]} 返回$$对象或字符串数组
	*/
	_$$.prototype.dataset = function (attr, value){
		if (value){
			_each.call(this, _setDataset, [attr, value]);
			return this;
		}
		return _each.call(this, _getDataset, [attr]);
	};
	function _getDataset(attr){
		try{
			return this.dataset[_$$.stringUtil.toCamelCase(attr)];
		}catch(e){
			return this.getAttribute('data-' + attr);
		}
	}
	function _setDataset(attr, value){
		try{
			this.dataset[_$$.stringUtil.toCamelCase(attr)] = String(value);
		}catch(e){
			this.setAttribute('data-' + attr, String(value));
		}
	}
	
	/*
	* 获取元素css
	* @param {String} attr - 属性名称
	* @return {Array[String]} 返回一个保存了css元素的字符串数组
	*/
	_$$.prototype.getCssValue = function (attr){
		return _each.call(this, _getCssValue, [attr]);
	};
	function _getCssValue(attr){
		var value = this.style[attr];
		if (window.getComputedStyle){
			value = (value === '') ? window.getComputedStyle(this, null).getPropertyValue($$.stringUtil.tokebabCase(attr)) : value;
		}
		else {
			//IE 6-8
			value = (value === '') ? this.currentStyle[_$$.stringUtil.toCamelCase(attr)] : value;
		}
		return value;
	}
	
	/*
	* @param {Node} elem - 需要添加的Node对象
	* @return {$$} 返回$$对象
	*/
	_$$.prototype.addChild = function (elem){
		_each.call(this, _addChild, [elem]);
		return this;
	};
	function _addChild(elem){
		this.appendChild(elem);
	}
	
	/*
	* @param {String} className - 添加class的名字
	* @return {$$} 返回$$对象
	*/
	_$$.prototype.addClass = function (className){
		_each.call(this, _addClass, [className]);
		return this;
	};
	function _addClass(className){
		this.classList.add(className);
	}
	
	/*
	* @param {String} className - 删除class的名字
	* @return {$$} 返回$$对象
	*/
	_$$.prototype.removeClass = function (className){
		_each.call(this, _removeClass, [className]);
		return this;
	};
	function _removeClass(className){
		this.classList.remove(className);
	}
	
	/*
	* @param {String} oldc - 被替换class的名字
	* @param {String} newc - 用于替换class的名字
	* @return {$$} 返回$$对象
	*/
	_$$.prototype.replaceClass = function (oldc, newc){
		_each.call(this, _replaceClass, [oldc, newc]);
		return this;
	};
	function _replaceClass(oldc, newc){
		this.classList.replace(oldc, newc);
	}
	
	// eventInitDict {
	//		//提供有关事件的自定义信息的子对象
	//     detail: {
	//         message: "message"
	//     },
	// 		//true，事件将冒泡到触发事件的元素的祖先
	//     bubbles: true,
	// 		//如果为 true，可以使用事件对象的 stopPropagation() 方法取消事件传播。
	//     cancelable: false,
	// }
	/* 
	* 添加自定义事件类型
	* @param {String} type - 自定义事件类型
	* @param {Object} eventInitDict - 定制事件类型属性
	* @return {Event} 返回自定义事件对象
	*/
	_$$.addCustomEventType = function (type, eventInitDict){
		try {return new CustomEvent(type, eventInitDict);} catch(e){}
	};
	
	// 添加事件监听
	var funcMapper = []; // 兼容方案
	// var funcMapper = new Map();  // 使用Map更好
	_$$.prototype.addEventListener = function (type, handler, options){
		_each.call(this, _addEventListener, [type, handler, options]);
		return this;
	};
	function _addEventListener(type, handler, options){
		var _this = this;
		if (_supportAddEventListener()){
			if (options && options.agent){
				this.addEventListener(type, function (event){
					funcMapper.push({
						_handler: handler,
						_tempFunc: arguments.callee,
					});
					handler.call(this, event, event.target || event.srcElement);
				},  options ? options : undefined);
			}
			else {
				this.addEventListener(type, handler, options ? options : undefined);
			}
		}
		else if (this.addEventListener){
			if (options){
				this.addEventListener(type, function (event){
					funcMapper.push({
						_handler: handler,
						_tempFunc: arguments.callee,
					});
					options.agent ? handler.call(this, event, event.target || event.srcElement) : handler.call(this, event);
					options.once && _removeEventListener.call(this, type, handler, options);
				}, options.capture ? true : false);
			}
			else {
				this.addEventListener(type, handler, false);
			}
		}
		else if (this.attachEvent){
			// attachEvent 只支持冒泡
			if (options){
				// attachEvent 方法有个缺点，this 的值会变成 window 对象的引用而不是触发事件的元素。
				this.attachEvent('on' + type, function (event){
					(function (tempFunc){
						funcMapper.push({
							_handler: handler,
							_tempFunc: tempFunc,
						});
					})(arguments.callee);
					options.agent ? handler.call(this, event, event.target || event.srcElement) : handler.call(this, event);
					options.once && _removeEventListener.call(this, type, handler, options);
				});
			}
			else {
				this.attachEvent('on' + type, handler);
			}
		}
	}
	
	// 移除事件监听
	_$$.prototype.removeEventListener = function (type, handler, options){
		_each.call(this, _removeEventListener, [type, handler, options]);
		return this;
	};
	function _removeEventListener(type, handler, options){
		if (_supportAddEventListener()){
			if (options && options.agent){
				removeMapper.call(this, function (index){
					this.removeEventListener(type, funcMapper[index]._tempFunc, options ? options : undefined);
				});
			}
			else {
				this.removeEventListener(type, handler, options ? options : undefined);
			}
		}
		else if (this.addEventListener){
			if (options && options.once){
				removeMapper.call(this, function (index){
					this.removeEventListener(type, funcMapper[index]._tempFunc, (options && options.capture) ? true : false);
				});
			}
			this.removeEventListener(type, handler, (options && options.capture) ? true : false);
		}
		else if (this.attachEvent){
			if (options && options.once){
				for (var i = 0; i < funcMapper.length; i++){
					if (funcMapper[i]._handler === handler){
						this.detachEvent('on' + type, funcMapper[i]._tempFunc);
						funcMapper.splice(i, 1);
						return ;
					}
				}
			}
			this.detachEvent('on' + type, handler);
		}
		
		function removeMapper(callback){
			for (var i = 0; i < funcMapper.length; i++){
				if (funcMapper[i]._handler === handler){
					callback.call(this, i);
					funcMapper.splice(i, 1);
					return ;
				}
			}
		}
	}
	
	
	// 元素显示与隐藏模块
	var mEventInitDict = {bubbles: true, cancelable: false},
		showType = _$$.addCustomEventType('elemshow', mEventInitDict),
		shownType = _$$.addCustomEventType('elemshown', mEventInitDict),
		hideType = _$$.addCustomEventType('elemhide', mEventInitDict),
		hiddenType = _$$.addCustomEventType('elemhidden', mEventInitDict),
		defaultDisplayMap = {};
	function _showInit(){
		if (_getCache.call(this, 'isShow') !== undefined)
			return ;
		var display = _getCssValue.call(this, 'display');
		if (display !== 'none'){
			_setCache.call(this, 'isShow', true);
			_setCache.call(this, 'display', display);
		}
		else {
			_setCache.call(this, 'isShow', false);
			_setCache.call(this, 'display', _getDefaultDisplay.call(this));
		}
	}
	function _show(callback, cssClassName){
		_showInit.call(this);
		if (_getCache.call(this, 'isShow'))
			return ;
		_setCache.call(this, 'isShow', true);
		_removeEventListener.call(this, transitionend, tempFunc1, {once: true});
		try{this.dispatchEvent(showType);} catch(e){_consoleError('无法触发show类型事件', 'IE不支持CustomEvent');}
		callback.index = arguments.callee.index;
		tempFunc1.mark = 'show';
		if (callback.call(this)){
			_addEventListener.call(this, transitionend, tempFunc1, {once: true});
			return ;
		}
		tempFunc1.call(this);
	}
	function _hide(callback, cssClassName){
		_showInit.call(this);
		if (!_getCache.call(this, 'isShow'))
			return;
		_setCache.call(this, 'isShow', false);
		_removeEventListener.call(this, transitionend, tempFunc1, {once: true});
		try{this.dispatchEvent(hideType);} catch(e){_consoleError('无法触发hide类型事件', '浏览器环境不支持CustomEvent');}
		callback.index = arguments.callee.index;
		tempFunc1.mark = 'hide';
		if (callback.call(this)){
			_addEventListener.call(this, transitionend, tempFunc1, {once: true});
			return ;
		}
		tempFunc1.call(this);
	}
	function tempFunc1(){
		try{
			switch (arguments.callee.mark){
				case 'show':
					this.dispatchEvent(shownType);
					break;
				case 'hide':
					this.dispatchEvent(hiddenType);
					break;
			}
		}catch(e){
			switch (arguments.callee.mark){
				case 'show':
					_consoleError('无法触发shown类型事件', '浏览器环境不支持CustomEvent');
					break;
				case 'hide':
					_consoleError('无法触发hidden类型事件', '浏览器环境不支持CustomEvent');
					break;
			}
		}
	}
	function _getDefaultDisplay(){
		var temp,
			display = defaultDisplayMap[this.nodeName];
		if (display)
			return display;
		else {
			temp = document.body.appendChild(document.createElement(this.nodeName));
			display = _getCssValue.call(temp, 'display');
			document.body.removeChild(temp);
			display = (display === 'none') ? 'inline-block' : display;
			defaultDisplayMap[this.nodeName] = display;
		}
		return display;
	}
	_$$.prototype.silentShow = function (delay){
		_each.call(this, _show, [function (){
			this.style.display = _getCache.call(this, 'display');
		}]);
		return this;
	};
	_$$.prototype.silentHide = function (delay){
		_each.call(this, _hide, [function (){
			this.style.display = 'none';
		}]);
		return this;
	};
	function _transitionInit(options){
		transition || _supportTransition();
		var str;
		if (transition){
			if (options){
				str = typeof options.property !== 'undefined' ? options.property + ' ' : 'all ';
				str += typeof options.duration !== 'undefined' ? options.duration + ' ' : '.3s ';
				str += typeof options.timingFunction !== 'undefined' ? options.timingFunction + ' ' : 'linear ';
				str += typeof options.delay !== 'undefined' ? options.delay : '';
				this.style[transition] = str;
			}
			else {
				this.style[transition] = 'all .3s linear';
			}
		}
		else {
			return false;
		}
		return true;
	}
	function _fadeInit(){
		if (_getCssValue.call(this, 'display') === 'none')
			this.style.opacity = '0';
	}
	function _fadeShow(transitionOptions){
		_show.index = arguments.callee.index;
		_show.call(this, function (){
			_transitionInit.call(this, transitionOptions);
			_fadeInit.call(this);
			_removeEventListener.call(this, transitionend, tempFunc2, {once: true});
			this.style.display = _getCache.call(this, 'display');
			var _this = this;
			setTimeout(function (){
				_this.style.opacity = '1';
			}, 20);
			return true;
		});
	}
	function _fadeHide(transitionOptions){
		_hide.index = arguments.callee.index;
		_hide.call(this, function (){
			_transitionInit.call(this, transitionOptions);
			_fadeInit.call(this);
			this.style.opacity = '0';
			_addEventListener.call(this, transitionend, tempFunc2, {once: true});
			return true;
		});
	}
	function tempFunc2(){
		this.style.display = 'none';
	}
	_$$.prototype.fadeShow = function (transitionOptions){
		_each.call(this, _fadeShow, [transitionOptions]);
		return this;
	};
	_$$.prototype.fadeHide = function (transitionOptions){
		_each.call(this, _fadeHide, [transitionOptions]);
		return this;
	};
	_$$.prototype.fadeCssShow = function (){
		
	};
	_$$.prototype.fadeCssHide = function (){
		
	};
	function _slideInit(orientation){
		switch (orientation){
			case 'vert':
				(_getCache.call(this, 'height') === undefined) && _setCache.call(this, 'height', _getCssValue.call(this, 'height'));
				if (_getCssValue.call(this, 'display') === 'none')
					this.style.height = '0';
				break;
			case 'hori':
				(_getCache.call(this, 'width') === undefined) && _setCache.call(this, 'width', _getCssValue.call(this, 'width'));
				if (_getCssValue.call(this, 'display') === 'none')
					this.style.width = '0';
				break;
		}
		this.style.cssText += 'overflow: hidden;';  
	}
	function _slideShowCallback(orientation, fade, transitionOptions){
		_transitionInit.call(this, transitionOptions);
		fade && _fadeInit.call(this);
		switch (orientation){
			case 'vert':
				_slideInit.call(this, 'vert');
				break;
			case 'hori':
				_slideInit.call(this, 'hori');
				break;
		}
		_removeEventListener.call(this, transitionend, tempFunc2, {once: true});
		this.style.display = _getCache.call(this, 'display');
		var _this = this;
		setTimeout(function (){
			switch (orientation){
				case 'vert':
					if (fade){
						_this.style.cssText += _getCache.call(_this, 'height') + ';opacity: 1;';				
					}
					_this.style.height = _getCache.call(_this, 'height');
					break;
				case 'hori':
					if (fade){
						_this.style.cssText += _getCache.call(_this, 'width') + ';opacity: 1;';
					}
					_this.style.width = _getCache.call(_this, 'width');
					break;
			}
		}, 20);
	}
	function _slideHideCallback(orientation, fade, transitionOptions){
		_transitionInit.call(this, transitionOptions);
		fade && _fadeInit.call(this);
		switch (orientation){
			case 'vert':
				_slideInit.call(this, 'vert');
				if (fade){
					this.style.cssText += _getCache.call(this, 'height') + ';opacity: 0;';
				}
				this.style.height = '0';
				break;
			case 'hori':
				_slideInit.call(this, 'hori');
				if (fade){
					this.style.cssText += _getCache.call(this, 'width') + ';opacity: 0;';
				}
				this.style.width = '0';
				break;
		}
		_addEventListener.call(this, transitionend, tempFunc2, {once: true});
	}
	function _slideShow(type, transitionOptions){
		_slideShowCallback.index = arguments.callee.index;
		_show.call(this, function (){
			switch (type){
				case 'slideVert':
					_slideShowCallback.call(this, 'vert', false, transitionOptions);
					break;
				case 'slideHori':
					_slideShowCallback.call(this, 'hori', false, transitionOptions);
					break;
				case 'fadeSlideVert':
					_slideShowCallback.call(this, 'vert', true, transitionOptions);
					break;
				case 'fadeSlideHori':
					_slideShowCallback.call(this, 'hori', true, transitionOptions);
					break;
			}
			return true;
		});
	}
	function _slideHide(type, transitionOptions){
		_slideHideCallback.index = arguments.callee.index;
		_hide.call(this, function (){
			switch (type){
				case 'slideVert':
					_slideHideCallback.call(this, 'vert', false, transitionOptions);
					break;
				case 'slideHori':
					_slideHideCallback.call(this, 'hori', false, transitionOptions);
					break;
				case 'fadeSlideVert':
					_slideHideCallback.call(this, 'vert', true, transitionOptions);
					break;
				case 'fadeSlideHori':
					_slideHideCallback.call(this, 'hori', true, transitionOptions);
					break;
			}
			return true;
		});
	}
	_$$.prototype.slideVertShow = function (transitionOptions){
		_each.call(this, _slideShow, ['slideVert', transitionOptions]);
		return this;
	};
	_$$.prototype.slideVertHide = function (transitionOptions){
		_each.call(this, _slideHide, ['slideVert', transitionOptions]);
		return this;
	};
	_$$.prototype.slideHoriShow = function (transitionOptions){
		_each.call(this, _slideShow, ['slideHori', transitionOptions]);
		return this;
	};
	_$$.prototype.slideHoriHide = function (transitionOptions){
		_each.call(this, _slideHide, ['slideHori', transitionOptions]);
		return this;
	};
	_$$.prototype.fadeSlideVertShow = function (transitionOptions){
		_each.call(this, _slideShow, ['fadeSlideVert', transitionOptions]);
		return this;
	};
	_$$.prototype.fadeSlideVertHide = function (transitionOptions){
		_each.call(this, _slideHide, ['fadeSlideVert', transitionOptions]);
		return this;
	};
	_$$.prototype.fadeSlideHoriShow = function (transitionOptions){
		_each.call(this, _slideShow, ['fadeSlideHori', transitionOptions]);
		return this;
	};
	_$$.prototype.fadeSlideHoriHide = function (transitionOptions){
		_each.call(this, _slideHide, ['fadeSlideHori', transitionOptions]);
		return this;
	};
	function _toggle(type, transitionOptions){
		_showInit.call(this);
		if (_getCache.call(this, 'isShow')){
			switch (type){
				case 'fade':
					_fadeHide.index = arguments.callee.index;
					_fadeHide.call(this, transitionOptions);
					break;
				case 'slideVert':
					_slideHide.index = arguments.callee.index;
					_slideHide.call(this, 'slideVert', transitionOptions);
					break;
				case 'slideHori':
					_slideHide.index = arguments.callee.index;
					_slideHide.call(this, 'slideHori', transitionOptions);
					break;
				case 'fadeSlideVert':
					_slideHide.index = arguments.callee.index;
					_slideHide.call(this, 'fadeSlideVert', transitionOptions);
					break;
				case 'fadeSlideHori':
					_slideHide.index = arguments.callee.index;
					_slideHide.call(this, 'fadeSlideHori', transitionOptions);
					break;
			}
		}
		else {
			switch (type){
				case 'fade':
					_fadeShow.index = arguments.callee.index;
					_fadeShow.call(this, transitionOptions);
					break;
				case 'slideVert':
					_slideShow.index = arguments.callee.index;
					_slideShow.call(this, 'slideVert', transitionOptions);
					break;
				case 'slideHori':
					_slideShow.index = arguments.callee.index;
					_slideShow.call(this, 'slideHori', transitionOptions);
					break;
				case 'fadeSlideVert':
					_slideShow.index = arguments.callee.index;
					_slideShow.call(this, 'fadeSlideVert', transitionOptions);
					break;
				case 'fadeSlideHori':
					_slideShow.index = arguments.callee.index;
					_slideShow.call(this, 'fadeSlideHori', transitionOptions);
					break;
			}
		}
	}
	_$$.prototype.fadeToggle = function (transitionOptions){
		_each.call(this, _toggle, ['fade', transitionOptions]);
		return this;
	};
	_$$.prototype.slideVertToggle = function (transitionOptions){
		_each.call(this, _toggle, ['slideVert', transitionOptions]);
		return this;
	};
	_$$.prototype.slideHoriToggle = function (transitionOptions){
		_each.call(this, _toggle, ['slideHori', transitionOptions]);
		return this;
	};
	_$$.prototype.fadeSlideVertToggle = function (transitionOptions){
		_each.call(this, _toggle, ['fadeSlideVert', transitionOptions]);
		return this;
	};
	_$$.prototype.fadeSlideHoriToggle = function (transitionOptions){
		_each.call(this, _toggle, ['fadeSlideHori', transitionOptions]);
		return this;
	};
	
	_$$.extend = function (newFuncMap){
		_extend.call(this, newFuncMap);
	};
	function _extend(newFuncMap){
		if (typeof newFuncMap === 'object'){
			for (var funcName in newFuncMap){
				_$$.prototype[funcName] = newFuncMap[funcName];
			}
		}
		else {
			_consoleError('添加新方法失败', 'extend()不接受的参数类型');
		}
	}
	
	_$$.prototype.appendChild = function (elem){
		
		return this;
	}
	
	// 字符串类工具封装
	_$$.stringUtil = {
		/*
		* 短横线 > 驼峰
		* @param {String} str - 需要格式化的字符串
		* @return {String} 返回转换完成的字符串
		*/ 
		toCamelCase: function (str){
			
			return str.replace(/-([A-Za-z])/g, function (res, $1){
					return $1.toLocaleUpperCase();
				});
		},
		
		/*
		* 驼峰 > 短横线
		* @param {String} str - 需要格式化的字符串
		* @return {String} 返回转换完成的字符串
		*/
		tokebabCase: function (str){
			return str.replace(/([A-Z])/g, function (res, $1){
					return '-' + $1.toLocaleLowerCase();
				});
		},
		
		/*
		* 删除空白字符
		* @param {String} str - 需要格式化的字符串
		* @return {String} 返回转换完成的字符串
		*/
		trimSpace: function (str) {
			return str.trim().replace(/\s+/g, "");
		},
			
	};
	
	// ajax模块
	function _XMLHR(mXMLHttpRequest){
		this.mXMLHttpRequest = mXMLHttpRequest;
		this.callbackName = undefined;
	}
	_XMLHR.prototype.abort = function (){
		if (this.mXMLHttpRequest){ // JSONP
			_$$[this.callbackName] = function (){};
		}
		else {
			this.mXMLHttpRequest.abort();
		}
	};
	_$$.ajax = function (args){
		var mXMLHttpRequest,
			url,		//url
			method,		//请求类型
			async_,		//true异步,false同步
			contentType,  //设置浏览器头
			data,		//地址参数
			dataType, 	//响应返回数据类型
			jsonp,		//dataType='jsonp'时设置jsonp地址参数名字
			jsonpCallback,	//jsonp回调函数名字
			success,		//请求成功调用函数
			error,		//请求失败调用函数
			complete,	//请求完成调用函数
			timeout,	//设置超时时间
			ontimeout;  //请求超时调用函数
		var XMLHRObj;
		
		argsInit();
		
		if (dataType === "JSONP"){
			XMLHRObj = new _XMLHR(true);
			data && (url += formatData());
			JSONP.call(this);
			return XMLHRObj;
		}
		
		mXMLHttpRequest = createXMLHttpRequest();
		XMLHRObj = new _XMLHR(mXMLHttpRequest);
		method === 'GET' && (data && (url += formatData()));
		mXMLHttpRequest.open(method, url, async_);
		switch (dataType) {
			case "BLOB":
				mXMLHttpRequest.responseType = "blob";
				break;
			case "JSON":
				mXMLHttpRequest.responseType = "json";
				break;
			case "ARRAYBUFFER":
				mXMLHttpRequest.responseType = "arraybuffer";
				break;
			default:
				break;
		}
		mXMLHttpRequest.onreadystatechange = function (){
			switch (this.readyState){
				case 0:
					break;
				case 1:
					mXMLHttpRequest.timeout = timeout;
					mXMLHttpRequest.ontimeout = ontimeout;
					mXMLHttpRequest.setRequestHeader('Content-type', contentType);
					break;
				case 2:
					break;
				case 3:
					break;
				case 4:
					if ((this.status >= 200 && this.status <= 300) || this.status == 304) {
						success && success(mXMLHttpRequest.response);
					}
					else {
						error && error();
					}
					break;
				default:
					break;
			}
			complete && complete();
		};
		method === "GET" ? mXMLHttpRequest.send(null) : mXMLHttpRequest.send(formatData());
		
		
		//封装JSONP
		function JSONP(args){
			var callbackName = jsonpCallback ? jsonpCallback : getRandFuncName();
			
			XMLHRObj.callbackName = callbackName;
			
			this[callbackName] = function (data){
				clearTimeout(timeoutID);
				success && success(data);
				//防止污染,用后删除
				delete this[callbackName];
				script.parentElement.removeChild(script);
				complete && complete();
			};
			
			//拼接url
			url += url.indexOf('?') == -1 ? '?' : '&';
			url += jsonp + '=$$.' + callbackName;
			
			//创建script标签并引入
			var script = document.createElement('script');
			XMLHRObj.script = script;
			script.src = url;
			script.onerror = function (e){
				error && error(e);
			}
			document.getElementsByTagName('head')[0].appendChild(script);
			
			// 请求超时
			var timeoutID;
			if (timeout !== 0){
				timeoutID = setTimeout(function (){
					script.dispatchEvent(new ErrorEvent('error', {"bubbles":true, "cancelable":false}));
				}, timeout);
			}
			
			
	
			//JSONP要回调一个函数
			//生成并提供一个随机函数
			function getRandFuncName(){
				var randFuncArr = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
								  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 
								  'X', 'C', 'V', 'B', 'N', 'M', 
								  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 
								  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 
								  'x', 'c', 'v', 'b', 'n', 'm',
								  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
					randFuncName = '_';
					
				for (var i = 0; i < 50; i++) {
					randFuncName += randFuncArr[Math.floor(Math.random() * 100 % 62)];
				}
				
				return randFuncName;
			}
			
		}
		
		//封装XMLHttpRequest
		function createXMLHttpRequest() {
			var obj;
			//判断浏览器版本
			if (window.XMLHttpRequest) {
				//Chrome、IE7+、Firefox、Safari、Opera (XMLHttpRequest)
				obj = new XMLHttpRequest();
			} 
			else {
				// IE6, IE5 (ActiveXObject)
				obj = new ActiveXObject("Microsoft.XMLHTTP");
			}
			return obj;
		}
		
		//格式化data
		function formatData(){
			var str = "";
			str += url.indexOf('?') == -1 ? '?' : '&';
			for (var i in data) {
				str += i + "=" + data[i] + "&";
			}
			str = str.replace(/&$/, "");
			return str;
		}
		
		//参数初始化
		function argsInit(){
			if (typeof args.url === 'string'){ url = args.url;}
			else { throw new Error('$$.ajax()不接受的url参数类型');}
			
			if (!args.method){ method = 'GET';}
			else if (typeof args.method === 'string') { method = args.method.toUpperCase();} 
			else {
				_consoleError('ajax错误', '不接受的method参数类型');
				method = 'GET';
			}
			
			if (!args.async_){ async_ = true;}
			else if (typeof args.async_ === 'boolean'){ async_ = args.async_;}
			else {
				_consoleError('ajax错误', '不接受的async_参数类型');
				async_ = true;
			}
			
			if (!args.contentType){ contentType = 'application/x-www-form-urlencoded';}
			else if (typeof args.contentType === 'string'){ contentType = args.contentType;}
			else {
				_consoleError('ajax错误', '不接受的contentType参数类型');
				contentType = 'application/x-www-form-urlencoded';
			}
			
			if (!args.data){ data = false;}
			else if (typeof args.data === 'object'){ data = args.data;}
			else {
				_consoleError('ajax错误', '不接受的data参数类型');
				data = false;
			}
			
			if (!args.dataType){ dataType = 'json';}
			else if (typeof args.dataType === 'string'){ dataType = args.dataType.toUpperCase();} 
			else { 
				_consoleError('ajax错误', '不接受的dataType参数类型');
				dataType = 'json';
			}
			
			if (!args.jsonp){ jsonp = 'callback';}
			else if (typeof args.jsonp === 'string'){ jsonp = args.jsonp;} 
			else {
				_consoleError('ajax错误', '不接受的jsonp参数类型');
				jsonp = 'callback';
			}
			
			if (!args.jsonpCallback){ jsonpCallback = false;}
			else if (typeof args.jsonpCallback === 'string') { jsonpCallback = args.jsonpCallback;} 
			else{
				_consoleError('ajax错误', '不接受的jsonpCallback参数类型');
				jsonpCallback = false;
			}
			
			if (!args.success){ success = false;}
			else if (typeof args.success === 'function'){ success = args.success;}
			else {
				 _consoleError('ajax错误', '不接受的success参数类型');
				 success = false;
			}
			
			if (!args.error){ error = false;}
			else if (typeof args.error === 'function'){ error = args.error;}
			else {
				_consoleError('ajax错误', '不接受的error参数类型');
				error = false;
			}
			
			if (!args.complete){ complete = false;}
			else if (typeof args.complete === 'function'){ complete = args.complete;}
			else {
				_consoleError('ajax错误', '不接受的complete参数类型');
				complete = false;
			}
			
			if (!args.timeout){ timeout = 0;}
			else if (typeof args.timeout === 'number'){ timeout = args.timeout;}
			else {
				_consoleError('ajax错误', '不接受的timeout参数类型');
				timeout = 0;
			}
			
			if (!args.ontimeout){ ontimeout = false;}
			else if (typeof args.ontimeout === 'function'){ ontimeout = args.ontimeout;}
			else {
				_consoleError('ajax错误', '不接受的ontimeout参数类型');
				ontimeout = false;
			}
		}
		
		return XMLHRObj;
	};
	
	_$$.each = function (func){
		
	}
	
	// 控制台输出错误
	function _consoleError(title, detail){
		console.groupCollapsed(title);
		console.warn(detail);
		console.groupEnd();
	}
	
	// 检测浏览器添加事件监听第三个参数是否支持options对象
	function _supportAddEventListener() {
	    var support = false;
	    try {
	       addEventListener("test", null, Object.defineProperty({}, 'passive', {
	            get: function () {
	                support = true;
	            }
	        }));
	    } catch(e){}
	    return support;
	}
	
	// transitione属性兼容
	var transition, transitionend, transitioncancel;
	function _supportTransition(){
		var transitionList = ['transition', 'mozTransition', 'webkitTransition', 'oTransition'],
			transitionendMap = {
				transition: 'transitionend',
				mozTransition: 'mozTransitionend',
				webkitTransition: 'webkitTransitionend',
				oTransition: 'oTransitionend',
			},
			transitioncancelMap = {
				transition: 'transitioncancel',
				mozTransition: 'mozTransitioncancel',
				webkitTransition: 'webkitTransitioncancel',
				oTransition: 'oTransitioncancel',
			};
		
		for (var i in transitionList){
			if (document.body.style[transitionList[i]] !== undefined){
				transition = transitionList[i];
				transitionend = transitionendMap[transition];
				transitioncancel = transitioncancelMap[transition];
				break;
			}
		}
	}
	
	window.$$ = _$$;
	
	return _$$;
}) );
