import pytest
from pathlib import Path
import re
import json
from jsonschema import (
    ValidationError as jsonValidationError,
)

FIXTURE_DIR = Path(__file__).parent.parent / 'tests' / 'fixtures'
SCHEMA_VALIDATION_DIR = FIXTURE_DIR / 'schemaValidation'
FORMATTING_DIR = FIXTURE_DIR / 'formatting'


def pytest_generate_tests(metafunc):
    if 'valid_schema_fixture' in metafunc.fixturenames:
        valid_fixtures = [fixture for fixture in SCHEMA_VALIDATION_DIR.glob('**/*.json') if fixture.parent.name == 'valid']
        metafunc.parametrize("valid_schema_fixture", valid_fixtures)
    elif 'invalid_schema_fixture' in metafunc.fixturenames:
        invalid_fixtures = [fixture for fixture in SCHEMA_VALIDATION_DIR.glob('**/*.json') if fixture.parent.name == 'invalid']
        metafunc.parametrize("invalid_schema_fixture", invalid_fixtures)
    elif 'invalid_formatting_fixture' in metafunc.fixturenames:
        invalid_fixtures = [fixture for fixture in FORMATTING_DIR.glob('**/*.json') if fixture.parent.name == 'invalid']
        metafunc.parametrize("invalid_formatting_fixture", invalid_fixtures)


def test_valid_schema_fixtures(valid_schema_fixture, validate_v3):
    fixture_json = json.loads(valid_schema_fixture.read_text())
    manifest_json = json.loads(fixture_json['package'])
    assert fixture_json['testCase'] == 'valid'
    assert validate_v3(manifest_json) is None


def test_invalid_schema_fixtures(invalid_schema_fixture, validate_v3):
    fixture_json = json.loads(invalid_schema_fixture.read_text())
    manifest_json = json.loads(fixture_json['package'])
    escaped_reason = re.escape(fixture_json['errorInfo']['reason'])
    assert fixture_json['testCase'] == 'invalid'
    with pytest.raises(jsonValidationError, match=escaped_reason):
        validate_v3(manifest_json)


def test_invalid_formatting_fixtures(invalid_formatting_fixture, validate_manifest_formatting):
    fixture_json = json.loads(invalid_formatting_fixture.read_text())
    with pytest.raises(Exception, match=fixture_json['errorInfo']['reason']):
        validate_manifest_formatting(fixture_json['package'])         
