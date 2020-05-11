import pytest
from jsonschema import (
    ValidationError as jsonValidationError,
)

def test_schema_accepts_valid_compilers(base_manifest, validate_v3):
    base_manifest['compilers'] = [{'name': 'solc', 'version': '0.4.8-commit.60cc166'}]
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        [{'name': 'solc'}],  # missing version
        [{'version': '0.4.8-commit.60cc166'}],  # missing name
        [{'contractTypes': ['MyContract']}],  # missing name & version
        {'name': 'solc', 'version': '0.4.8-commit.60cc166'},  # invalid compilers format
        [{'name': 'solc', 'version': {'commit': '0.4.8-commit.60cc16'}}],  # invalid version format
        # invalid contract types
        [{'name': 'solc', 'version': '0.4.8-commit.60cc16', 'contractTypes': 'MyContract'}],
    )
)
def test_schema_rejects_invalid_compilers(base_manifest, validate_v3, value):
    base_manifest['compilers'] = value
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)
