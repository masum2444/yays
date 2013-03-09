#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import re
import csv
import itertools
import json

class Vocabulary(object):
	def __init__(self):
		self._texts = []

	def feed(self, field):
		self._texts.append(field or None)

	def __str__(self):
		return """\
	vocabulary = {},
""".format(json.dumps(self._texts))

class Translation(Vocabulary):
	def __init__(self, field):
		super(Translation, self).__init__()

		self._language = None
		self._language_code = None
		self._author = None
		self._complete = None

		self.feed(field)

	def __str__(self):
		return """\
			// {language} - {author}
			case '{language_code}':
				return {texts};
""".format(
	language=self._language,
	language_code=self._language_code,
	author=self._author,
	complete=self._complete,
	texts=json.dumps(self._texts)
)

	def feed(self, field):
		if self._language is None:
			self._language, self._language_code = (part.strip().lower() for part in field.split('/'))
		elif self._author is None:
			self._author = field
		elif self._complete is None:
			self._complete = field
		else:
			super(Translation, self).feed(field)

vocabulary = Vocabulary()
translations = None
for ln, line in enumerate(csv.reader(sys.stdin)):
	fields = [field.decode('utf-8').strip() for field in line]

	if translations is None:
		translations = [Translation(field) for field in fields[1:]]
		continue

	if ln > 2:
		vocabulary.feed(fields[0])

	for translation, field in itertools.izip(translations, fields[1:]):
		translation.feed(field)

print vocabulary
print '\n'.join(str(translation) for translation in translations)
