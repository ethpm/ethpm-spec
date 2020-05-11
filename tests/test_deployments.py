import pytest
from jsonschema import (
    ValidationError as jsonValidationError,
)

ADDRESS = '0x9182902397B57a8c611D764D4DCD24BA951B4319'
BLOCKCHAIN_URI = 'blockchain://d8764b6fdd13fbd4132265128dcaacb7c04cbb0ee0e0efb329e7a24d1f8509c7/block/d8764b6fdd13fbd4132265128dcaacb7c04cbb0ee0e0efb329e7a24d1f8509c7'
TX_HASH = '0xb16905dbcc3bed51f0bc79475dd2e69df451ff193bf62bca58ae2fcca2c196f7'
BLOCK_HASH = '0xee1147804cd4eb25b7111244d11424be221de81679f27f8a469d772d1a51909a'

@pytest.mark.parametrize(
    'value',
    (
        {BLOCKCHAIN_URI: {'MyContract': {'contractType': 'MyContract', 'address': ADDRESS}}},
        {BLOCKCHAIN_URI: {'MyContract': {'contractType': 'nested:MyContract', 'address': ADDRESS}}},
        {BLOCKCHAIN_URI: {'MyContract': {'contractType': 'nested:MyContract', 'address': ADDRESS, 'block': BLOCK_HASH, 'transaction': TX_HASH}}},
        # {BLOCKCHAIN_URI: {'MyContract': {'contractType': 'multiple:nested:MyContract', 'address': ADDRESS}}},  TBD
    )
)
def test_schema_accepts_valid_deployments(base_manifest, validate_v3, value):
    base_manifest['deployments'] = value
    assert validate_v3(base_manifest) is None


@pytest.mark.parametrize(
    'value',
    (
        # invalid blockchain URI
        {'blockchain://abc/block/123': {'MyContract': {'contractType': 'MyContract', 'address': ADDRESS}}},
        # missing address
        {BLOCKCHAIN_URI: {'MyContract': {'contractType': 'MyContract'}}},
        # missing contractType
        {BLOCKCHAIN_URI: {'MyContract': {'address': ADDRESS}}},
        # invalid contract alias
        {BLOCKCHAIN_URI: {'.MyContract': {'contractType': 'MyContract', 'address': ADDRESS}}},
        # invalid contract name
        {BLOCKCHAIN_URI: {'MyContract': {'contractType': '.MyContract', 'address': ADDRESS}}},
        # invalid nested contract name
        {BLOCKCHAIN_URI: {'MyContract': {'contractType': '-nested:MyContract', 'address': ADDRESS}}},
        # invalid tx
        {BLOCKCHAIN_URI: {'MyContract': {'contractType': 'MyContract', 'address': ADDRESS, 'transaction': '0x123'}}},
        # invalid block
        {BLOCKCHAIN_URI: {'MyContract': {'contractType': 'MyContract', 'address': ADDRESS, 'block': '0x123'}}},
    )
)
def test_schema_rejects_invalid_deployments(base_manifest, validate_v3, value):
    base_manifest['deployments'] = value
    with pytest.raises(jsonValidationError):
        validate_v3(base_manifest)
