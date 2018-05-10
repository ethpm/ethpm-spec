import json
import jsonschema


def load_package_schema():
    with open('spec/package.spec.json') as schema_file:
        schema = json.load(schema_file)
    return schema


FILES_TO_VALIDATE = (
    './examples/escrow/1.0.0.json',
    './examples/owned/1.0.0.json',
    './examples/piper-coin/1.0.0.json',
    './examples/safe-math-lib/1.0.0.json',
    './examples/standard-token/1.0.0.json',
    './examples/transferable/1.0.0.json',
    './examples/wallet-with-send/1.0.0.json',
    './examples/wallet/1.0.0.json',
)


def validate_example_packages():
    package_schema = load_package_schema()
    for file_path in FILES_TO_VALIDATE:
        with open(file_path) as package_file:
            try:
                package = json.load(package_file)
            except json.JSONDecodeError as error:
                raise ValueError("Invalid JSON File: {0}\n{1}".format(file_path, str(error)))
            except Exception as error:
                raise ValueError("Something is broken: {0}\n{1}".format(file_path, str(error)))
            jsonschema.validate(package, package_schema)


if __name__ == '__main__':
    validate_example_packages()
