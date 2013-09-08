export PYTHONDONTWRITEBYTECODE=1

translation:
	python utility/translation.py i18n

translators:
	python utility/translators.py i18n

vocabulary:
	@python utility/vocabulary.py
