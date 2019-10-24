(function (){
	function _dropDown(elem, options){
		this.elem = elem;
		this.options = options;
		this.layer = $$('.dropdown-layer', this.elem);
		this.input = $$('input', this.elem);
	}
	_dropDown.DEFAULT = {
		type: 'mouse',
		effect: 'fade'
	}
	_dropDown.prototype.showHide = function (){
		var timeOutID,
			_dropDownObj = this;
		switch (this.options.type){
			case 'mouse':
				$$(this.elem).addEventListener('mouseenter', function (){
					timeOutID = setTimeout(function (){
						show();						
					}, 300);
				}).addEventListener('mouseleave', function (){
					clearTimeout(timeOutID);
					hide();
				});
				break;
			// case 'dbclick':
			// case 'click':
			// 	$$(this.elem).addEventListener(options.type, function (event){
			// 		event.stopPropagation();
			// 		show();															
			// 		$$(document).removeEventListener('click', temp, {once: true});
			// 		$$(document).addEventListener('click', temp, {once: true});
			// 	});
			// 	break;
			case 'search':
				this.input.addEventListener('focus', function (event){
					if (_dropDownObj.layer.elemList[0].firstElementChild){
						show();
					}																	
				}).addEventListener('input', function (event){		
					var keyword = $$.stringUtil.trimSpace(this.value);
					if (keyword === ''){
						hide();
						return ;
					}
					show();
				}).addEventListener('click', function (e){
					e.stopPropagation(); 
				});
				$$(document).addEventListener('click', temp);
				break;
			default:
				break;
		}
		function temp(){
			hide();
		}
		function show(){
			_dropDownObj.layer[_dropDownObj.options.effect + 'Show'] ? _dropDownObj.layer[_dropDownObj.options.effect + 'Show']() : _dropDownObj.layer.silentShow();
		}
		function hide(){
			_dropDownObj.layer[_dropDownObj.options.effect + 'Hide'] ? _dropDownObj.layer[_dropDownObj.options.effect + 'Hide']() : _dropDownObj.layer.silentHide();
		}
	};
	_dropDown.prototype.load = function (){
		var _dropDownObj = this;
		if ($$(this.elem).dataset('load')[0]){
			this.layer.addEventListener('elemshow', function (){
				if ($$(this).cache('isLoad')[0]){
					return ;
				}
				var _this = this;
				setTimeout(function (){
					$$.ajax({
						url: './dropdown-buyer.json',
						success: function (data){
							data = JSON.parse(data);
							while (_this.hasChildNodes()){
								_this.removeChild(_this.firstChild);
							}
							for (var i in data) {
								var li = document.createElement('li'),
									a = document.createElement('a');
								a.classList.add('a');
								a.classList.add('trans');
								a.setAttribute('href', data[i].url);
								a.innerText = data[i].content;
								li.appendChild(a);
								_this.appendChild(li);
							}
							$$(_this).cache('isLoad', true);
						}
					});
				}, 1000);
					
			});
		}
	};
	
	$$.extend({
		dropDown: function (options){
			if (typeof options !== 'object'){
				options = _dropDown.DEFAULT;
			}
			else {
				options = {
					type: options.type || _dropDown.DEFAULT.type,
					effect: options.effect || _dropDown.DEFAULT.effect
				};
			}
			this.each(function (){
				var _dropDownObj = $$(this).cache('_dropDownObj');
				if (!_dropDownObj[0]){ //单例
					_dropDownObj = new _dropDown(this, options);
					$$(this).cache('_dropDownObj', _dropDownObj);
				}
				_dropDownObj.showHide();
				_dropDownObj.load();
			});
		}
	});
})();