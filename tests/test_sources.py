import pytest
from jsonschema import (
    ValidationError as jsonValidationError,
)


@pytest.mark.parametrize(
    'value',
    (
        3,
        'source',
        ['list', 'of', 'sources'],
    )
)
def test_schema_rejects_invalid_sources(base_manifest, validate_v3, value):
    base_manifest['sources'] = value
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


@pytest.mark.parametrize(
    'value',
    (
        {'MyContract.sol': {'content': 'pragma ...'}},
        {'MyContract.sol': {'urls': ['ipfs://Qm...']}},
    )
)
def test_schema_accepts_valid_sources(base_manifest, validate_v3, value):
    base_manifest['sources'] = value
    assert validate_v3(base_manifest) is None


def test_schema_requires_either_content_or_urls(base_manifest, validate_v3):
    base_manifest['sources'] = {'MyContract.sol': {'installPath': './MyContract.sol'}}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


@pytest.mark.parametrize(
    'value',
    (
        'Qmabcxyz123',
        {'algorithm': 'keccak256'},
        {'hash': 'Qmabcxyz123'},
    )
)
def test_schema_rejects_invalid_checksum(base_manifest, validate_v3, value):
    base_manifest['sources'] = {'MyContract.sol': {'content': 'pragma...', 'checksum': value}}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


@pytest.mark.parametrize(
    'value',
    (
        'ipfs://Qm...',
        {'ipfs': 'Qm...'},
        [1],
        [{'ipfs': 'Qm...'}],
    )
)
def test_schema_rejects_invalid_urls(base_manifest, validate_v3, value):
    base_manifest['sources'] = {'MyContract.sol': {'urls': value}}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


@pytest.mark.parametrize(
    'value',
    (
        1,
        {'file': 'pragma...'},
        ['pragma'],
        [{'file': 'pragma...'}],
    )
)
def test_schema_rejects_invalid_content(base_manifest, validate_v3, value):
    base_manifest['sources'] = {'MyContract.sol': {'content': value}}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


def test_schema_accepts_valid_install_path(base_manifest, validate_v3):
    base_manifest['sources'] = {'MyContract.sol': {'content': 'pragma...', 'installPath': './path/to/MyContract.sol'}}
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        1,
        'invalid/path/to/MyContract.sol',
        ['./path/to/MyContract.sol'],
        {'path': './path/to/MyContract.sol'},
    )
)
def test_schema_rejects_invalid_install_path(base_manifest, validate_v3, value):
    base_manifest['sources'] = {'MyContract.sol': {'content': 'pragma...', 'installPath': value}}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


@pytest.mark.parametrize(
    'value',
    (
        1,
        ['solidity'],
        {'type': 'solidity'},
    )
)
def test_schema_rejects_invalid_install_type(base_manifest, validate_v3, value):
    base_manifest['sources'] = {'MyContract.sol': {'content': 'pragma...', 'type': value}}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)
