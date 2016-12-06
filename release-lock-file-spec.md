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

The canonical format for the package manifest is a JSON document containing a
single JSON object.  


## Filename

When creating a release, convention is to name this document `<version>.json`.

* The `1.0.0` Release would be named `1.0.0.json`

Package managers may keep their own copy of this file as part of their package installation process.  In these cases it is up to the package manager to decide on a naming convention.  Package managers **should** keep the `.json` file extension.


## Document Specification

The following fields are defined for the release lock file.  Custom fields may
be included.  Custom fields **should** be prefixed with `x-` to prevent name
collisions with future versions of the specification.


### Lock File Version: `lock_file_version`


The `lock_file_version` field defines the specification version that this
document conforms to.  All release lock files **must** include this field.

* Key: `lock_file_version`
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

* All keys **must** be relative filesystem paths beginning with a `./`.  All paths **must** resolve to a path that is within the current working directory.

* All values **must** conform to *one of* the following formats.
    * Source string.
        * When the value is a source string the key should be interpreted as a file path.
    * IPFS URI
        * *If* the resulting document is a directory the key should be interpreted as a directory path.
        * *If* the resulting document is a file the key should be interpreted as a file path.

* Key: `sources`
* Type: Object (String: String)


### Chain: `chain`

The `chain` field defines the blockchain that should be used for any addresses
provided with this package.  A blockchain is defined using
[BIP-122](https://github.com/bitcoin/bips/blob/master/bip-0122.mediawiki).  A
matching blockchain is one on which all resources defined by the list of BIP122
URIs can be found. *If* this release lock file includes any addressed contracts
this field **must** be present.  Convention is to define a chain using a single
URI which points to the latest observable block hash and includes the genesis
hash as the `chain_id`.

* Key: `chain`
* Type: List os Strings
* Format: All strings **must** be valid BIP122 URIS


### Contracts: `contracts`

The `contracts` field declares information about the deployed contracts
included within this release.

* Key: `contracts`
* Type:  Object (String: *Contract Instance Object*)
* Format: 
    * All keys **must** be valid contract names matching the regex `[_a-zA-Z][_a-zA-Z0-9]*`.
    * All values **must** conform to the *Contract Instance Object* definition.


### Build Dependencies: `build_dependencies`


the `dependencies` field defines a key/value mapping of ethereum packages that
this project depends on.

* All keys **must** be valid package names matching the regular expression `[a-z][-a-z0-9_]{0,214}`
* All values **must** conform to *one of* the following formats:
    * IPFS URI:
        * The resolved document **must** be a valid *release lock file*.
    * Version String that resolves to a specific package version.


* Key: `dependencies`
* Type: Object (String: String)


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
* `deploy_transaction`:
    * Required: No
    * Type: String
    * Format: [BIP122](https://github.com/bitcoin/bips/blob/master/bip-0122.mediawiki) URI which defines the transaction in which this contract was created.
* `deploy_block`:
    * Required: No
    * Type: String
    * Format: [BIP122](https://github.com/bitcoin/bips/blob/master/bip-0122.mediawiki) URI which defines the block in which this contract was created.
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
    * Type: Object
    * Format: Combined [UserDoc](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format#user-documentation) and [DevDoc](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format#developer-documentation)
* `compiler`:
    * Required: Required if either `bytecode` or `runtime_bytecode` is present.
    * Type: Object
    * Keys:
        * `type`:
            * Required: Yes
            * Type: String
            * Allowed Values:
                * `'solc'` for the solc command line compiler.
                * `'solcjs'` for the nodejs solc compiler.
        * `version`:
            * Required: Yes
            * Type: String
        * `settings`:
            * Required: No
            * Type: Object
            * Keys:
                * `optimize`
                    * Required: No
                    * Type: Boolean
                * `optimize_runs`
                    * Required: No
                    * Type: Integer
                    * Format: Positive Integer
* `link_dependencies`:
    * Reqired: Required to have an entry for each link reference found in either the `bytecode` or `runtime_bytecode` fields.
    * Type: Object
    * Format:
        * All keys **must** be strings which are formatted as valid link targets.
        * All values **must** conform to *one of* the following formats:
            * A hex encoded ethereum address.
            * A [json pointer](https://tools.ietf.org/html/rfc6901) to another *Contract Instance Object* in the release lock file.
            * An IPFS URI with a JSON point in the fragment portion of the URI.  The IPFS hash must resolves to a valid release lock file.  The json pointer **must** resolves to a *Contract Instance Object* within the release lock file.
