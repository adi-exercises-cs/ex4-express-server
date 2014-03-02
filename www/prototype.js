// this is from the console log, commented out is the output, you can see that it follows the demand of the exercise
var a = {a:true};
//undefined
a.__proto__.__proto__;
//null <<<<<<<<<<<<<<<
function B() {};
//undefined
B.prototype = a;
//Object {a: true}
var b = new B();
//undefined
b.__proto__;
//Object {a: true} <<<<<<<<<<<<<<<
function C() {};
//undefined
C.prototype = b;
//B {a: true}
var c = new C();
//undefined
c.__proto__;
//B {a: true} <<<<<<<<<<<<<<<
function D() {};
//undefined
D.prototype = c;
//C {a: true}
var d = new D();
//undefined
d.__proto__;
//C {a: true} <<<<<<<<<<<<<<<