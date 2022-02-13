import pytest
from pathlib import Path
import json
from jsonschema import validate
from jsonschema.validators import (
    Draft7Validator,
    validator_for,
)


@pytest.fixture
def ethpm_spec_dir():
    return Path(__file__).parent.parent


@pytest.fixture
def schema(ethpm_spec_dir):
    v3_schema_path = ethpm_spec_dir / 'spec' / 'v3.spec.json'
    return json.loads(v3_schema_path.read_text())


@pytest.fixture
def validate_v3(schema):
    def _validate(*args, **kwargs):
        validate(args[0], schema, cls=validator_for(schema, Draft7Validator))
    return _validate

@pytest.fixture
def validate_manifest_formatting():
    def _validate(*args, **kwargs):
        raw_manifest = args[0]
        try:
            manifest_dict = json.loads(raw_manifest)
        except json.JSONDecodeError:
            raise Exception("Invalid JSON")

        if raw_manifest[-1:] == "\n":
            raise Exception("Invalid trailing newline")

        sorted_manifest = json.dumps(manifest_dict, sort_keys=True, separators=(",", ":"))
        if raw_manifest != sorted_manifest:
            raise Exception("Invalid manifest has unsorted keys, duplicate keys, or is not tightly packed.")

    return _validate
