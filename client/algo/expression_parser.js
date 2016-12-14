// ExpressionParser class

const VALUE_NUM = 0,  // 
      LEVEL_1 = 1,
      LEVEL_2 = 2,
      PRIMARY = 1,  // ExpressionParser constants
      OPERATOR = 2,
      FUNCTION = 4,
      LPAREN = 8,
      RPAREN = 16,
      COMMA = 32,
      SIGN = 64,
      CALL = 128,
      NULLARY_CALL = 256;


export class Token {
    constructor(t_type, t_index, priority, number) {
        this.type_ = t_type;
        this.index_ = t_index || 0;
        this.priority = priority || 0;
        this.number_ = number || 0;
    }
}


export class MathExpression {
    constructor(tokens, lvl1, lvl2, funcs) {
        this.tokens = tokens;
        this.lvl1 = lvl1;
        this.lvl2 = lvl2;
        this.funcs = funcs;
    }

    evaluate() {
        var nstack = [];
        var L = this.tokens.length;
        
        for(var i = 0; i < L; i++) {
            item = this.tokens[i];
            type_ = item.type_;
            if (type_ == VALUE_NUM) {
                nstack.push(item.number_);
            } else if (type_ == LEVEL_2) {
                n2 = nstack.pop();
                n1 = nstack.pop();
                f = this.lvl2[item.number_];
                nstack.push(f(n1, n2));
            } else if (type_ == LEVEL_1) {
                n1 = nstack.pop();
                f = this.lvl1[item.index_];
                nstack.push(f(n1));
            } else {
                console.log("ERROR! MathExpression MISTAKE!");
            }
        }
        
        if (nstack) {
            console.log("ERROR! MathExpression WRONG SYNTAX!");
        }
    
        return nstack[0];
    }
}


export class ExpressionParser {
    constructor() {
        this.success = false;
        this.errormsg = '';
        this.expression = '';

        this.pos = 0;

        this.tokennumber = 0;
        this.tokenprio = 0;
        this.tokenindex = 0;
        this.tmpprio = 0;

        this.lvl1 = {
            'sin': Math.sin,
            'cos': Math.cos,
            '-': this.neg,
        };

        this.lvl2 = {
            '+': this.add,
            '-': this.sub,
            '*': this.mul,
            '/': this.div,
        };

        this.functions = {
        };

        this.consts = {
            'E': Math.E,
            'PI': Math.PI,
        };

        this.values = {
            'sin': Math.sin,
            'cos': Math.cos,
        };
    }

    add(a, b) {
        return a + b;
    }

    sub(a, b) {
        return a - b;
    }

    mul(a, b) {
        return a * b;
    }

    div(a, b) {
        return a / b;
    }

    neg(a) {
        return -a;
    }

