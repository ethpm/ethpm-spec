# Release Lockfile Specification

This document defines the specification for the **Release Lockfile**.  The
release lockfile provides metadata about the package and in most cases should
provide sufficient information about the packaged contracts and its
dependencies to do bytecode verification of its contracts.

## Guiding Principles

The release lockfile specification makes the following assumptions about the
document lifecycle.

1. Release lockfiles are intended to be generated programatically by package management software as part of the release process.
2. Release lockfiles will be consumed by package managers during tasks like installing package dependencies or building and deploying new releases.
3. Release lockfiles will typically **not** be stored alongside the source, but rather by package registries *or* referenced by package registries and stored in something akin to IPFS.


## Keywords

### RFC2119

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED",  "MAY", and "OPTIONAL" in this document are to be
interpreted as described in RFC 2119.

* https://www.ietf.org/rfc/rfc2119.txt

### Custom

#### Prefixed vs Unprefixed

A prefixed hexidecimal value begins with `'0x'`.  Unprefixed values have no
prefix.  Unless otherwise specified, all hexidecimal values should be
represented with the `'0x'` prefix.

* Prefixed: `0xdeadbeef`
* Unprefixed: `deadbeef`


#### Bytecode

The set of EVM instructions as produced by a compiler.  Unless otherwise
specified this should be assumed to be hexidecimal encoded and prefixed with a
`'0x'`.

#### Unlinked Bytecode

Unlinked bytecode is the hexidecimal representation of a contract's EVM
instructions which contains placeholders which are referred to as *link
references*.

* Unlinked Bytecode: `606060405260e0600073__MathLib_______________________________634d536f`


#### Linked Bytecode

Linked bytecode is the hexidecimal representation of a contract's EVM instructions which has hadd all *link references* replaced with the desired *link values*

* linked Bytecode: `606060405260e06000736fe36000604051602001526040518160e060020a634d536f`


#### Link Reference

A placeholder within the hexidecimal representation of a contract's EVM instructions.

`606060405260e0600073__MathLib_______________________________634d536f` the

In the bytecode
`606060405260e0600073__MathLib_______________________________634d536f`, the
substring `__MathLib_______________________________` is a link reference.


#### Link Value

A link value is the value which can be inserted in place of a link reference.


#### Linking

The act of replacing *link references* within some bytecode with *link values*.


#### Contract Type

This term is used to refer to a specific contract in the package source. This
term can be used to refer to an abstract contract, a normal contract, or a
library.  Two contracts are of the same *contract type* if they have the same
bytecode.

Example:

```
contract Wallet {
    ...
}
```

A deployed instance of the `Wallet` contract would be of of type `Wallet`.


#### Contract Name

The name found in the source code which defines a specific *contract type*.
These names **must** conform to the regular expression
`[a-zA-Z][-a-zA-Z0-9_]*`.

There can be multiple contracts with the same *contract name* in
a projects source files.


#### Contract Alias

This is a name used to reference a specific *contract type*.  Contract
aliases **must** be unique within a single release lockfile.  

The *contract alias* **must** use *one of* the following naming schemes.

* `<contract-name>`
* `<contract-name>[<identifier>]`
    
The `<contract-name>` portion **must** be the same as the *contract name* for
this *contract type*.

The `[<identifier>]` portion **must** match the regular expression
`\[[-a-zA-Z0-9]{1,256}\]`.


#### Contract Instance 

A contract instance a specific deployed version of a *contract type*.  All
contract instances have an address on some specific chain.


#### Contract Instance Name

A name which refers to a specific *contract instance* on a specific chain from
the deployments of a single release lockfile.  This name **must** be unique
across all other *contract instances* for the given chain.  The name must
conform to the regular expression `[a-zA-Z][a-zA-Z0-9_]*`.

In cases where there is a single deployed instance of a given *contract type*
package managers **should** use the *contract alias* for that *contract type*
for this name.

In cases where there are multiple deployed instances of a given *contract type*
package managers **should** use a name which provides some added semantic
information as to help differentiate the two deployed instances in a meaningful
way.


## Format

The canonical format for the release lockfile is a JSON document containing a
single JSON object.  


## Document Specification

