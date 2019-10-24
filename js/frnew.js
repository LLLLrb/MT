(function (){
	$$.ajax({
		url: "./frnew.json",
		success: function (data){
			var data = JSON.parse(data),
				$$service = $$('.focus-right-new'),
				$$dl = $$('dl', $$service);
				
			for (var i = 0; i < data.length; i++) {
				var a = document.createElement('a'),
					dd = document.createElement('dd');
				a.classList.add('item');
				a.classList.add('textOverflow');
				a.classList.add('fl');
				a.setAttribute('href', data[i].url);
				a.innerHTML = '[' + data[i].mark + ']' + ' ' + data[i].title;
				dd.appendChild(a);
				$$dl.addChild(a);
			}
		}
	});
})();