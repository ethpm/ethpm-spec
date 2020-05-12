import pytest
from pathlib import Path
import json
from jsonschema import (
    ValidationError as jsonValidationError,
)

# todo
# validate manifest file formatting
# use pytest.fixture to parametrize

FIXTURE_DIR = Path(__file__).parent.parent / 'tests' / 'standardized'

valid_fixtures = [json.loads(fixture.read_text()) for fixture in FIXTURE_DIR.glob('**/*.json') if fixture.parent.name == 'valid']

invalid_fixtures = [json.loads(fixture.read_text()) for fixture in FIXTURE_DIR.glob('**/*.json') if fixture.parent.name == 'invalid']


@pytest.mark.parametrize("fixture", valid_fixtures)
def test_valid_fixtures(fixture, validate_v3):
    assert validate_v3(fixture) is None


@pytest.mark.parametrize("fixture", invalid_fixtures)
def test_invalid_fixtures(fixture, validate_v3):
    with pytest.raises(jsonValidationError):
        validate_v3(fixture)
