# 테스트 가이드

## 테스트 환경 설정
```bash
# 제일 먼저 ax5ui-kernel의 경로로 이동합니다.
$ cd ./ax5ui-kernel
# 테스트에 필요한 mocha와 karma를 global 옵션으로 설치합니다.
$ npm install mocha karma -g
# 각 테스트 모듈안에 node module을 한 번에 설치하기위해 gulp의 test-npm-install task를 실행합니다.
# 이 작업은 상당히 오래 걸릴 수 있으니 차 한 잔 마시며 기다립니다.
$ gulp test-npm-install
```

## 테스트 실행

### 브라우저에서 실행하기
```bash
# 단일 테스트 실행
# use mocha
open ./ax5ui-kernel/src/{{module}}/test/test.{{module}}.html
```

### 콘솔에서 실행하기
```bash
# 전체 테스트 실행
# use karma
$ npm test
```

## 테스트 코드 작성 가이드
### ax5의 테스트는 아래 세 가지 라이브러리 및 도구를 사용하고 있습니다.
1. [Should.js - assertion library](https://github.com/shouldjs/should.js)
1. [mocha - test framework](https://mochajs.org/)
1. [karma - test runner](https://karma-runner.github.io)

### 테스트 코드 작성 순서는 아래와 같습니다.
1. 테스트 폴더에 test.{{module}}.html 파일을 만듭니다.
1. 테스트 폴더에 test.{{module}}.js 파일을 만듭니다.
1. 내용을 아래 코드를 참고해서 채워주세요.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>ax5.util TYPE testing</title>
    <link rel="stylesheet" type="text/css" href="../dist/ax5dialog.css"/>
    <link rel="stylesheet" href="../node_modules/mocha/mocha.css"/>
    <script type="text/javascript" src="../node_modules/mocha/mocha.js"></script>
    <script type="text/javascript" src="../node_modules/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="../node_modules/should/should.js"></script>
    <script type="text/javascript" src="../node_modules/lodash/lodash.js"></script>
    <script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
    <script type="text/javascript" src="../dist/{{module}}.js"></script>
</head>
<body>
<div id="mocha"></div>

<script>mocha.setup('bdd')</script>
<script type="text/javascript" src="test.{{module}}.js"></script>
<script>mocha.run();</script>
</body>
</html>
```

```js
describe('테스트에 대한 설명을 적어주세요.', function(){
    it('테스트의 input, output을 적어주세요.', function(done){
    	// TODO test
    });
});
```