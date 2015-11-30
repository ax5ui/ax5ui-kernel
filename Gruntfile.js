module.exports = function(grunt) {

	/**
	 *  xml 문서의 특정 구조를 JSON으로 변환해주는 기능 담당
	 */
	var htmlparser = require("htmlparser");

	/**
	 *  module inline 생성 : demo 폴더의 구조를 크롤링하여 demo-resource/js/menus.js 만들어냄
	 */
	grunt.registerMultiTask('make-menu', '', function() {
		var options = this.options({});
		var file_names = grunt.file.expand({cwd: options.pwd}, options.filter);
		var menus = [];
		file_names.forEach(function(src) {
			var meta = (function() {
				var rawHtml = grunt.file.read(src);
				var handler = new htmlparser.DefaultHandler(
					function(error) {}, {verbose: false, ignoreWhitespace: true}
				);
				var parser = new htmlparser.Parser(handler);
				parser.parseComplete(rawHtml);
				//grunt.log.writeln(JSON.stringify(handler.dom));

				var obj = {};
				handler.dom.forEach(function(n) {
					if (n.name == "tmpl-metadata") {
						n.children.forEach(function(m) {
							if (m.children) obj[m.name] = m.children[0].data;
						});
						return false;
					}
				});
				return obj;
			})();

			var menu = {
				url: options.url_replace(src)
			};

			// extend object
			for (var k in meta) {
				menu[k] = meta[k];
			}
			menus.push(menu);
		});

		//grunt.log.writeln(JSON.stringify(menus));
		grunt.file.write(options.target, "var doc_menu_object = " + JSON.stringify(menus) + ";");
	});

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			css: {
				files: ['_src/scss/**/*.scss'],
				tasks: ['sass:theme_n_demo']
			},
			js: {
				files: ['_src/**/*.js'],
				tasks: ['concat']
			},
			tmpl: {
				files: ['_demo/**/*.html', '_demo/_layouts/*.*'],
				tasks: ['make-menu-json', 'ax_marko:run_demo']
			}
		},
		concat: {
			options: {
				stripBanners: true,
				separator: ';',
				banner: '/*\n' +
				' * <%= pkg.name %> - v<%= pkg.version %> \n' +
				' * <%= grunt.template.today("yyyy-mm-dd") %> \n' +
				' * www.axisj.com Javascript UI Library\n' +
				' * \n' +
				' * Copyright 2013, 2015 AXISJ.com and other contributors \n' +
				' * Released under the MIT license \n' +
				' * www.axisj.com/ax5/license \n' +
				' */\n\n',
				separator: '\n\n'
			},
			dist: {
				src: ['_src/ax5-polyfill.js', '_src/ax5-core.js', '_src/ax5-ui.js', '_src/ui-classes/*.js'],
				dest: 'pub/ax5-<%= pkg.version %>.js'
			}
		},
		uglify: {
			options: {
				mangle: false,
				preserveComments: false
			},
			publish: {
				files: {
					'pub/ax5.min.js': ['pub/ax5-<%= pkg.version %>.js']
				}
			}
		},
		sass: {
			options: {
				noLineComments: true,
				outputStyle: 'nested',
				spawn: false
			},
			theme_n_demo: {
				files: {
					'demo-resource/css/demo.css': 'demo-resource/css/demo.scss',
					/// theme를 확장한다면 json 추가
					'pub/css/basic/ax5.css': '_src/scss/basic/ax5.scss'
				}
			}
		},
		ax_marko: {
			ax5core: {
				options: {
					preserveWhitespace: true // expected output whitespace
				},

				files: [
					{
						src_root: "src/ax5docs/_src_ax5core",
						src: ["src/ax5docs/_src_ax5core/**/*.html"],
						global_data: { // append data
							layout_path: "src/ax5docs/_src_ax5core/_layouts/basic.marko", // src relative path
							output_type: "html"
						},
						lang: "src/ax5docs/_src_ax5core/_layouts/ko.json",
						dest: "src/ax5docs/ax5core",
						output_extension: "html"
					}
				]
			},
			"bootstrap-ax5dialog": {
				options: {
					preserveWhitespace: true // expected output whitespace
				},

				files: [
					{
						src_root: "src/ax5docs/_src_bootstrap-ax5dialog",
						src: ["src/ax5docs/_src_bootstrap-ax5dialog/**/*.html"],
						global_data: { // append data
							layout_path: "src/ax5docs/_src_bootstrap-ax5dialog/_layouts/basic.marko", // src relative path
							output_type: "html"
						},
						lang: "src/ax5docs/_src_bootstrap-ax5dialog/_layouts/ko.json",
						dest: "src/ax5docs/bootstrap-ax5dialog",
						output_extension: "html"
					}
				]
			}
		},

		/**
		 * marko가 만들어낸 html.js 파일을 정리해주는 task
		 */
		clean: {
			marko: [
				"src/ax5docs/_src_ax5core/**/*.html.js"
			]
		},

		/**
		 * demo 파일구조대로 json 생성
		 */
		"make-menu": {
			ax5core: {
				options: {
					pwd: '',
					target: 'src/ax5docs/assets/js/ax5core-menus.js',
					url_replace: function(url) {
						return url.replace("src/ax5docs/_src_", "/");
					},
					filter: ['src/ax5docs/_src_ax5core/**/*.html', '!src/ax5docs/_src_ax5core/index.html'] // _demo/index.html 은 제외 하고 모든 html을 대상
				}
			},
			"bootstrap-ax5dialog": {
				options: {
					pwd: '',
					target: 'src/ax5docs/assets/js/bootstrap-ax5dialog-menus.js',
					url_replace: function(url) {
						return url.replace("src/ax5docs/_src_", "/");
					},
					filter: ['src/ax5docs/_src_bootstrap-ax5dialog/**/*.html', '!src/ax5docs/_src_bootstrap-ax5dialog/index.html'] // _demo/index.html 은 제외 하고 모든 html을 대상
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ax-marko');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('sass-run', ['sass:theme_n_demo', 'watch:css']);
	grunt.registerTask('tmpl-run', ['make-menu-json', 'ax_marko:ax5core', 'watch:tmpl']);
};