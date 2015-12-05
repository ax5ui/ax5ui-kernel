var fn_docs = (function() {
	return {
		_data: {},
		_jos: {}, // jquery objects 저장소
		menu: {
			print: function(menus) {

				var currentPath = (function() {
					var pathname = location.pathname;
					pathname = pathname.substr(pathname.indexOf('/demo'));
					var paths = pathname.split(/\//g);
					paths.shift();
					paths.pop();
					return paths.join('/').split('/').length;
				})();
				
				var getUrl = function(url){
					var diff_depth = 3 - (url.split(/\//g).length - currentPath);
					var pre_url = [];
					for(var i=0;i<diff_depth;i++) pre_url.push("../");
					return pre_url.join("") + url;
				};
				
				var po = [];
				po.push('<div class="demo-menu-group-container">');
				for (var i = 0, l = menus.length, menu; i < l; i++) {
					menu = menus[i];
					po.push('<ul class="demo-menu-group">');
					po.push('<li class="demo-menu-group-title">');
					if (menu.url) {
						po.push('<a href="' + getUrl(menu.url) + '">' + menu.title + '</a>');
					}
					else {
						po.push(menu.title);
					}
					po.push('</li>');
					
					if (menu.child && menu.child.length > 0) {
						po.push('<ul class="demo-menu-group-child">');
						
						menu.child.forEach(function(c) {
							//console.log(currentPath, c.url);
							po.push('<li><a href="' + getUrl(c.url) + '">' + c.title + '</a></li>');
						});
						po.push('</ul>');
					}
					po.push('</ul>');
				}
				po.push('</div>');
				fn_docs._jos["menu-target"].html(po.join(''));
			}
		}
	}
})();

$(document.body).ready(function() {
	if (window.fn_docs) {
		fn_docs._jos["menu-target"] = $("#demo-menu-print-target");
		fn_docs.menu.print(window.doc_menu_object || []);
	}
	
	//prettyPrint();
});