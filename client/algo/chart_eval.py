import math

VALUE_NUM = 0
LEVEL_1 = 1
LEVEL_2 = 2



class Token():
    def __init__(self, t_type, t_index, priority, number):
        self.type_ = t_type
        self.index_ = t_index or 0
        self.priority = priority or 0
        self.number_ = number or 0


class MathExpression():
    def __init__(self, tokens, lvl1, lvl2, funcs):
        self.tokens = tokens
        self.lvl1 = lvl1
        self.lvl2 = lvl2
        self.funcs = funcs

    def evaluate(self):
        nstack = []
        L = len(self.tokens)
        for i in range(0, L):
            item = self.tokens[i]
            type_ = item.type_
            if type_ == VALUE_NUM:
                nstack.append(item.number_)
            elif type_ == LEVEL_2:
                n2 = nstack.pop()
                n1 = nstack.pop()
                f = self.lvl2[item.index_]
                nstack.append(f(n1, n2))
            elif type_ == LEVEL_1:
                n1 = nstack.pop()
                f = self.lvl1[item.index_]
                nstack.append(f(n1))

            else:
                raise Exception('MISTAKE')
        if len(nstack) > 1:
            raise Exception('WRONG SYNTAX')
        return nstack[0]


class ExpressionParser:
    PRIMARY = 1
    OPERATOR = 2
    FUNCTION = 4
    LPAREN = 8
    RPAREN = 16
    COMMA = 32
    SIGN = 64
    CALL = 128
    NULLARY_CALL = 256

    def add(self, a, b):
        return a + b

    def sub(self, a, b):
        return a - b

    def mul(self, a, b):
        return a * b

    def div(self, a, b):
        return a / b

    def neg(self, a):
        return -a

    def __init__(self):
        self.success = False
        self.errormsg = ''
        self.expression = ''

        self.pos = 0

        self.tokennumber = 0
        self.tokenprio = 0
        self.tokenindex = 0
        self.tmpprio = 0

        self.lvl1 = {
            'sin': math.sin,
            'cos': math.cos,
            '-': self.neg,
        }

        self.lvl2 = {
            '+': self.add,
            '-': self.sub,
            '*': self.mul,
            '/': self.div,
        }

        self.functions = {
        }

        self.consts = {
            'E': math.e,
            'PI': math.pi,
        }

        self.values = {
            'sin': math.sin,
            'cos': math.cos,
        }

    def parse(self, expr):
        self.errormsg = ''
        self.success = True
        operstack = []
        tokenstack = []
        self.tmpprio = 0
        expected = self.PRIMARY | self.LPAREN | self.FUNCTION | self.SIGN
        noperators = 0
        self.expression = expr
        self.pos = 0

        while self.pos < len(self.expression):
            if self.isOperator():
                if self.isSign() and expected & self.SIGN:
                    if self.isNegativeSign():
                        self.tokenprio = 5
                        self.tokenindex = '-'
                        noperators += 1
                        self.addfunc(tokenstack, operstack, LEVEL_1)
                    expected = \
                        self.PRIMARY | self.LPAREN | self.FUNCTION | self.SIGN
                else:
                    if expected and self.OPERATOR == 0:
                        self.error_parsing(self.pos, 'wrong operator')
                    noperators += 2
                    self.addfunc(tokenstack, operstack, LEVEL_2)
                    expected = \
                        self.PRIMARY | self.LPAREN | self.FUNCTION | self.SIGN
            elif self.isNumber():
                if expected and self.PRIMARY == 0:
                    self.error_parsing(self.pos, 'wrong number')
                token = Token(VALUE_NUM, 0, 0, self.tokennumber)
                tokenstack.append(token)
                expected = self.OPERATOR | self.RPAREN | self.COMMA
            elif self.isString():
                if (expected & self.PRIMARY) == 0:
                    self.error_parsing(self.pos, 'wrong string')
                token = Token(VALUE_NUM, 0, 0, self.tokennumber)
                tokenstack.append(token)
                expected = self.OPERATOR | self.RPAREN | self.COMMA
            elif self.isLeftParenth():
                if (expected & self.LPAREN) == 0:
                    self.error_parsing(self.pos, 'unexpected \"(\"')
                if expected & self.CALL:
                    noperators += 2
                    self.tokenprio = -2
                    self.tokenindex = -1
                expected = \
                    self.PRIMARY | self.LPAREN | self.FUNCTION | \
                    self.SIGN | self.NULLARY_CALL
            elif self.isRightParenth():
                if expected & self.NULLARY_CALL:
                    token = Token(VALUE_NUM, 0, 0, [])
                    tokenstack.append(token)
                elif (expected & self.RPAREN) == 0:
                    self.error_parsing(self.pos, 'unexpected \")\"')
                expected = \
                    self.OPERATOR | self.RPAREN | self.COMMA | \
                    self.LPAREN | self.CALL
            elif self.isComma():
                if (expected & self.COMMA) == 0:
                    self.error_parsing(self.pos, 'unexpected \",\"')
                self.addfunc(tokenstack, operstack, LEVEL_2)
                noperators += 2
                expected = \
                    self.PRIMARY | self.LPAREN | self.FUNCTION | self.SIGN
            elif self.isLvl2():
                if (expected & self.FUNCTION) == 0:
                    self.error_parsing(self.pos, 'unexpected function')
                self.addfunc(tokenstack, operstack, LEVEL_2)
                noperators += 2
                expected = self.LPAREN
            elif self.isLvl1():
                if (expected & self.FUNCTION) == 0:
                    self.error_parsing(self.pos, 'unexpected function')
                self.addfunc(tokenstack, operstack, LEVEL_1)
                noperators += 1
                expected = self.LPAREN
            elif self.isWhite():
                pass
            else:
                if self.errormsg == '':
                    self.error_parsing(self.pos, 'unknown character')
                else:
                    self.error_parsing(self.pos, self.errormsg)
        if self.tmpprio < 0 or self.tmpprio >= 10:
            self.error_parsing(self.pos, 'unmatched \"()\"')
        while len(operstack) > 0:
            tmp = operstack.pop()
            tokenstack.append(tmp)
        if (noperators + 1) != len(tokenstack):
            self.error_parsing(self.pos, 'parity')

        return MathExpression(tokenstack, self.lvl1, self.lvl2, self.functions)

    def evaluate(self, expr, variables):
        return self.parse(expr).evaluate(variables)

    def error_parsing(self, column, msg):
        self.success = False
        self.errormsg = 'parse error [column ' + str(column) + ']: ' + msg
        raise Exception(self.errormsg)

    def addfunc(self, tokenstack, operstack, type_):
        operator = Token(
            type_,
            self.tokenindex,
            self.tokenprio + self.tmpprio,
            0,
        )
        while len(operstack) > 0:
            if operator.priority <= operstack[len(operstack) - 1].priority:
                tokenstack.append(operstack.pop())
            else:
                break
        operstack.append(operator)

    def isNumber(self):
        r = False
        str = ''
        while self.pos < len(self.expression):
            code = self.expression[self.pos]
            if (code >= '0' and code <= '9') or code == '.':
                str += self.expression[self.pos]
                self.pos += 1
                self.tokennumber = float(str)
                r = True
            else:
                break
        return r

    def unescape(self, v, pos):
        buffer = []
        escaping = False

        for i in range(0, len(v)):
            c = v[i]

            if escaping:
                if c == "'":
                    buffer.append("'")
                    break
                elif c == '\\':
                    buffer.append('\\')
                    break
                elif c == '/':
                    buffer.append('/')
                    break
                elif c == 'b':
                    buffer.append('\b')
                    break
                elif c == 'f':
                    buffer.append('\f')
                    break
                elif c == 'n':
                    buffer.append('\n')
                    break
                elif c == 'r':
                    buffer.append('\r')
                    break
                elif c == 't':
                    buffer.append('\t')
                    break
                elif c == 'u':
                    codePoint = int(v[i + 1, i + 5], 16)
                    buffer.append(unichr(codePoint))
                    i += 4
                    break
                else:
                    raise self.error_parsing(
                        pos + i,
                        'Illegal escape sequence: \'\\' + c + '\'',
                    )
                escaping = False
            else:
                if c == '\\':
                    escaping = True
                else:
                    buffer.append(c)

        return ''.join(buffer)

    def isString(self):
        r = False
        str = ''
        startpos = self.pos
        if self.pos < len(self.expression) and self.expression[self.pos] == "'":
            self.pos += 1
            while self.pos < len(self.expression):
                code = self.expression[self.pos]
                if code != '\'' or str[-1] == '\\':
                    str += self.expression[self.pos]
                    self.pos += 1
                else:
                    self.pos += 1
                    self.tokennumber = self.unescape(str, startpos)
                    r = True
                    break
        return r

    def isOperator(self):
        ops = (
            ('+', 2, '+'),
            ('-', 2, '-'),
            ('*', 3, '*'),
            ('/', 4, '/'),
        )
        for token, priority, index in ops:
            if self.expression.startswith(token, self.pos):
                self.tokenprio = priority
                self.tokenindex = index
                self.pos += len(token)
                return True
        return False

    def isSign(self):
        code = self.expression[self.pos - 1]
        return (code == '+') or (code == '-')

    def isPositiveSign(self):
        code = self.expression[self.pos - 1]
        return code == '+'

    def isNegativeSign(self):
        code = self.expression[self.pos - 1]
        return code == '-'

    def isLeftParenth(self):
        code = self.expression[self.pos]
        if code == '(':
            self.pos += 1
            self.tmpprio += 10
            return True
        return False

    def isRightParenth(self):
        code = self.expression[self.pos]
        if code == ')':
            self.pos += 1
            self.tmpprio -= 10
            return True
        return False

    def isComma(self):
        code = self.expression[self.pos]
        if code == ',':
            self.pos += 1
            self.tokenprio = -1
            self.tokenindex = ","
            return True
        return False

    def isWhite(self):
        code = self.expression[self.pos]
        if code.isspace():
            self.pos += 1
            return True
        return False

    def isLvl1(self):
        str = ''
        for i in range(self.pos, len(self.expression)):
            c = self.expression[i]
            if c.upper() == c.lower():
                if i == self.pos or (c != '_' and (c < '0' or c > '9')):
                    break
            str += c
        if len(str) > 0 and str in self.lvl1:
            self.tokenindex = str
            self.tokenprio = 7
            self.pos += len(str)
            return True
        return False

    def isLvl2(self):
        str = ''
        for i in range(self.pos, len(self.expression)):
            c = self.expression[i]
            if c.upper() == c.lower():
                if i == self.pos or (c != '_' and (c < '0' or c > '9')):
                    break
            str += c
        if len(str) > 0 and (str in self.lvl2):
            self.tokenindex = str
            self.tokenprio = 7
            self.pos += len(str)
            return True
        return False


if __name__ == '__main__':
    parser = ExpressionParser()

    print(parser.parse('3*4 + sin(10)/(20 + cos(13))').evaluate())
    print(parser.parse('sin(2)*sin(2) + cos(2)*cos(2)').evaluate())
    print(parser.parse('((sin(2)*sin(2) + cos(2)*cos(2)) + 3)/4').evaluate())
