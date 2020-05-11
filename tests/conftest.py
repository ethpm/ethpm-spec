import pytest
from pathlib import Path
import json
from jsonschema import validate
from jsonschema.validators import (
    Draft7Validator,
    validator_for,
)


@pytest.fixture
def schema():
    p = Path('.') 
    return json.loads((p / 'spec' / 'v3.spec.json').read_text())


@pytest.fixture
def base_manifest():
    return {'manifest': 'ethpm/3', 'name': 'package', 'version': '1'}


@pytest.fixture
def validate_v3(schema):
    def _validate(*args, **kwargs):
        validate(args[0], schema, cls=validator_for(schema, Draft7Validator))
    return _validate
