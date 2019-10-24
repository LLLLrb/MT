(function (){
	$$.ajax({
		url: "./navmenu.json",
		success: function (data){
			var data = JSON.parse(data),
				navmenu = $$('.nav-menu');
			
			for (var i = 0; i < data.length; i++){
				var dropdown = document.createElement('div'),
					toggle = document.createElement('a'),
					layer = document.createElement('div');
				
				// toggle
				toggle.classList.add("dropdown-toggle");
				toggle.classList.add("navmenu-dropdown-toggle");
				toggle.setAttribute('href', data[i].url);
				var span1 = document.createElement('span'),
					span2 = document.createElement('span');
				span1.classList.add("fl");
				span1.innerHTML = data[i].title;
				span2.classList.add("fr");
				span2.innerHTML = ">";
				toggle.appendChild(span1);
				toggle.appendChild(span2);
				
				// layer
				layer.classList.add("dropdown-layer");
				layer.classList.add("navmenu-dropdown-layer");
				
				// dropdown
				dropdown.classList.add("dropdown");
				dropdown.classList.add("navmenu-dropdown");
				dropdown.appendChild(toggle);
				dropdown.appendChild(layer);
				
				navmenu.addChild(dropdown);
			}
		},
	});
})()


