from pathlib import Path
import pytest
import json


@pytest.mark.parametrize(
    'example',
    (
        'escrow',
        'owned',
        'piper-coin',
        'safe-math-lib',
        'standard-token',
        'transferable',
        'wallet-with-send',
        'wallet'
    )
)
def test_schema_validates_v3_examples(validate_v3, ethpm_spec_dir, example):
    examples_dir = ethpm_spec_dir / 'examples'
    manifest = json.loads((examples_dir / example / 'v3.json').read_text())
    assert validate_v3(manifest) is None
