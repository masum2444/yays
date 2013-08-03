# -*- coding: utf-8 -*-

import sys
import os
import re
import glob
import itertools

class Phrase(str):
	def __new__(cls, index, phrase):
		self = str.__new__(cls, phrase)
		self.index = index
		return self

	def __lt__(self, other):
		return self.index < other.index

def extract_phrases(basedir):
	underscore_pattern = re.compile(r'_\(([\'"])(.+?)\1\)')

	for js_path in glob.glob(basedir + '/*.js'):
		with open(js_path) as js_file:
			for _, word in underscore_pattern.findall(js_file.read()):
				yield word

basedir = os.getcwd()
if len(sys.argv) == 2:
	basedir = os.path.abspath(sys.argv[1])

print '\n'.join(sorted(set(itertools.starmap(Phrase, enumerate(extract_phrases(basedir))))))
