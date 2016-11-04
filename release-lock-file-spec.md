# Release Lock File Specification

This document defines the specification for the **Release Lock File**.  The
release lock file provides metadata about the package and includes structure to
provide sufficient information about the packaged contracts and their
dependencies to do full bytecode verification.


## Guiding Principles

The release lock file specification makes the following assumptions about the
document lifecycle.

1. Release lock files are intended to be generated programatically by package management software as part of the release process.
2. Release lock files will be consumed by package managers during tasks like installing package dependencies or building and deploying new releases.
3. Release lock files will typically **not** be stored alongside the source, but rather by package registries *or* referenced by package registries and stored in something akin to IPFS.

## Format

The canoonical format for the package manifest is a JSON document containing a
single JSON object.  


## Filename

Convention is to name this document `<version>.lock` where the `<version>`
component is the full version string for the release.

Package managers which are installing dependencies for development versions
should keep their own version of this document under the name of the package
manager such as `truffle.lock` or `dapple.lock`.  This file would typically be
excluded from version control.


## Document Overview

The following fields are defined as data that *may* be included in a package
manifest.  Custom fields should be prefixed with `x-` to prevent collision with
new fields introduced in future versions of the specification.

- manifest version
- package manifest
- version
- sources
- chain
- contracts

## Document Specification

### Manifest Version: `manifest_version`


The `manifest_version` field defines the version of the ethereum release lock file
specification (this document) that this manifest conforms to. All release lock files
**must** include this field.

* Key: `manifest_version`
* Type: Integer
* Allowed Values: `1`


### Version: `version`

The `version` field declares the version number of this release.  This value
**should** be conform to the [semver](http://semver.org/) version numbering
specification.  All manifests must **include** this field.

* Key: `version`
* Type: String
* Format: [semver](http://semver.org)


### Sources: `sources`

The `sources` field declares the full source tree for the source files
contained in this release.  Sources are declared in a key/value mapping.  

* All keys **must** conform to *one of* the following formats.
    * Begins with a `./` to denote that it is a filesystem path.
    * Is a valid contract name matching the regex `[_a-zA-Z][_a-zA-Z0-9]*`.
* All keys which are formatted to be filesystem paths **must** conform to *all* of the following rules:
    * Resolving the filesystem paths must result path that is *under* the current working directory.

* *If* the key is a contract name the value **must** be the source string for that contract.
* *If* the key is a filesystem path the value **must** conform to *one of* the following formats.
    * IPFS URI
        * *If* the resulting document is a directory the key should be interpreted as a directory path.
        * *If* the resulting document is a file the key should be interpreted as a file path.

* Key: `sources`
* Type: Hash(String: String)


### Chain: `chain`

The `chain` field declares the blockchain that the contract addresses apply to.
The chain is defined by a hash with block numbers as keys and block hashes as
values.  Both block numbers and hashes *must* be hexidecimal encoded.
Convention is to define a chain using two blocks, the genesis block under the
key `0x00` and the latest observable block at the time of release.

* Key: `chain`
* Type: Hash(BlockNumber: BlockHash)


### Contracts: `contracts`

The `contracts` field declares information about the deployed contracts.

* a single *Contract Instance Object*
* a List of *Contract Instance Objects*
* a Hash of (String: *Contract Instance Object*) where keys are valid contract names matching the regex `[_a-zA-Z][_a-zA-Z0-9]*`.

* Key: `contracts`
* Type: *Contract Instance Object* or List of *Contract Instance Object* or Hash of (String: *Contract Instance Object*)

#### The *Contract Instance Object*

A *Contract Instance Object* is a hash with the following key/values.

* `contract_name`:
    * Type: String
    * Format: Valid contract name matching regular expression `[_a-zA-Z][_a-zA-Z0-9]*]`
* `address`:
    * Type: String
    * Format: Hex encoded ethereum address of the deployed contract.
* `bytecode`:
    * Type: String
    * Format: Hex encoded bytecode for the compiled contract.
* `runtime_bytecode`:
    * Type: String
    * Format: Hex encoded runtime portion of the bytecode for the compiled contract.
* `abi`:
    * Type: List
    * Format: see https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#json
* `natspec`:
    * Type: Hash
    * Format: Combined [UserDoc](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format#user-documentation) and [DevDoc](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format#developer-documentation)
* `compiler`:
    * Type: Hash
    * Keys:
        * `version`:
            Type: String
            Format: TODO
        * `settings`: TODO
* `link_dependencies`:
    * Hash:
    * Format:
        * All keys **must** be strings which are formatted as valid link targets.
        * All values **must** conform to *one of* the following formats:
            * A hex encoded ethereum address.
            * A [json pointer](https://tools.ietf.org/html/rfc6901) to another *Contract Instance Object* in the release lock file.
            * An IPFS URI with a JSON point in the fragment portion of the URI.  The IPFS hash must resolves to a valid release lock file.  The json pointer **must** resolves to a *Contract Instance Object* within the release lock file.


### Build Dependencies: `build_dependencies`


the `dependencies` field defines a key/value mapping of ethereum packages that
this project depends on.

* All keys **must** be valid package names matching the regular expression `[a-zA-Z][-a-zA-Z0-9_]*`
* All values **must** conform to *one of* the following formats:
    * IPFS URI:
        * The resolved document **must** be a valid *release lock file*.
    * Version String that resolves to a specific package version.


* Key: `dependencies`
* Type: Hash(String: String)
