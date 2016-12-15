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


### Contracts: `contracts`

The `contracts` field declares information about the deployed contracts
included within this release.

* Key: `contracts`
* Type:  Object (String: *Contract* Object)
* Format: 
    * All keys **must** be valid contract names matching the regex `[_a-zA-Z][_a-zA-Z0-9]*`.
    * All values **must** conform to the *Contract* object definition.


### Build Dependencies: `build_dependencies`


the `dependencies` field defines a key/value mapping of ethereum packages that
this project depends on.


* Key: `dependencies`
* Type: Object (String: String)
* Format:
    * All keys **must** be valid package names matching the regular expression `[a-z][-a-z0-9]{0,213}`
    * All values **must** be valid IPFS URIs which resolve to a valid *Release Lock File*


#### The *Contract* Object

A *Contract* Object is an object with the following key/values.

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
* `deployments`
    * Required: No
    * Type: Object(String: Object(String: *Deployment* object)
    * Format: 
        * All keys **must** be valid BIP122 URIs matching the regular expression `blockchain://[0-9a-fA-F]{64}/block/[0-9a-fA-F]{64}`
        * All values **must** be objects which conform to the following format
            * Type: Object(String: *Deployment* object)
            * Format:
                * All keys **must** be strings conforming to the regular expression `[_a-zA-Z][_a-zA-Z0-9]*`.
                    * In the case that there is a single deployed instance this **should** use the same name as the contract.  
                    * In the case that there are multiple deployed instances of the same contract a unique name should be used for each deployed instance.
                * All values **must** be objects conforming to the *Deployment* object format (see below).


#### The *Deployments* Object


* `address`:
    * Required: Yes
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
* `bytecode_link_dependencies`:
    * Reqired: If the `bytecode` has link references.
    * Type: Array of *Link Reference* Objects
* `runtime_bytecode_link_dependencies`:
    * Reqired: If the `runtime_bytecode` has link references.
    * Type: Array of *Link Reference* Objects


#### Link Reference Object

The *Link Reference* object defines the values that should be substituted for
any link references present in the `bytecode` or `runtime_bytecode` of a
contract.  Each Link Reference is an object with the following fields.

* `offset`:
    * Required: Yes
    * Type: Integer
    * Format: 0-indexed offset from the beginning of the hex encoded unprefixed bytecode where the `value` portion of this *Link Reference* should be written to.  The term *unprefixed* means the bytecode without a `'0x'` prefix.
* `value`:
    * Required: Yes
    * Type: String
    * Format: One of the following formats.
        * Address:
            * A `'0x'` prefixed hex encoded ethereum address.
        * Local Reference:
            * A URL fragment matching the regular expression `\#[_a-zA-Z][_a-zA-Z0-9]*\:[_a-zA-Z][_a-zA-Z0-9]*`.  
        * Build Dependency Reference:
            * An IPFS URI with a URL fragment matching the regular expression `\#[_a-zA-Z][_a-zA-Z0-9]*\:[_a-zA-Z][_a-zA-Z0-9]*`.  
            * The IPFS URI **must** be present within the `build_dependencies` of this lockfile.

The *Local Reference* and the *Build Dependency Reference* values should be
validated and resolved as follows.

1. Resolve the lockfile
    * For a *Local Reference* this is the current lockfile
    * For a *Build Dependency Reference* this is file found at the IPFS URI
2. Split the URL fragment on the semicolon `':'`.
    * The first value is the *Contract Name*
    * The second value is the *Deployed Contract Name*
3. In the resolved lockfile lookup the contract whose name matches the *Contract Name*.
4. Within the `deployments` for that contract, filter out any chain definitions which are not the same chain as the chain definition for the contract being linked.
5. Filter the deployed contract names from the resulting chains to ones that match the *Deployed Contract Name*.
6. *If* there is exactly one result use the `address` field for this deployed contract as the link value.  Otherwise the link reference cannot be resolved.

Two chains definitions are considered to reference the same chain *if* they
both have the same `chain_id` **and** both block hashes can be found on that
chain.


#### BIP122 URIs

BIP122 URIs are used to define a blockchain via a subset of the
[BIP-122](https://github.com/bitcoin/bips/blob/master/bip-0122.mediawiki) spec.

```
blockchain://<genesis_hash>/block/<latest confirmed block hash>
```

The `<genesis hash>` represents the blockhash of the first block on the chain,
and `<latest confirmed block hash>` represents the hash of the latest block
that's been reliably confirmed (package managers should be free to choose their
desired level of confirmations).
