import pytest
from jsonschema import (
    ValidationError as jsonValidationError,
)

@pytest.mark.parametrize(
    'value',
    (
        {'mypackage': 'ipfs://Qm...'},
    )
)
def test_schema_accepts_valid_deployments(base_manifest, validate_v3, value):
    base_manifest['buildDependencies'] = value
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        {'.invalid': 'ipfs://Qm...'},
    )
)
def test_schema_rejects_invalid_deployments(base_manifest, validate_v3, value):
    base_manifest['buildDependencies'] = value
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)
