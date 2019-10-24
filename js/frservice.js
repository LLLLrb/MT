(function (){
	$$.ajax({
		url: "./frservice.json",
		success: function (data){
			var data = JSON.parse(data),
				service = $$('.focus-right-service');
			
			for (var i = 0; i < data.length; i++) {
				var a = document.createElement('a'),
					span = document.createElement('span');
				a.classList.add('item');
				a.classList.add('fl');
				a.setAttribute('href', data[i].url);
				a.style.background = 'url(' + data[i].icon + ') no-repeat center 17px';
				span.classList.add('content');
				span.innerHTML = data[i].title;
				a.appendChild(span);
				service.addChild(a);
			}
		}
	});
})();