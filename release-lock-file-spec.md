# Release Lock File Specification

This document defines the specification for the **Release Lock File**.  The
release lock file provides metadata about the package and in most cases should
provide sufficient information about the packaged contracts and its
dependencies to do bytecode verification of its contracts.


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
should keep their own version of this document under the lowercased name of the
package manager such as `truffle.lock` or `dapple.lock`.  This file would
typically be excluded from version control.


## Document Specification

The following fields are defined for the release lock file.  Custom fields may
be included.  Custom fields **should** be prefixed with `x-` to prevent name
collisions with future versions of the specification.


### Manifest Version: `manifest_version`


The `manifest_version` field defines the specification version that this
document conforms to.  All release lock files **must** include this field.

* Key: `manifest_version`
* Type: Integer
* Allowed Values: `1`


### Package Manifest: `package_manifest`


The `package_manifest` field references the package's Package Manifest document
as it existed at the time this release was created.  All release lock files
**must** include this field.  The manifest may be referenced using an IPFS URI
or by directly embedding the document under this key.

* Key: `package_manifest`
* Type: IPFS URI or Embedded Document


### Version: `version`

The `version` field declares the version number of this release.  This value
**must** be included in all release lock files.  This value **should** be conform
to the [semver](http://semver.org/) version numbering specification.

* Key: `version`
* Type: String
* Format: [semver](http://semver.org)


### Sources: `sources`

The `sources` field defines a source tree that **should** comprise the full
source tree necessary to recompile the contracts contained in this release.
Sources are declared in a key/value mapping.  

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
Chains are defined by as a key/value mapping with block numbers as keys and
block hashes as values.  Both block numbers and hashes **must** be hexidecimal
encoded.  Convention is to define a chain using two blocks, the genesis block
under the key `0x00` and the latest observable block at the time of release.
*If* this release lock file includes any addressed contracts this field
**must** be present.

* Key: `chain`
* Type: Hash(BlockNumber: BlockHash)


### Contracts: `contracts`

The `contracts` field declares information about the deployed contracts.

* a single *Contract Instance Object*
* a List of *Contract Instance Objects*

* Key: `contracts`
* Type:  *any of:*
    - *Contract Instance Object* 
    - List of *Contract Instance Object* 
    - Hash of (String: *Contract Instance Object*) where keys are valid contract names matching the regex `[_a-zA-Z][_a-zA-Z0-9]*`.


#### The *Contract Instance Object*

A *Contract Instance Object* is an object with the following key/values.

* `contract_name`:
    * Required: Yes
    * Type: String
    * Format: Valid contract name matching regular expression `[_a-zA-Z][_a-zA-Z0-9]*]`
* `address`:
    * Required: No
    * Type: String
    * Format: Hex encoded ethereum address of the deployed contract.
* `bytecode`:
    * Required: No
    * Type: String
    * Format: Hex encoded unlinked bytecode for the compiled contract.
* `runtime_bytecode`:
    * Required: No
    * Type: String
    * Format: Hex encoded unlinked runtime portion of the bytecode for the compiled contract.
* `abi`:
    * Required: No
    * Type: List
    * Format: see https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#json
* `natspec`:
    * Required: No
    * Type: Hash
    * Format: Combined [UserDoc](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format#user-documentation) and [DevDoc](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format#developer-documentation)
* `compiler`:
    * Required: Required if either `bytecode` or `runtime_bytecode` is present.
    * Type: Hash
    * Keys:
        * `version`:
            Type: String
            Format: TODO
        * `settings`: TODO
* `link_dependencies`:
    * Reqired: Required to have an entry for each link reference found in either the `bytecode` or `runtime_bytecode` fields.
    * Type: Hash
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