    parse(expr) {
        this.errormsg = '';
        this.success = true;
        this.tmpprio;
        this.expression = expr;
        this.pos = 0;

        var operstack = [],
            tokenstack = [],
            expected = PRIMARY | LPAREN | FUNCTION | SIGN,
            noperators = 0;

        while (this.pos < this.expression.length) {
            if (this.isOperator()) {  // Operator case
                if (this.isSign() && expected & SIGN) {
                    if (isNegativeSign()) {
                        this.tokenprio = 5;
                        this.tokenindex = '-';
                        noperators += 1;
                        this.addFunc(tokenstack, operstack, LEVEL_1);
                    }
                    expected = PRIMARY | LPAREN | FUNCTION | SIGN;
                } else {
                    if (expected && OPERATOR == 0) {
                        this.error_parsing(this.pos, 'wrong operator');
                        return;
                    }
                    noperators += 2;
                    this.addFunc(tokenstack, operstack, LEVEL_2);
                    expected = PRIMARY | LPAREN | FUNCTION | SIGN;
                }
            } else if (this.isNumber()) {  // Number case
                if (expected && this.PRIMARY == 0) {
                    this.error_parsing(this.pos, 'wrong number');
                    return;
                }
                var token = new Token(VALUE_NUM, 0, 0, this.tokennumber);
                tokenstack.push(token);
                expected = OPERATOR | RPAREN | COMMA;
            } else if (this.isString()) {
                if ((expected & PRIMARY) == 0) {
                    this.error_parsing(this.pos, 'wrong string');
                    return;
                }
                var token = new Token(VALUE_NUM, 0, 0, this.tokennumber);
                tokenstack.push(token);
                expected = OPERATOR | RPAREN | COMMA;
            } else if (this.isLeftParenth()) {  // Left parenth case
                if ((expected & LPAREN) == 0) {
                    this.error_parsing(this.pos, 'unexpected \"(\"');
                    return;
                }
                if (expected & CALL) {
                    noperators += 2;
                    this.tokenprio = -2;
                    this.tokenindex = -1;
                }
                expected = PRIMARY | LPAREN | FUNCTION | SIGN | NULLARY_CALL;
            } else if (this.isRightParenth()) {  // Right parenth case
                if (expected & NULLARY_CALL) {
                    var token = new Token(VALUE_NUM, 0, 0, []);
                    tokenstack.push(token);
                } else if ((expected & RPAREN) == 0 ){
                    this.error_parsing(this.pos, 'unexpected \")\"');
                    return;
                }
                expected = OPERATOR | RPAREN | COMMA | LPAREN | CALL;
            } else if (this.isComma()) {
                if ((expected & COMMA) == 0) {
                    this.error_parsing(this.pos, 'unexpected \",\"');
                    return;
                }
                this.addFunc(tokenstack, operstack, LEVEL_2);
                noperators += 2;
                expected = PRIMARY | LPAREN | FUNCTION | SIGN;
            } else if (this.isLvl2()) {
                if ((expected & FUNCTION) == 0) {
                    this.error_parsing(this.pos, 'unexpected function');
                    return;
                }
                this.addFunc(tokenstack, operstack, LEVEL_2);
                noperators += 2;
                expected = LPAREN;
            } else if (this.isLvl1()) {
                if ((expected & FUNCTION) == 0) {
                    this.error_parsing(this.pos, 'unexpected function');
                    return;
                }
                this.addFunc(tokenstack, operstack, LEVEL_1);
                noperators += 1;
                expected = this.LPAREN;
            } else if (this.isWhite()) {
                // 
            } else {
                if (this.errormsg == '') {
                    this.error_parsing(this.pos, 'unknown character');
                    return;
                } else {
                    this.error_parsing(this.pos, this.errormsg);
                    return;
                }
            }
        }

        if (this.tmpprio < 0 || this.tmpprio >= 10) {
            this.error_parsing(this.pos, 'unmatched \"()\"');
            return;
        }

        var tmp = null;
        while (operstack.length > 0) {
            tmp = operstack.pop();
            tokenstack.push(tmp);
        }

        if ((noperators + 1) != tokenstack.length) {
            this.error_parsing(this.pos, 'parity');
            return;
        }

        return new MathExpression(
            tokenstack, this.lvl1, this.lvl2, this.functions);
    }

    evaluate(expr, variables) {
        return this.parse(expr).evaluate(variables);
    }

    error_parsing(column, msg) {
        this.success = false;
        this.errormsg = 'parse error [column ' + parseInt(column) + ']: ' + msg;
        console.log('ERROR: ', this.errormsg);
        return;
    }

    addFunc(tokenstack, operstack, type_) {
        var operator = new Token(
            type_,
            this.tokenindex,
            this.tokenprio + this.tmpprio,
            0);

        while (operstack.length > 0) {
            if (operator.priority <= operstack[operstack.length - 1].priority) {
                tokenstack.push(operstack.pop());
            } else {
                break;
            }
        }
        operstack.push(operator);
    }

