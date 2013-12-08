# -*- coding: utf-8 -*-

from __future__ import division

import sys
import re

def represent(result):
	if isinstance(result, float):
		return '{0:g}'.format(result)

	if isinstance(result, tuple):
		return '(' + ', '.join(map(represent, result)) + ')'

	return repr(result)

def parse(source):
	groups = 0

	for char in source:
		if char == '(':
			groups += 1
		elif char == ')':
			groups -= 1

		if groups < 0:
			break

		yield char

functions = {
	'CONCATENATE': lambda expression: repr(''.join(map(str, eval(expression)))),
	'STRINGIZE': lambda expression: repr(expression),
	'EVALUATE': lambda expression: represent(eval(expression))
}

def substitute(match):
	function, remaining = match.groups()
	source = iter(remaining)

	return functions[function](process(''.join(parse(source)))) + process(''.join(source))

function_re = re.compile(r'(' + '|'.join(functions.keys()) + ')\((.+)')

def process(text):
	return function_re.sub(substitute, text)

for line in sys.stdin:
	sys.stdout.write(process(line))
