# Package Manifest Specification

This document defines the specification for the **Package Manifest**.  The
package manifest contains meta data about the package as well as dependencies
needed for installation of the package.


## Guiding Principles

The package manifest specification makes the following assumptions about the
document lifecycle.

1. Package manifests are long lived documents that will be modified regularly
2. Package manifests will primarily be consumed by package managers.
3. Package manifests will primarily be used by package indexes to popululate basic package metadata.
2. Package Managers will typically be used to assist in the creation and modification of Package Manifest documents.
4. Package Manifest documents will occasionally be created and modified manually by people.
4. Package manifests will typically be stored alongised the package source code.


## Format

The canoonical format for the package manifest is a JSON document containing a
single JSON object.  


## Filename

Convention is to name this document `epm.json` which is short for *'ethereum
package manifest'*.


## Document Specification

The following fields are defined for the package manifest.  Custom fields may
be included.  Custom fields **should** be prefixed with `x-` to prevent name
collisions with future versions of the specification.


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

### Authors: `authors`

The `authors` field defines a list of human readable names for the authors of
this package.  All manifests **should** include this field. 


* Key: `authors`
* Type: List of Strings


### Version: `version`

The `version` field declares the current version number of this package.  This value
**should** be conform to the [semver](http://semver.org/) version numbering
specification.  All manifests **must** this field.

* Key: `version`
* Type: String


### License: `license`

The `license` field declares the license under which this package is released.  This value
**should** be conform to the
[SPDX](https://en.wikipedia.org/wiki/Software_Package_Data_Exchange) format.
All manifests **should** include this field.

* Key: `license`
* Type: String

### Entry Point: `entry_point`

The `entry_point` field declares the main contract to access and utilize for this package.  This value
**must** be a `.sol` file.

* Key: `entry_point`
* Type: String


### Description: `description`

The `description` field *should* be used to provide additional detail that may be relevant for the package.

* TODO: should this include a suggestion to use a specific markup format like markdown?
* Key: `description`
* Type: String


### Keywords: `keywords`

The `keywords` field *should* be used to provide relevant keywords related to this package.

* Key: `keywords`
* Type: List of Strings


### Links: `links`

TODO: This could potentially not be necessary, or should be removed.  Needs discussion.

The `links` field *should* be used to provide URIs to relevant resources
associated with this package.  When possible, authors *should* use the
following keys for the following common resources.

* `website`: Primary website for the package.
* `documentation`: Package Documentation
* `repository`: Location of the project source code.
* TODO: what other common fields?

* Key: `links`
* Type: Object (String: String)


### Source Files: `sources`

The `sources` field defines a set of source files that comprise the source code
for the project.  This list **should** be included in all manifests.  Package
managers **should** use this field to inform population of the `sources` field in
the *release lock file*.

* Key: `sources`
* Type: List of Strings
* Format: Strings **must** be formatted as valid filesystem paths.  All paths **must** be relative paths beginning with `./`.  All paths **must** resolve to to a path located within the base directory of the package (i.e., the location of `epm.json`)


### Contracts: `contracts`

The `contracts` field defines a list of contract names that should be included
in the release manifest when generating a release.


* Key: `contracts`
* Type: List of Strings


### Dependencies: `dependencies`

the `dependencies` field defines a key/value mapping of ethereum packages that
this project depends on.

* All keys **must** be valid package names matching the regular expression `[a-zA-Z][-a-zA-Z0-9_]*`
* All values **must** conform to *one of* the following formats:
    * IPFS URI:
        * The resolved document **must** be a valid *release lock file*.
    * Version String.


* Key: `dependencies`
* Type: Object (String: String)


## Examples

TODO: populate these when the spec is no longer changing a bunch.
