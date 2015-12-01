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
		info: {
			ax5docs: {
				css_src: "src/ax5docs/css",
				css_dest: "src/ax5docs/css",
				ax5core: "src/ax5docs/_assets/lib/ax5core"
			},
			ax5core: {
				src: "src/ax5core/js",
				dest: "src/ax5core/dist",
				doc_src: "src/ax5docs/_src_ax5core",
				doc_dest: "src/ax5docs/ax5core"
			},
			"bootstrap-ax5dialog": {
				doc_src: "src/ax5docs/_src_bootstrap-ax5dialog",
				doc_dest: "src/ax5docs/bootstrap-ax5dialog"
			}
		},
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			ax5docs: {
				files: ['<%= info["ax5docs"].css_src %>/**/*.scss'],
				tasks: ['sass:ax5docs']
			},
			ax5core: {
				files: ['<%= info["ax5core"].src %>/**/*.js'],
				tasks: ['concat:ax5docs', 'uglify:ax5core', 'copy:ax5core']
			},
			"ax5docs-ax5core": {
				files: ['<%= info.ax5core.doc_src %>/**/*.html', '<%= info.ax5core.doc_src %>/_layouts/*.*'],
				tasks: ['make-menu:ax5core', 'ax_marko:ax5core']
			},
			"ax5docs-bootstrap-ax5dialog": {
				files: ['<%= info["bootstrap-ax5dialog"].doc_src %>/**/*.html', '<%= info["bootstrap-ax5dialog"].doc_src %>/_layouts/*.*'],
				tasks: ['make-menu:bootstrap-ax5dialog', 'ax_marko:bootstrap-ax5dialog']
			}
		},
		copy: {
			ax5core: {
				files: [
					// includes files within path
					{expand: true, flatten: true, src: ['<%= info["ax5core"].dest %>/*'], dest: '<%= info["ax5docs"].ax5core %>/', filter: 'isFile'},
				]
			}
		},
		concat: {
			options: {
				stripBanners: true,
				separator: ';',
				banner: '/*\n' +
				' * <%= pkg.name %> - v<%= pkg.version %> \n' +
				' * <%= grunt.template.today("yyyy-mm-dd") %> \n' +
				' */\n\n',
				separator: '\n\n'
			},
			ax5core: {
				src: ['<%= info["ax5core"].src %>/ax5-polyfill.js', '<%= info["ax5core"].src %>/ax5-core.js', '<%= info["ax5core"].src %>/ax5-ui.js'],
				dest: '<%= info["ax5core"].dest %>/ax5core.js'
			}
		},
		uglify: {
			options: {
				mangle: false,
				preserveComments: false
			},
			ax5core: {
				files: {
					'<%= info["ax5core"].dest %>/ax5core.min.js': ['<%= info["ax5core"].dest %>/ax5core.js']
				}
			}
		},
		sass: {
			options: {
				noLineComments: true,
				outputStyle: 'nested',
				spawn: false
			},
			ax5docs: {
				files: {
					'<%= info["ax5docs"].css_dest %>/demo.css': '<%= info["ax5docs"].css_src %>/demo.scss'
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
						src_root: '<%= info.ax5core.doc_src %>',
						src: ['<%= info.ax5core.doc_src %>/**/*.html'],
						global_data: { // append data
							layout_path: '<%= info.ax5core.doc_src %>/_layouts/basic.marko', // src relative path
							output_type: 'html'
						},
						lang: '<%= info.ax5core.doc_src %>/_layouts/ko.json',
						dest: '<%= info.ax5core.doc_dest %>',
						output_extension: 'html'
					}
				]
			},
			"bootstrap-ax5dialog": {
				options: {
					preserveWhitespace: true // expected output whitespace
				},

				files: [
					{
						src_root: '<%= info["bootstrap-ax5dialog"].doc_src %>',
						src: ['<%= info["bootstrap-ax5dialog"].doc_src %>/**/*.html'],
						global_data: { // append data
							layout_path: '<%= info["bootstrap-ax5dialog"].doc_src %>/_layouts/basic.marko', // src relative path
							output_type: 'html'
						},
						lang: '<%= info["bootstrap-ax5dialog"].doc_src %>/_layouts/ko.json',
						dest: '<%= info["bootstrap-ax5dialog"].doc_dest %>',
						output_extension: 'html'
					}
				]
			}
		},
		/**
		 * marko가 만들어낸 html.js 파일을 정리해주는 task
		 */
		clean: {
			marko: [
				'<%= info["ax5core"].doc_src %>/**/*.html.js',
				'<%= info["bootstrap-ax5dialog"].doc_src %>/**/*.html.js'
			]
		},
		/**
		 * demo 파일구조대로 json 생성
		 */
		"make-menu": {
			ax5core: {
				options: {
					pwd: '',
					target: 'src/ax5docs/_assets/js/ax5core-menus.js',
					url_replace: function(url) {
						return url.replace("src/ax5docs/_src_", "/");
					},
					filter: ['<%= info["ax5core"].doc_src %>/**/*.html', '!<%= info["ax5core"].doc_src %>/index.html'] // _demo/index.html 은 제외 하고 모든 html을 대상
				}
			},
			"bootstrap-ax5dialog": {
				options: {
					pwd: '',
					target: 'src/ax5docs/_assets/js/bootstrap-ax5dialog-menus.js',
					url_replace: function(url) {
						return url.replace("src/ax5docs/_src_", "/");
					},
					filter: ['<%= info["bootstrap-ax5dialog"].doc_src %>/**/*.html', '!<%= info["bootstrap-ax5dialog"].doc_src %>/index.html'] // _demo/index.html 은 제외 하고 모든 html을 대상
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ax-marko');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('ax5core', ['concat:ax5core', 'uglify:ax5core', 'copy:ax5core', 'watch:ax5core']);
	grunt.registerTask('sass-ax5docs', ['sass:ax5docs', 'watch:ax5docs']);
	grunt.registerTask('tmpl-ax5core', ['make-menu:ax5core', 'ax_marko:ax5core', 'watch:ax5docs-ax5core']);
	grunt.registerTask('tmpl-bootstrap-ax5dialog', ['make-menu:bootstrap-ax5dialog', 'ax_marko:bootstrap-ax5dialog', 'watch:ax5docs-bootstrap-ax5dialog']);
};