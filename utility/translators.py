# -*- coding: utf-8 -*-

import sys
import os
import csv
import urllib
import itertools
import operator

from translation import SPREADSHEET_URL

TRANSLATORS_SHEET_URL = SPREADSHEET_URL + '&gid=4'
PROFILE_SHEET_URL = SPREADSHEET_URL + '&gid=5'

def translations():
	profiles = dict(csv.reader(urllib.urlopen(PROFILE_SHEET_URL)))
	profile_ref = itertools.count(1)

	def profile_links(translators):
		for name in translators:
			if name in profiles:
				profile_ref_id = profile_ref.next()
				yield '[{0}][{1:02d}]'.format(name, profile_ref_id), '[{0:02d}]: {1}'.format(profile_ref_id, profiles[name])
			else:
				yield name, None

	rows = itertools.islice(csv.reader(urllib.urlopen(TRANSLATORS_SHEET_URL)), 1, None)

	for language, translators in itertools.imap(operator.itemgetter(0, slice(1, None)), rows):
		yield language, list(profile_links(itertools.ifilter(bool, translators)))

def main(output_dir):
	rows = []
	refs = []

	for language, translators in translations():
		rows.append((language, ', '.join(itertools.imap(operator.itemgetter(0), translators))))
		refs.extend(itertools.ifilter(bool, itertools.imap(operator.itemgetter(1), translators)))

	column_widths = (max(len(row[0]) for row in rows), max(len(row[1]) for row in rows))
	line_format = '| {{0:{0}s}} | {{1:{1}s}} |\n'.format(*column_widths)

	with open(os.path.join(output_dir, 'translators.md'), 'w') as translators_file:
		translators_file.write(line_format.format('Language', 'Translator'))
		translators_file.write(line_format.format('-' * column_widths[0], '-' * column_widths[1]))

		translators_file.writelines(itertools.starmap(line_format.format, rows))
		translators_file.write('\n')
		translators_file.write('\n'.join(refs))

if __name__ == '__main__':
	main(os.path.abspath(sys.argv[1]) if len(sys.argv) == 2 else os.getcwd())
