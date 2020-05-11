import pytest
from jsonschema import (
    ValidationError as jsonValidationError,
)


@pytest.mark.parametrize(
    'value',
    (
        3,
        'contractType',
        ['list', 'of', 'contractTypes'],
    )
)
def test_schema_rejects_invalid_contract_types(base_manifest, validate_v3, value):
    base_manifest['contractTypes'] = value
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


def test_schema_accepts_valid_contract_types(base_manifest, validate_v3):
    base_manifest['contractTypes'] = {
        'MyContractAlias': {
            'contractName': 'MyContract',
            'sourceId': 'MyContract.sol',
            'deploymentBytecode': {
                'bytecode': '0x'
            },
            'runtimeBytecode': {
                'bytecode': '0x'
            },
            'abi': [],
            'userdoc': {},
            'devdoc': {}
        }
    }
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        {'3': {'abi': []}},
        {'3Contract': {'abi': []}},
        {'in/valid': {'abi': []}},
        {'X'*257: {'abi': []}},
    )
)
def test_contract_type_keys_must_be_valid_contract_aliases(base_manifest, validate_v3, value):
    base_manifest['contractTypes'] = value
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


@pytest.mark.parametrize(
    'value',
    (
        '',
        3,
        '3',
        '3Contract',
        '.invalid',
        'in/valid',
        'X'*257,
    )
)
def test_schema_rejects_invalid_contract_names(base_manifest, validate_v3, value):
    base_manifest['contractTypes'] = {'MyContract': {'abi': [], 'contractName': value}}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)


@pytest.mark.parametrize(
    'value',
    (
        '',
        3,
        '3',
        '3Contract',
        '.invalid',
        'in/valid',
        'X'*257,
    )
)
def test_schema_rejects_invalid_contract_names(base_manifest, validate_v3, value):
    base_manifest['contractTypes'] = {'MyContract': {'abi': [], 'contractName': value}}
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)
