function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne;

  return function render(data, out) {
    out.w('<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta http-equiv="refresh" content="0; url=install">\n\t<title></title>\n\n</head>\n<body>\n\ub9ac\ub2e4\uc774\ub809\ud2b8\n</body>\n</html>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);