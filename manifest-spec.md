# The Ethereum Smart Contract Package Manifest Specification

This document defines the specification for the manifest file used for
packaging ethereum smart contracts.

## Guiding Principles

The package manifest specification makes the following assumptions.

1. Package manifests will be consumed by package managers.
2. Package manifests will be stored off-chain.


## Use Cases

The following use cases were used to guide the specification.

1. Code with zero deployed instances.
    1. Reusable base contracts.
2. Code with one or more addresses.
    1. Libraries: Installation of the package involves having an importable interface for the library and linking against the proper address during deployment.
    2. Contracts: Installation of the package involves having an importable interface and some manner of templating in the proper addresses into the local source code prior to compilation as well as other non-contract code that may interact with the installed contract.


It is worth pointing out that the *Library* and *Contract* use cases are functionally the same.  Once [Solidity issue #242](https://github.com/ethereum/solidity/issues/242) has been addressed this distinction may no longer need to exist.

## Manifest format

The canoonical format for the package manifest is a JSON document containing a
single JSON object.  


## Manifest filename
convention is to name this document `epm.json` which is short for *'ethereum
package manifest'*.

## Manifest Data Overview

The following fields are defined as data that *may* be included in a package
manifest.  Custom fields should be prefixed with `x-` to prevent collision with
new fields introduced in future versions of the specification.

- manifest version
- package name
- author
- version
- description
- contract metadata
  - abi
  - unlinked binary
  - deployed addresses
  - linked libraries
  - compiler version for bytecode verification
- external project URIs (homepage, repository uri, etc.)
- dependencies (i.e., references to other packages and versions)

## Manifest Data Specification

### Manifest Version: `manifest_version`


The `manifest_version` field defines the version of the ethereum package manifest
specification (this document) that this manifest conforms to. All manifests
**must** include this field.

* Key: `manifest_version`
* Type: Integer
* Allowed Values: `1`
* Package Manager Guide: Package managers should validate this field is valid prior to publishing new manifests.


### Package Name: `package_name`

The `package_name` field defines a human readable name for this package.  All
manifests **should** include this field.

* TODO: what should happen if this is missing (should it be required?)
* Key: `package_name`
* Type: String
* Package Manager Guide: Package managers should use this field when registering new packages (TODO: define this better)

### Author: `author`

The `author` field defines a human readable name for the author of this package.  All
manifests **should** include this field. 


* Key: `author`
* Type: String

### Version: `version`

The `version` field declares the version number of this release.  This value
**should** be conform to the [semver](http://semver.org/) version numbering
specification.  All manifests must **include** this field.

* Key: `version`
* Type: String
* Package Manager Guide: Package Managers should validate this field conforms to the *semver* format and display a warning if it does not.


### Description: `description`

The `description` field *should* be used to provide additional detail that may be relevant for the package.

* TODO: should this include a suggestion to use a specific markup format like markdown?
* Key: `description`
* Type: String


### Links: `links`

The `links` field *should* be used to provide URIs to relevant resources
associated with this package.  When possible, authors *should* use the
following keys for the following common resources.

* `website`: Primary website for the package.
* `documentation`: Package Documentation
* `repository`: Location of the project source code.
* TODO: what other common fields?

* Key: `links`
* Type: Hash(String: String)

### Contract Meta: `??-TODO-??`

TODO: define this

- contract metadata
  - abi
  - unlinked binary
  - deployed addresses
  - linked libraries
  - compiler version for bytecode verification

### Dependencies: `dependencies`

TODO: define this.

- dependencies (i.e., references to other packages and versions)
