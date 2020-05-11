import pytest
from jsonschema import (
    ValidationError as jsonValidationError,
)


def test_schema_accepts_valid_manifest_values(base_manifest, validate_v3):
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        3,
        'ethpm',
        'ethpm/2',
    )
)
def test_schema_rejects_invalid_manifest_values(validate_v3, value):
    manifest = {'manifest': value}
    with pytest.raises(jsonValidationError):
        validate_v3(manifest)


def test_schema_rejects_missing_manifest_key(validate_v3):
    manifest = {'version': '1.0.0'}
    with pytest.raises(jsonValidationError):
        validate_v3(manifest)


@pytest.mark.parametrize(
    'value',
    (
        '1',
        '1.0.0-a.1',
        'xxx',
    )
)
def test_schema_accepts_valid_version_values(base_manifest, validate_v3, value):
    base_manifest['version'] = value
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        'package',
        'package1',
        'package-1',
    )
)
def test_schema_accepts_valid_name_values(base_manifest, validate_v3, value):
    base_manifest['name'] = value
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        '1package',
        '.package',
        'Package',
        'Package/1',
        'Package_1',
        'P' * 256,
    )
)
def test_schema_rejects_invalid_name_values(base_manifest, validate_v3, value):
    base_manifest['name'] = value
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


def test_schema_rejects_manifests_with_name_but_no_version(validate_v3):
    manifest = {'manifest': 'ethpm/3', 'name': 'package'}
    with pytest.raises(jsonValidationError):
        validate_v3(manifest)


def test_schema_rejects_manifests_with_name_but_no_version(validate_v3):
    manifest = {'manifest': 'ethpm/3', 'version': '1'}
    with pytest.raises(jsonValidationError):
        validate_v3(manifest)
