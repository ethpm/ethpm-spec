# Release Manifest Specification

This document defines the specification for the *Release Manifest*.  The
release manifest provides metadata about the package and TODO


## Guiding Principles

The release manifest specification makes the following assumptions about the
document lifecycle.

1. Release manifest documents will generated programatically by package management software as part of the release process.
2. Release manifests will be consumed by package managers.
3. Release manifests will typically **not** be stored alongside the source, but rather by package registries *or* referenced by package registries and stored in something akin to IPFS.

## Format

The canoonical format for the package manifest is a JSON document containing a
single JSON object.  


## Filename

Convention is to name this document `epm.json` which is short for *'ethereum
package manifest'*.

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
- build dependencies

## Document Specification

### Manifest Version: `manifest_version`


The `manifest_version` field defines the version of the ethereum release manifest
specification (this document) that this manifest conforms to. All release manifests
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

### Sources: `sources`

The `sources` field declares a list of URIs which contain the source code for
this release.

* Key: `sources`
* Type: List of Strings


### Chain: `chain`

The `chain` field declares the blockchain that the contract addresses apply to.
The chain is defined by a hash with block numbers as keys and block hashes as
values.  Both block numbers and hashes *must* be hexidecimal encoded.
Convention is to include the genesis block under the key `0x00` and the latest
observable block at the time of release.

* Key: `chain`
* Type: Hash(BlockNumber: BlockHash)


### Contracts: `contracts`

The `contracts` field declares information about the deployed contracts.  This
field is a hash whos keys are the contract names, and values are one of:

* a single *Contract Instance Object*
* a List of *Contract Instance Objects*
* a Hash of (String: *Contract Instance Object*) where keys are valid contract names matching the regex `[_a-zA-Z][_a-zA-Z0-9]*`.

* Key: `contracts`
* Type: *Contract Instance Object* or List of *Contract Instance Object* or Hash of (String: *Contract Instance Object*)

#### The *Contract Instance Object*

A *Contract Instance Object* is a hash with the following key/values.

* `contract_name`:
* `address`:
    * Type: 20byte hex encoded ethereum address of the deployed contract.
* `dependencies`:
    * Type: Hash(Name: Address) or (Name: URI)
    * TODO: define this
* TODO: what else

- contract metadata
  - abi
  - natspec
  - unlinked binary
  - deployed addresses
  - linked libraries
  - compiler version for bytecode verification

### Dependencies: `dependencies`

TODO: define this.

- dependencies (i.e., references to other packages and versions)


# Examples

```javascript
{
    "manifest_version": 1,
    "version": "1.0.0",
    "sources": [
        "ipfs://Qm....AAA",
        "ipfs://Qm....BBB",
    ],
    "chain": {
        "0x00": "0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3"
        "0x270e22": "0xbebcefa8d868cdcad0d500f2550047f4abd9d4111e621457f613403202798c85",
    },
    "contracts": [
        {
            "name": "Wallet",
            "address": "0xd3cda913deb6f67967b99d67acdfa1712c293601",
        },
    ],
    "dependencies": {
        "
    },
}