The following fields are defined for the release lockfile.  Custom fields may
be included.  Custom fields **should** be prefixed with `x-` to prevent name
collisions with future versions of the specification.


### Lock File Version: `lockfile_version`


The `lockfile_version` field defines the specification version that this
document conforms to.  Release lockfiles **must** include this field.

* Required: Yes
* Key: `lockfile_version`
* Type: String
* Allowed Values: `1`


### Package Name: `package_name`

The `package_name` field defines a human readable name for this package.
Release lockfiles **must** include this field.  Package names **must**
begin with a lowercase letter and be comprised of only lowercase letters,
numeric characters, and the dash character `'-'`.  Package names **must** not
exceed 214 characters in length.

* Required: Yes
* Key: `package_name`
* Type: String
* Format: Package names must conform to the following regular expression. `[a-z][-a-z0-9]{0,213}`


### Package Meta: `meta`

The `meta` field defines a location for metadata about the package
which is not integral in nature for package installation, but may be important
or convenient to have on-hand for other reasons. This field **should** be
included in all release lockfiles.

* Required: No
* Key: `meta`
* Type:  Object (String: *Package Meta* object)


### Version: `version`

The `version` field declares the version number of this release.  This value
**must** be included in all release lockfiles.  This value **should** be conform
to the [semver](http://semver.org/) version numbering specification.

* Required: Yes
* Key: `version`
* Type: String


### Sources: `sources`

The `sources` field defines a source tree that **should** comprise the full
source tree necessary to recompile the contracts contained in this release.
Sources are declared in a key/value mapping.  

* Keys **must** be relative filesystem paths beginning with a `./`.  Paths **must** resolve to a path that is within the current working directory.

* Values **must** conform to *one of* the following formats.
    * Source string.
        * When the value is a source string the key should be interpreted as a file path.
    * IPFS URI
        * *If* the resulting document is a directory the key should be interpreted as a directory path.
        * *If* the resulting document is a file the key should be interpreted as a file path.

* Key: `sources`
* Type: Object (String: String)


### Contract Types: `contract_types`

The `contract_types` field holds the *contract types* which have been included
in this release.  Release lockfiles **should** only include *contract types*
which can be found in the source files for this package.  Release lockfiles
**should not** include *contract types* from dependencies.

* Key: `contract_types`
* Type:  Object (String: *Contract Type* Object)
* Format: 
    * Keys **must** be valid *contract aliases*.
    * Values **must** conform to the *Contract Type* object definition.


Packages **should not** include abstract contracts in the *contract types*
section of a release.


### Deployments: `deployments`

The `deployments` field holds the information for the chains on which this
release has *contract instances* as well as the *contract types* and other
deployment details for those deployed *contract instances*.  The set of chains
defined by the BIP122 URI keys for this object **must** be unique.

* Key: `deployments`
* Type:  Object (String: Object(String: *Contract Instance* Object))
* Format: 
    * Keys **must** be valid BIP122 URI chain definitions.
    * Values **must** be objects which conform to the format:
        * Keys **must** be valid *contract instance* names.
        * Values **must** be valid *Contract Instance* objects.


### Build Dependencies: `build_dependencies`


The `build_dependencies` field defines a key/value mapping of ethereum packages that
this project depends on.

* Key: `dependencies`
* Type: Object (String: String)
* Format:
    * Keys **must** be valid package names matching the regular expression `[a-z][-a-z0-9]{0,213}`
    * Values **must** be valid IPFS URIs which resolve to a valid *Release Lock File*


## Object Definitions

Definitions for different objects used within the release lockfile.  All
objects allow custom fields to be included.  Custom fields **should** be
prefixed with `x-` to prevent name collisions with future versions of the
specification.


### The *Package Meta* Object

The *Package Meta* object is defined to have the following key/value pairs.


#### Authors: `authors`

The `authors` field defines a list of human readable names for the authors of
this package.  Release lockfiles **may** include this field. 

* Required: No
* Key: `authors`
* Type: List of Strings


### License: `license`

The `license` field declares the license under which this package is released.
This value **should** be conform to the
[SPDX](https://en.wikipedia.org/wiki/Software_Package_Data_Exchange) format.
Release lockfiles **should** include this field.

* Required: No
* Key: `license`
* Type: String


### Description: `description`

The `description` field provides additional detail that may be relevant for the
package.  Release lockfiles **may** include this field.

* Required: No
* Key: `description`
* Type: String


### Keywords: `keywords`

The `keywords` field provides relevant keywords related to this package.  

* Required: No
* Key: `keywords`
* Type: List of Strings


### Links: `links`

The `links` field provides URIs to relevant resources
associated with this package.  When possible, authors **should** use the
following keys for the following common resources.

* `website`: Primary website for the package.
* `documentation`: Package Documentation
* `repository`: Location of the project source code.

* Key: `links`
* Type: Object (String: String)


### The *Contract Type* Object

A *Contract Type* object is defined to have the following key/value pairs.


#### Contract Name `contract_name`

The `contract_name` field defines *contract name* for this *contract type*.

* Required: If the *contract name* and *contract alias* are not the same.
* Type: String
* Format: **must** match the regular expression `[a-zA-Z][a-zA-Z0-9_]*`


#### Bytecode `bytecode`

The `bytecode` field defines the unlinked `'0x'` prefixed bytecode for this *contract type*

* Required: No
* Type: String
* Format: Hex encoded unlinked bytecode for the compiled contract.


#### Runtime Bytecode `runtime_bytecode`

The `runtime_bytecode` field defines the unlinked `'0x'` prefixed runtime
portion of bytecode for this *contract type*.

* Required: No
* Type: String
* Format: Hex encoded unlinked runtime portion of the bytecode for the compiled contract.


#### ABI `abi`

* Required: No
* Type: List
* Format: see https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#json


#### Natspec `natspec`

* Required: No
* Type: Object
* Format: The Merged *UserDoc* and *DevDoc*
    * [UserDoc](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format#user-documentation) 
    * [DevDoc](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format#developer-documentation)


#### Compiler `compiler`

* Required: No
* Type: Object
* Format: **must** conform the the *Compiler Information* object format.


### The *Contract Instance* Object

A *Contract Instance* object is defined to have the following key/value pairs.


#### Contract Type `contract_type`

The `contract_type` field defines the *contract type* for this *contract
instance*.  This can reference any of the *contract types* included in this
release lockfile *or* any of the *contract types* found in any of the package
dependencies from the `build_dependencies` section of the release lockfile.

* Required: Yes
* Type: String
* Format: **must** conform to one of the following formats

To reference a *contract type* from this release lockfile, use the format `<contract-alias>`.

* The `<contract-alias>` value **must** be a valid *contract alias*.
* The value **must** be present in the keys of the `contract_types` section of this release lockfile.

To reference a *contract type* from a dependency, use the format `<package-name>:<contract-alias>`.  

* The `<package-name>` value **must** be present in the keys of the `build_dependencies` of this release lockfile.  
* The `<contract-alias>` value **must** be be a valid *contract alias* 
* The resolved release lockfile for `<package-name>` must contain the `<contract-alias>` value in the keys of the `contract_types` section.


#### Address `address`

The `address` field defines the address of the *contract instance*

* Required: Yes
* Type: String
* Format: Hex encoded `'0x'` prefixed ethereum address matching the regular expression `0x[0-9a-fA-F]{40}`.


#### Transaction `transaction`

The `transaction` field defines the transaction hash in which this *contract
instance* was created.

* Required: No
* Type: String
* Format: `0x` prefixed hex encoded transaction hash.


#### Block `block`

The `block` field defines the block hash in which this the transaction which
created this *contract instance* was mined.

* Required: No
* Type: String
* Format: `0x` prefixed hex encoded block hash.


#### Runtime Bytecode `runtime_bytecode`

The `runtime_bytecode` field defines the unlinked `'0x'` prefixed runtime
portion of bytecode for this *contract instance*.  When present, the value from
this field takes priority over the `runtime_bytecode` from the
*contract_type* for this *contract instance*.

* Required: No
* Type: String
* Format: Hex encoded unlinked runtime portion of the bytecode for the compiled contract.


#### Compiler `compiler`

The `compiler` field defines the compiler information that was used during
compilation of this *contract class*.  This field **should** be present in all
*contract types* which include `bytecode` or `runtime_bytecode`.

* Required: No
* Type: Object
* Format: **must** conform the the *Compiler Information* object format.


#### Link Dependencies `link_dependencies`

The `link_dependencies` defines the values which were used to fill in any
*link* references which are present in the `runtime_bytecode` for this
*contract instance*.  This field **must** be present if there are any *link
references* in the `runtime_bytecode` for this *contract instance*.  This field
**must** contain an entry for all *link references* found the `runtime_bytecode`.

* Required: If there are any *link references* in the `runtime_bytecode` for the *contract type* of this *contract instance*.
* Type: Array
* Format: All values **must** be valid *Link Value* objects


### The *Link Value* Object

A *Link Value* object is defined to have the following key/value pairs.


#### Offset `offset`

The `offset` field defines the location within the corresponding bytecode where
the `value` for this *link value* should be written.  This location is a
0-indexed offset from the beginning of the unprefixed hexidecimal
representation of the bytecode.

* Required: Yes
* Type: Integer
* Format: The integer **must** conform to all of the following:
    * be greater than or equal to zero 
    * strictly less than the length of the unprefixed hexidecimal representation of the corresponding bytecode.


#### Value `value`

The `value` field defines the value which should be written when *linking* the
corresponding bytecode.

* Required: Yes
* Type: String
* Format: One of the following formats.

To reference address of a *contract instance* from the current release lockfile
the value should be set to the name of that *contract instance*.  

* This value **must** be a valid *contract instance* name.
* The chain definition under which the *contract instance* that this *link value* belongs to must contain this value within its keys.
* This value **may not** reference the same *contract instance* that this *link value* belongs to.

To reference an address of a *contract instance from one of the dependencies of
this release lockfile the value should be in the format
`<package-name>:<contract-instance>`.

* The `<package-name>` value **must** be present in the `build_dependencies` for this release lockfile.
* The `<contract-instance>` value **must** be a valid *contract instance* name.
* Within the release lockfile of the package dependency defined by `<package-name>` value all of the following must be satisfiable:
    * There **must** be *exactly* one chain defined under the `deployments` key which matches the chain definition that this *link value* is nested under.
    * The `<contract-instance>` value **must** be present in the keys of the matching chain.


A static address can be used by simply using the `'0x'` prefixed address as the
value.  Package managers **should not** use this pattern when building releases
that will be published as open source packages or that are intended to be used
outside of a closed system.  Package managers **should** require some form of
explicit input from the user such as a command line flag like
`--allow-unverifiable-linking` before linking code with this type of *link
value*. 


### The *Compiler Information* Object

The `compiler` field defines the compiler information that was used during
compilation of this *contract instance*.  This field **should** be present in all
*contract instances* which locally declare `runtime_bytecode`.

A *Compiler Information* object is defined to have the following key/value pairs.


#### Type `type`

The `type` field defines which compiler was used in compilation.

* Required: Yes
* Key: `type`:
* Type: String
* Allowed Values:
    * `'solc'` for the solc command line compiler.
    * `'solcjs'` for the nodejs solc compiler.

#### Version `version`

The `version` field defines the version of the compiler. The field **should** be OS 
agnostic (OS not included in the string) and take the form of either the stable version
in semver format or if built on a nightly should be denoted in the form of 
`<semver>-<commit-hash>` ex: `0.4.8-commit.60cc1668`.

* Required: Yes
* Key `version`:
* Type: String


#### Settings `settings`

The `settings` field defines any settings or configuration that was used in
compilation.

* Required: No
* Key `settings`:
* Type: Object
* Format: Depends on the `type` of the compiler.  See below:

For the `'solc'` and `'solcjs'` compilers, the `settings` value must conform to
the following format.

* Keys:
    * `optimize`
        * Required: No
        * Type: Boolean
    * `optimize_runs`
        * Required: No
        * Type: Integer
        * Format: Greater than or equal to 1.


### BIP122 URIs

BIP122 URIs are used to define a blockchain via a subset of the
[BIP-122](https://github.com/bitcoin/bips/blob/master/bip-0122.mediawiki) spec.

```
blockchain://<genesis_hash>/block/<latest confirmed block hash>
```

The `<genesis hash>` represents the blockhash of the first block on the chain,
and `<latest confirmed block hash>` represents the hash of the latest block
that's been reliably confirmed (package managers should be free to choose their
desired level of confirmations).
