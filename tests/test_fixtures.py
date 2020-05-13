import pytest
from pathlib import Path
import re
import json
from jsonschema import (
    ValidationError as jsonValidationError,
)

FIXTURE_DIR = Path(__file__).parent.parent / 'tests' / 'standardized'


def pytest_generate_tests(metafunc):
    if 'valid_fixture' in metafunc.fixturenames:
        valid_fixtures = [fixture for fixture in FIXTURE_DIR.glob('**/*.json') if fixture.parent.name == 'valid']
        metafunc.parametrize("valid_fixture", valid_fixtures)
    elif 'invalid_fixture' in metafunc.fixturenames:
        valid_fixtures = [fixture for fixture in FIXTURE_DIR.glob('**/*.json') if fixture.parent.name == 'invalid']
        metafunc.parametrize("invalid_fixture", valid_fixtures)


def test_valid_fixtures(valid_fixture, validate_v3):
    fixture_json = json.loads(valid_fixture.read_text())
    manifest_json = json.loads(fixture_json['package'])
    assert fixture_json['testCase'] == 'valid'
    assert validate_v3(manifest_json) is None


def test_invalid_fixtures(invalid_fixture, validate_v3):
    fixture_json = json.loads(invalid_fixture.read_text())
    manifest_json = json.loads(fixture_json['package'])
    escaped_reason = re.escape(fixture_json['errorInfo']['reason'])
    assert fixture_json['testCase'] == 'invalid'
    with pytest.raises(jsonValidationError, match=escaped_reason):
        validate_v3(manifest_json)
