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
  "manifest_version": "2",
  "version": "1.0.0",
  "package_name": "owned",
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
    "./contracts/Owned.sol": "ipfs://Qme4otpS88NV8yQi8TfTP89EsQC5bko3F5N1yhRoi6cwGV"
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

### Building Sphinx docs locally

Requirements: Python 3, `pip`, `make`

Fork and clone this repo to get started. Then, in the cloned repo's directory:

1. `pip install -r requirements.txt`
2. `cd docs`
3. `make html`

Docs are written in [reStructuredText](http://docutils.sourceforge.net/rst.html)
and built using the [Sphinx](http://www.sphinx-doc.org/) documentation
generator.
