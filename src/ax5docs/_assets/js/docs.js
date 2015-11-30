var fn_docs = (function() {
	return {
		_data: {},
		_jos: {}, // jquery objects 저장소
		menu: {
			print: function(menus) {

				var currentPath = (function(){
					var paths = location.pathname.split(/\//g);
					paths.shift();
					paths.pop();
					return paths.join('/') + "/";
				})();
				
				var po = [];
				for (var i = 0, l = menus.length, menu; i < l; i++) {
					menu = menus[i];
					po.push('<a href="' + menu.url.substr(currentPath.length) + '">' + menu.label + '</a>');
				}
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
});