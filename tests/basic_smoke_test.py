import pytest
from app import document_parsers


def test_parsers_exist():
    assert hasattr(document_parsers, 'parse_file')
