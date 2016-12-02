# Release Lock File Specification

 This document defines the specification for the **Release Lock File**.  The release lock file provides metadata about the package and in most cases should provide sufficient information about the packaged contracts and its dependencies to do bytecode verification of its contracts.
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
 

The schema defines the following properties:

## `lock_file_version` (integer, required)

 The `lock_file_version` field defines the specification version that this document conforms to.  All release lock files **must** include this field.  

Default: `1`

## `package_manifest` (string, required)

 The `package_manifest` field references the package's Package Manifest document as it existed at the time this release was created.  All release lock files **must** include this field.  The manifest may be referenced using an IPFS URI or by directly embedding the document under this key.  

## `version` (string, required)

 The `version` field declares the version number of this release.  This value **must** be included in all release lock files.  This value **should** be conform to the [semver](http://semver.org/) version numbering specification.  

Default: `"0.0.1-dev"`

## `license` (string)

The `license` field declares the license under which this package is released.  This value **should** be conform to the [SPDX](https://en.wikipedia.org/wiki/Software_Package_Data_Exchange) format.  All release lock files **should** include this field.

Default: `"MIT"`

## `sources` (array)

The sources field defines a set of source files that comprise the source code for the project. This list should be included in all manifests. Package managers should use this field to inform population of the sources field in the release lock file.

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


The object is an array with all elements of the type `string`.

Default:

```
[]
```

## `chain` (array)

The `chain` field defines the blockchain that should be used for any addresses provided with this package.  A blockchain is defined using [BIP-122](https://github.com/bitcoin/bips/blob/master/bip-0122.mediawiki).  A matching blockchain is one on which all resources defined by the list of BIP122 URIs can be found. *If* this release lock file includes any addressed contracts this field **must** be present.  Convention is to define a chain using a single URI which points to the latest observable block hash and includes the genesis hash as the `chain_id`.

The object is an array with all elements of the type `string`.

Default:

```
[]
```

## `contracts` (object)

The `contracts` field declares information about the deployed contracts included within this release.