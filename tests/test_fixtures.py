import pytest
from pathlib import Path
import re
import json
from jsonschema import (
    ValidationError as jsonValidationError,
)

FIXTURE_DIR = Path(__file__).parent.parent / 'tests' / 'standardized'

valid_fixtures = [fixture for fixture in FIXTURE_DIR.glob('**/*.json') if fixture.parent.name == 'valid']

invalid_fixtures = [fixture for fixture in FIXTURE_DIR.glob('**/*.json') if fixture.parent.name == 'invalid']


@pytest.mark.parametrize("fixture", valid_fixtures)
def test_valid_fixtures(fixture, validate_v3):
    fixture_json = json.loads(fixture.read_text())
    manifest_json = json.loads(fixture_json['package'])
    assert fixture_json['testCase'] == 'valid'
    assert validate_v3(manifest_json) is None


@pytest.mark.parametrize("fixture", invalid_fixtures)
def test_invalid_fixtures(fixture, validate_v3):
    fixture_json = json.loads(fixture.read_text())
    manifest_json = json.loads(fixture_json['package'])
    escaped_reason = re.escape(fixture_json['errorInfo']['reason'])
    assert fixture_json['testCase'] == 'invalid'
    with pytest.raises(jsonValidationError, match=escaped_reason):
        validate_v3(manifest_json)