    unescape(v, pos) {
        var buff = [],
            escaping = false;

        var c = null;
        for (var i = 0; i < v.length; i++) {
            c = v[i];
            
            if (escaping) {
                if (c == "'") {
                    buff.push("'");
                    break;
                } else if (c == '\\') {
                    buff.push('\\');
                    break;
                } else if (c == '/') {
                    buff.push('/');
                    break;
                } else if (c == 'b') {
                    buff.push('\b');
                    break;
                } else if (c == 'f') {
                    buff.push('\f');
                    break;
                } else if (c == 'n') {
                    buff.push('\n');
                    break;
                } else if (c == 'r') {
                    buff.push('\r');
                    break;
                } else if (c == 't') {
                    buff.push('\t');
                    break;
                } else if (c == 'u') {
                    var codePoint = parseInt(v[i + 1, i + 5], 16);
                    buff.push(String.fromCharCode(codePoint));
                    i += 4;
                    break;
                } else {
                    this.error_parsing(pos + i, 'Illegal escape sequence: \'\\' + c + '\'');
                    return;
                }
                escaping = false;
            } else {
                if (c == '\\') {
                    escaping = true;
                } else {
                    buff.push(c);
                }
            }
        }

        return buff.join('');
    }

    isOperator() {
        var ops = [
            ['+', 2, '+'],
            ['-', 2, '-'],
            ['*', 3, '*'],
            ['/', 4, '/']
        ];
        for (var i = 0; i < ops.length; i++) {
            if (this.expression.startsWith(ops[i][0], this.pos)) {
                this.tokenprio = ops[i][1];
                this.tokenindex = ops[i][2];
                return true;
            }
        }
        return false;
    }

    isSign() {
        var code = this.expression[this.pos - 1];
        return (code == '+') || (code == '-');
    }

    isNegativeSign() {
        var code = this.expression[this.pos - 1];
        return (code == '-');
    }

    isNumber() {
        var r = false,
            str = '';

        var code = null;
        while (this.pos < this.expression.length) {
            code = this.expression[this.pos];
            if ((code >= '0' && code <= '9') || (code == '.')) {
                str += this.expression[this.pos];
                this.pos += 1;
                this.tokennumber = parseFloat(str);
                r = true;
            } else {
                break;
            }
        }

        return r;
    }

    isString() {
        var r = false,
            str = '',
            startpos = this.pos;

        if ((this.pos < this.expression.length) && (this.expression[this.pos] == "'")) {
            this.pos += 1;
            var code = null;
            while (this.pos < this.expression.length) {
                code = this.expression[this.pos];
                if ((code != '\'') || (str[-1] == '\\')) {
                    str += this.expression[this.pos];
                    this.pos += 1;
                } else {
                    this.pos += 1;
                    this.tokennumber = this.unescape(str, startpos);
                    r = true;
                    break;
                }
            }
        }

        return r;
    }

    isLeftParenth() {
        var code = this.expression[this.pos];
        if (code == '(') {
            this.pos += 1;
            this.tmpprio += 10;
            return true;
        }
        return false;
    }

    isRightParenth() {
        var code = this.expression[this.pos];
        if (code == ')') {
            this.pos += 1;
            this.tmpprio -= 10;
            return true;
        }
        return false;
    }

    isComma() {
        var code = this.expression[this.pos];
        if (code == ',') {
            this.pos += 1;
            this.tokenprio = -1;
            this.tokenindex = ",";
            return true;
        }
        return false;
    }

    isLvl1() {
        var str = '';

        var c = null;
        for (var i = this.pos; i < this.expression.length; i++) {
            c = this.expression[i];
            if (c.toUpperCase() == c.toLowerCase()) {
                if (i == this.pos || (c != '_' && (c < '0' || c > '9'))) {
                    break;
                }
            }
            str += c;
        }

        if ((str.length > 0) && (str in this.lvl1)) {
            this.tokenindex = str;
            this.tokenprio = 7;
            this.pos += str.length;
            return true;
        }

        return false;
    }

    isLvl2() {
        var str = '';

        var c = null;
        for (var i = this.pos; i < this.expression.length; i++) {
            c = this.expression[i];
            if (c.toUpperCase() == c.toLowerCase()) {
                if (i == this.pos || (c != '_' && (c < '0' || c > '9'))) {
                    break;
                }
            }
            str += c;
        }

        if ((str.length > 0) && (str in this.lvl2)) {
            this.tokenindex = str;
            this.tokenprio = 7;
            this.pos += str.length;
            return true;
        }

        return false;
    }

    isWhite() {
        var code = this.expression[this.pos];
        if (code.indexOf(' ') >= 0) {
            this.pos += 1;
            return true;
        }
        return false;
    }
}