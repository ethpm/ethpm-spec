# Package Manifest Specification

This document defines the specification for the **Package Manifest**. The
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
This document defines the specification for the Package Manifest. The package manifest contains meta data about the package as well as dependencies needed for installation of the package.

The schema defines the following properties:

## `package_name` (string)

 The `package_name` field defines a human readable name for this package.  All manifests **should** include this field.

## `manifest_version` (integer, required)

 The `manifest_version` field defines the version of the ethereum package manifest specification (this document) that this manifest conforms to. All manifests **must** include this field.

Default: `1`

## `authors` (array)

 The `authors` field defines a list of human readable names for the authors of this package.  All manifests **should** include this field.

The object is an array with all elements of the type `string`.

Default:

```
[]
```

## `version` (string, required)

 The `version` field declares the current version number of this package.  This value **should** be conform to the [semver](http://semver.org/) version numbering specification.  All manifests **must** this field.

Default: `"0.0.1-dev"`

## `license` (string)

The `license` field declares the license under which this package is released.  This value **should** be conform to the [SPDX](https://en.wikipedia.org/wiki/Software_Package_Data_Exchange) format.  All manifests **should** include this field.

Default: `"MIT"`

## `description` (string)

The `description` field *should* be used to provide additional detail that may be relevant for the package.

Default: `""`

## `keywords` (array)

The `keywords` field *should* be used to provide relevant keywords related to this package.

The object is an array with all elements of the type `string`.

Default:

```
[]
```

## `links` (object)

 The `links` field *should* be used to provide URIs to relevant resources associated with this package.  When possible, authors *should* use the following keys for the following common resources.

## `sources` (array)

 The `sources` field defines a set of source files that comprise the source code for the project.  This list **should** be included in all manifests.  Package managers **should** use this field to inform population of the `sources` field in the *release lock file*.  

The object is an array with all elements of the type `string`.

Default:

```
[]
```

## `contracts` (array)

The `contracts` field defines a list of contract names that should be included in the release manifest when generating a release.

The object is an array with all elements of the type `string`.

Default:

```
[]
```

## `dependencies` (object)

the `dependencies` field defines a key/value mapping of ethereum packages that this project depends on.

Default:

```
{}
```