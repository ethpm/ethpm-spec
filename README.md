# EthPM Package Specification

## Overview

[![Join the chat at https://gitter.im/ethpm/Lobby](https://badges.gitter.im/ethpm/Lobby.svg)](https://gitter.im/ethpm/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This repository comprises the formal specification and documentation source
for the **EthPM package manifest** data format.

This data format is designed to be produced/consumed by Ethereum
development tools. As such, this repository is intended for tool developers
wishing to integrate with EthPM.

Package manifests are JSON-encoded, tightly-packed, with objects’ keys sorted
in lexicographic order. Package manifests may live on disk, but are intended
to be produced programmatically and uploaded directly to a content-addressable
storage network (e.g. [IPFS](https://ipfs.io/)). A package manifest describes
a single package, including package name, version, dependencies, and references
to distributed source files.

## Repository Contents

- [Schema Description](http://ethpm.github.io/ethpm-spec/package-spec.html)
  - [`package.spec.json`](https://github.com/ethpm/ethpm-spec/blob/master/spec/package.spec.json)
- [Use Case Examples](http://ethpm.github.io/ethpm-spec/use-cases.html)
  - [Examples Sources](https://github.com/ethpm/ethpm-spec/blob/master/examples/)
- [Glossary](http://ethpm.github.io/ethpm-spec/glossary.html)

## Examples / Use Cases

**Package:** `owned` (prettified)
```json
{
    "name": "owned",
    "version": "1.0.0",
    "manifest": "ethpm/3",
    "meta": {
        "license": "MIT",
        "authors": [
            "Piper Merriam <pipermerriam@gmail.com>"
        ],
        "description": "Reusable contracts which implement a privileged 'owner' model for authorization.",
        "keywords": [
            "authorization"
        ],
        "links": {
            "documentation": "ipfs://QmUYcVzTfSwJoigggMxeo2g5STWAgJdisQsqcXHws7b1FW"
        }
    },
    "sources": {
        "contracts/Owned.sol": {
            "type": "solidity",
            "urls": [
                "ipfs://Qme4otpS88NV8yQi8TfTP89EsQC5bko3F5N1yhRoi6cwGV"
            ],
            "installPath": "./contracts/Owned.sol"
        }
    }
}
```

Please see [**Use Cases**](http://ethpm.github.io/ethpm-spec/use-cases.html) for
documented examples of different kinds of packages with varying levels of
complexity. Source for use case examples can be found in the
[examples/](https://github.com/ethpm/ethpm-spec/blob/master/examples/)
directory of this repository.

## Specification

The EthPM package manifest format is formally specified as a
[JSON-Schema](http://json-schema.org).

Please see [**Package Specification**](http://ethpm.github.io/ethpm-spec/package-spec.html)
for a natural-language description of this schema, or see
[package.spec.json](https://github.com/ethpm/ethpm-spec/blob/master/spec/package.spec.json)
for the machine-readable version.

## Contributing

Requirements: Python 3, `pip`, `make`
Fork and clone this repo to get started. Then, activate a
[virtual environment](https://docs.python-guide.org/dev/virtualenvs/) in the cloned repo's
directory and run `pip install -r requirements.txt`

### Building Sphinx docs locally

1. `cd docs`
2. `make html`

Docs are written in [reStructuredText](http://docutils.sourceforge.net/rst.html)
and built using the [Sphinx](http://www.sphinx-doc.org/) documentation
generator.

### Running tests locally

1. `pytest tests/`


### Test fixture schema

Each test fixture contains a ``package`` field with a raw, json encoded string of the manifest.

Each test fixture contains a ``testcase`` field that indicates whether the associated ``package`` is ``invalid`` or ``valid``.

Each invalid test fixture contains an ``errorInfo`` field.
- The ``errorPointer`` field, which is a [jsonpointer](https://tools.ietf.org/html/rfc6901) pointing towards the cause of the invalid error, is included for ``invalid`` tests. 
- The ``reason`` field, which is a human readable description of the error, is included for ``invalid`` tests.
- The ``errorCode`` field, which is a machine readable description of the error, is included for ``invalid`` tests according to the following table.

``N0001`` - Invalid ``"manifest"`` field.
``N0002`` - Invalid ``"name"`` field.
``N0003`` - Invalid ``"version"`` field.
``N0004`` - Invalid ``"sources"`` field.
``N0005`` - Invalid ``"contractTypes"`` field.
``N0006`` - Invalid ``"deployments"`` field.
``N0007`` - Invalid ``"compilers"`` field.
``N0008`` - Invalid ``"buildDependencies"`` field.
``N0009`` - Invalid ``"meta"`` field.
