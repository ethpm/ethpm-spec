import pytest
from jsonschema import (
    ValidationError as jsonValidationError,
)


@pytest.mark.parametrize(
    'value',
    (
        3,
        'metadata',
        ['some', 'metadata'],
    )
)
def test_schema_rejects_invalid_meta_types(base_manifest, validate_v3, value):
    base_manifest['meta'] = value
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


def test_schema_accepts_valid_authors(base_manifest, validate_v3):
    base_manifest['meta'] = {'authors': ['list', 'of', 'authors']}
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        3,
        'package',
        {'first': 'author'},
    )
)
def test_schema_rejects_invalid_authors(base_manifest, validate_v3, value):
    base_manifest['meta'] = {'authors': value}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


def test_schema_accepts_a_valid_license(base_manifest, validate_v3):
    base_manifest['meta'] = {'license': 'MIT'}
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        3,
        ['list', 'of', 'licenses'],
        {'first': 'license'},
    )
)
def test_schema_rejects_invalid_licenses(base_manifest, validate_v3, value):
    base_manifest['meta'] = {'license': value}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


def test_schema_accepts_a_valid_description(base_manifest, validate_v3):
    base_manifest['meta'] = {'description': 'this is a description.'}
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        3,
        ['list', 'of', 'description'],
        {'first': 'description'},
    )
)
def test_schema_rejects_invalid_descriptions(base_manifest, validate_v3, value):
    base_manifest['meta'] = {'description': value}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


def test_schema_accepts_valid_keywords(base_manifest, validate_v3):
    base_manifest['meta'] = {'keywords': ['list', 'of', 'keywords']}
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        3,
        'keyword',
        {'first': 'keyword'},
    )
)
def test_schema_rejects_invalid_descriptions(base_manifest, validate_v3, value):
    base_manifest['meta'] = {'keywords': value}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)



def test_schema_accepts_valid_links(base_manifest, validate_v3):
    base_manifest['meta'] = {'links': {'website': 'www.google.com', 'documentation': 'github.com'}}
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        3,
        'link',
        ['list', 'of', 'links'],
    )
)
def test_schema_rejects_invalid_links(base_manifest, validate_v3, value):
    base_manifest['meta'] = {'links': value}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)
