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
    pretty_manifest = json.loads((examples_dir / example / 'v3-pretty.json').read_text())
    strict_manifest = json.loads((examples_dir / example / 'v3.json').read_text())
    assert validate_v3(pretty_manifest) is None
    assert validate_v3(strict_manifest) is None
