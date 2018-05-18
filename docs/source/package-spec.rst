.. _package-specification:

Package Specification
=====================

.. include:: _include.rst

This document defines the specification for a **Package**. The Package
JSON document provides metadata about itself and in most cases should
provide sufficient information about the packaged contracts and its
dependencies to do bytecode verification of its contracts.

Guiding Principles
------------------

The Package specification makes the following assumptions about the
document lifecycle.

1. Packages are intended to be generated programatically by package
   management software as part of the release process.
2. Packages will be consumed by package managers during tasks like
   installing package dependencies or building and deploying new
   releases.
3. Packages will typically **not** be stored alongside the source, but
   rather by package registries *or* referenced by package registries
   and stored in something akin to IPFS.

Keywords
--------

RFC2119
~~~~~~~

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in RFC 2119.

-  https://www.ietf.org/rfc/rfc2119.txt

Custom
~~~~~~

Prefixed vs Unprefixed
^^^^^^^^^^^^^^^^^^^^^^

A prefixed hexadecimal value begins with ``'0x'``. Unprefixed values
have no prefix. Unless otherwise specified, all hexadecimal values
should be represented with the ``'0x'`` prefix.

  :Prefixed: ``0xdeadbeef``
  :Unprefixed: ``deadbeef``

.. _contract names:

Contract Name
^^^^^^^^^^^^^

The name found in the source code which defines a specific |ContractType|.
These names **must** conform to the regular expression
``[a-zA-Z][-a-zA-Z0-9_]{0,255}``

There can be multiple contracts with the same contract name in a
projects source files.

.. _contract aliases:

Contract Alias
^^^^^^^^^^^^^^

This is a name used to reference a specific |ContractType|. Contract
aliases **must** be unique within a single |Package|.

The `contract alias`_ **must** use *one of* the following naming schemes.

-  ``<contract-name>``
-  ``<contract-name>[<identifier>]``

The ``<contract-name>`` portion **must** be the same as the `contract
name`_ for this contract type.

The ``[<identifier>]`` portion **must** match the regular expression
``\[[-a-zA-Z0-9]{1,256}\]``.

Contract Instance Name
^^^^^^^^^^^^^^^^^^^^^^

A name which refers to a specific |ContractInstance| on a specific
chain from the deployments of a single |Package|. This name **must** be
unique across all other contract instances for the given chain. The
name must conform to the regular expression
``[a-zA-Z][a-zA-Z0-9_]{0,255}``

In cases where there is a single deployed instance of a given |ContractType|,
package managers **should** use the `contract alias`_ for that
contract type for this name.

In cases where there are multiple deployed instances of a given
contract type, package managers **should** use a name which provides
some added semantic information as to help differentiate the two
deployed instances in a meaningful way.

Identifier
^^^^^^^^^^

A string matching the regular expression
``[a-zA-Z][-_a-zA-Z0-9]{0,255}``

Package Name
^^^^^^^^^^^^

A string matching the regular expression
``[a-zA-Z][-_a-zA-Z0-9]{0,255}``

Content Addressable URI
^^^^^^^^^^^^^^^^^^^^^^^

Any URI which contains a cryptographic hash which can be used to verify
the integrity of the content found at the URI.

The URI format is defined in RFC3986

It is **recommended** that tools support IPFS and Swarm.

Chain Definition
^^^^^^^^^^^^^^^^

This definition originates from `BIP122 URI <https://github.com/bitcoin/bips/blob/master/bip-0122.mediawiki>`__.

A URI in the format ``blockchain://<chain_id>/block/<block_hash>``

-  ``chain_id`` is the unprefixed hexadecimal representation of the
   genesis hash for the chain.
-  ``block_hash`` is the unprefixed hexadecimal representation of the
   hash of a block on the chain.

A chain is considered to match a chain definition if the the genesis
block hash matches the ``chain_id`` and the block defined by
``block_hash`` can be found on that chain. It is possible for multiple
chains to match a single URI, in which case all chains are considered
valid matches

Format
------

The canonical format for the Package JSON document containing a single
JSON object. Packages **must** conform to the following serialization
rules.

-  The document **must** be tightly packed, meaning no linebreaks or
   extra whitespace.
-  The keys in all objects must be sorted alphabetically.
-  Duplicate keys in the same object are invalid.
-  The document **must** use `UTF-8 <https://en.wikipedia.org/wiki/UTF-8>`_ encoding.
-  The document **must** not have a trailing newline.

Document Specification
----------------------

The following fields are defined for the Package. Custom fields may be
included. Custom fields **should** be prefixed with ``x-`` to prevent
name collisions with future versions of the specification.

EthPM Manifest Version: ``manifest_version``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``manifest_version`` field defines the specification version that
this document conforms to. Packages **must** include this field.

  :Required: Yes
  :Key: ``manifest_version``
  :Type: String
  :Allowed Values: ``2``

.. _package names:

Package Name: ``package_name``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``package_name`` field defines a human readable name for this
package. Packages **must** include this field. Package names **must**
begin with a lowercase letter and be comprised of only lowercase
letters, numeric characters, and the dash character ``'-'``. Package
names **must** not exceed 214 characters in length.

  :Required: Yes
  :Key: ``package_name``
  :Type: String
  :Format: **must** be a valid package name.

Package Meta: ``meta``
~~~~~~~~~~~~~~~~~~~~~~

The ``meta`` field defines a location for metadata about the package
which is not integral in nature for package installation, but may be
important or convenient to have on-hand for other reasons. This field
**should** be included in all Packages.

  :Required: No
  :Key: ``meta``
  :Type: Object (String: *Package Meta* object)

Version: ``version``
~~~~~~~~~~~~~~~~~~~~

The ``version`` field declares the version number of this release. This
value **must** be included in all Packages. This value **should**
conform to the `semver <http://semver.org/>`__ version numbering
specification.

  :Required: Yes
  :Key: ``version``
  :Type: String

Sources: ``sources``
~~~~~~~~~~~~~~~~~~~~

The ``sources`` field defines a source tree that **should** comprise the
full source tree necessary to recompile the contracts contained in this
release. Sources are declared in a key/value mapping.

  :Key: ``sources``

  :Type: Object (String: String)

  :Format: -  Keys **must** be relative filesystem paths beginning with a ``./``. Paths **must** resolve to a path that is within the current working directory.

    -  Values **must** conform to *one of* the following formats.

     -  Source string.

      -  When the value is a source string the key should be interpreted
         as a file path.

     -  `Content Addressable URI`_.

      -  *If* the resulting document is a directory the key should be
         interpreted as a directory path.
      -  *If* the resulting document is a file the key should be
         interpreted as a file path.

Contract Types: ``contract_types``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``contract_types`` field holds the |ContractTypes| which have been
included in this release. |Packages| **should** only include contract types
that can be found in the source files for this package. Packages
**should not** include contract types from dependencies.

  :Key: ``contract_types``
  :Type: Object (String: `Contract Type Object`_)
  :Format:

   -  Keys **must** be valid `contract aliases`_.
   -  Values **must** conform to the `Contract Type Object`_ definition.

Packages **should not** include abstract contracts in the contract types
section of a release.

Deployments: ``deployments``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``deployments`` field holds the information for the chains on which
this release has |ContractInstances| as well as the |ContractTypes|
and other deployment details for those deployed contract instances.
The set of chains defined by the BIP122 URI keys for this object
**must** be unique.

  :Key: ``deployments``
  :Type: Object (String: Object(String: `Contract Instance Object`_))
  :Format:

     -  Keys **must** be a valid BIP122 URI `chain definition`_.
     -  Values **must** be objects which conform to the format:

        -  Keys **must** be a valid `Contract Instance Name`_.
        -  Values **must** be a valid `Contract Instance Object`_.

Build Dependencies: ``build_dependencies``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``build_dependencies`` field defines a key/value mapping of ethereum
packages that this project depends on.

  :Key: ``dependencies``
  :Type: Object (String: String)
  :Format:

   -  Keys **must** be valid `package names`_ matching the regular
      expression ``[a-z][-a-z0-9]{0,213}``
   -  Values **must** be valid IPFS URIs which resolve to a valid
      Package

Definitions
-----------

Definitions for different objects used within the Package. All objects
allow custom fields to be included. Custom fields **should** be prefixed
with ``x-`` to prevent name collisions with future versions of the
specification.

.. _Link reference objects:
.. _link reference object:

The *Link Reference* Object
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A **|LinkReference| object** has the following key/value pairs. All
link references are assumed to be associated with some corresponding bytecode.

Offsets: ``offsets``
^^^^^^^^^^^^^^^^^^^^

The ``offsets`` field is an array of integers, corresponding to each of the
start positions where the link reference appears in the bytecode.
Locations are 0-indexed from the beginning of the bytes representation of
the corresponding bytecode.  This field is invalid if it references a position
that is beyond the end of the bytecode.

  :Required: Yes
  :Type: Array

Length: ``length``
^^^^^^^^^^^^^^^^^^

The ``length`` field is an integer which defines the length in bytes
of the link reference. This field is invalid if the end of the defined
link reference exceeds the end of the bytecode.

  :Required: Yes
  :Type: Integer

Name: ``name``
^^^^^^^^^^^^^^

The ``name`` field is a string which **must** be a valid `Identifier`_.
Any link references which **should** be linked with the same
link value **should** be given the same name.

  :Required: No
  :Type: String
  :Format: **must** conform to the `Identifier`_ format.

.. _Link value objects:
.. _Link value object:

The *Link Value* Object
~~~~~~~~~~~~~~~~~~~~~~~

A **|LinkValue| object** is defined to have the following key/value pairs.

.. _offset-offset-1:

Offsets: ``offsets``
^^^^^^^^^^^^^^^^^^^^

The ``offsets`` field defines the locations within the corresponding bytecode
where the ``value`` for this link value was written.  These locations are
0-indexed from the beginning of the bytes representation of the
corresponding bytecode.

  :Required: Yes
  :Type: Integer
  :Format: Array of integers, where each integer **must** conform to all of the following:

   -  be greater than or equal to zero
   -  strictly less than the length of the unprefixed hexadecimal
      representation of the corresponding bytecode.

Type: ``type``
^^^^^^^^^^^^^^

The ``type`` field defines the ``value`` type for determining what is encoded
when |linking| the corresponding bytecode.

  :Required: Yes
  :Type: String
  :Allowed  Values:
     -  ``'literal'`` for bytecode literals
     -  ``'reference'`` for named references to a particular |ContractInstance|

Value: ``value``
^^^^^^^^^^^^^^^^

The ``value`` field defines the value which should be written when
|linking| the corresponding bytecode.

  :Required: Yes
  :Type: String
  :Format: determined based on ``type``:

    Type ``literal``
      For static value literals (e.g. address), value **must** be a
      *byte string*

    Type ``reference``
        To reference the address of a |ContractInstance| from the current
        package the value should be the name of that contract instance.

        -  This value **must** be a valid contract instance name.
        -  The chain definition under which the contract instance that this
           link value belongs to must contain this value within its keys.
        -  This value **may not** reference the same contract instance that
           this link value belongs to.

        To reference a contract instance from a |Package| from somewhere
        within the dependency tree the value is constructed as follows.

        -  Let ``[p1, p2, .. pn]`` define a path down the dependency tree.
        -  Each of ``p1, p2, pn`` **must** be valid package names.
        -  ``p1`` **must** be present in keys of the ``build_dependencies`` for
           the current package.
        -  For every ``pn`` where ``n > 1``, ``pn`` **must** be present in the
           keys of the ``build_dependencies`` of the package for ``pn-1``.
        -  The value is represented by the string
           ``<p1>:<p2>:<...>:<pn>:<contract-instance>`` where all of ``<p1>``,
           ``<p2>``, ``<pn>`` are valid package names and
           ``<contract-instance>`` is a valid `contract name`_.
        -  The ``<contract-instance>`` value **must** be a valid
           `contract instance name`_.
        -  Within the package of the dependency defined by
           ``<pn>``, all of the following must be satisfiable:

           -  There **must** be *exactly* one chain defined under the
              ``deployments`` key which matches the chain definition that this
              link value is nested under.
           -  The ``<contract-instance>`` value **must** be present in the keys
              of the matching chain.

The *Bytecode* Object
~~~~~~~~~~~~~~~~~~~~~

A bytecode object has the following key/value pairs.

Bytecode: ``bytecode``
^^^^^^^^^^^^^^^^^^^^^^

The ``bytecode`` field is a string containing the ``0x`` prefixed
hexadecimal representation of the bytecode.

  :Required: Yes
  :Type: String
  :Format: `0x` prefixed hexadecimal.


Link References: ``link_references``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``link_references`` field defines the locations in the corresponding
bytecode which require |linking|.

  :Required: No
  :Type: Array
  :Format: All values **must** be valid `Link Reference objects`_

This field is considered invalid if *any* of the |LinkReferences| are
invalid when applied to the corresponding ``bytecode`` field, *or* if
any of the link references intersect.

Intersection is defined as two link references which overlap.

Link Dependencies: ``link_dependencies``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``link_dependencies`` defines the |LinkValues| that have been used
to link the corresponding bytecode.

-  Required: No
-  Type: Array
-  Format: All values **must** be valid `Link Value objects`_

Validation of this field includes the following:

-  No two link value objects may contain any of the same values for ``offsets``.
-  Each `link value object`_ **must** have a corresponding `link reference
   object`_ under the ``link_references`` field.
-  The length of the resolved ``value`` **must** be equal to the
   ``length`` of the corresponding |LinkReference|.

The *Package Meta* Object
~~~~~~~~~~~~~~~~~~~~~~~~~

The *Package Meta* object is defined to have the following key/value
pairs.

Authors: ``authors``
^^^^^^^^^^^^^^^^^^^^

The ``authors`` field defines a list of human readable names for the
authors of this package. Packages **may** include this field.

  :Required: No
  :Key: ``authors``
  :Type: List of Strings

License: ``license``
^^^^^^^^^^^^^^^^^^^^

The ``license`` field declares the license under which this package is
released. This value **should** conform to the
`SPDX <https://en.wikipedia.org/wiki/Software_Package_Data_Exchange>`__
format. Packages **should** include this field.

  :Required: No
  :Key: ``license``
  :Type: String

Description: ``description``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``description`` field provides additional detail that may be
relevant for the package. Packages **may** include this field.

  :Required: No
  :Key: ``description``
  :Type: String

Keywords: ``keywords``
^^^^^^^^^^^^^^^^^^^^^^

The ``keywords`` field provides relevant keywords related to this
package.

  :Required: No
  :Key: ``keywords``
  :Type: List of Strings

Links: ``links``
^^^^^^^^^^^^^^^^

The ``links`` field provides URIs to relevant resources associated with
this package. When possible, authors **should** use the following keys
for the following common resources.

  :``website``: Primary website for the package.

  :``documentation``: Package Documentation

  :``repository``: Location of the project source code.

  :Key: ``links``

  :Type: Object (String: String)

.. _Contract Type Object:

The *Contract Type* Object
~~~~~~~~~~~~~~~~~~~~~~~~~~

A *Contract Type* object is defined to have the following key/value
pairs.

Contract Name: ``contract_name``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``contract_name`` field defines the `contract name`_ for this
|ContractType|.

  :Required: If the `contract name`_ and `contract alias`_ are not the
   same.
  :Type: String
  :Format: **must** be a valid `contract name`_.

Deployment Bytecode: ``deployment_bytecode``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``deployment_bytecode`` field defines the bytecode for this |ContractType|.

  :Required: No
  :Type: Object
  :Format: **must** conform to `the Bytecode Object`_ format.


Runtime Bytecode: ``runtime_bytecode``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``runtime_bytecode`` field defines the unlinked ``'0x'`` prefixed
runtime portion of |Bytecode| for this |ContractType|.

  :Required: No
  :Type: Object
  :Format: **must** conform to `the Bytecode Object`_ format.

ABI: ``abi``
^^^^^^^^^^^^

  :Required: No
  :Type: List
  :Format: see https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#json

Natspec: ``natspec``
^^^^^^^^^^^^^^^^^^^^

  :Required: No
  :Type: Object
  :Format: The Merged *UserDoc* and *DevDoc*

   -  `UserDoc <https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format#user-documentation>`__
   -  `DevDoc <https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format#developer-documentation>`__

Compiler: ``compiler``
^^^^^^^^^^^^^^^^^^^^^^

  :Required: No
  :Type: Object
  :Format: **must** conform to `the Compiler Information object`_
   format.

.. _Contract Instance Object:

The *Contract Instance* Object
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A **|ContractInstance| Object** is defined to have the following key/value
pairs.

Contract Type: ``contract_type``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``contract_type`` field defines the |ContractType| for this
|ContractInstance|. This can reference any of the contract types
included in this |Package| *or* any of the contract types found in any
of the package dependencies from the ``build_dependencies`` section of
the |PackageManifest|.

  :Required: Yes
  :Type: String
  :Format: **must** conform to one of the following formats

To reference a contract type from this Package, use the format
``<contract-alias>``.

-  The ``<contract-alias>`` value **must** be a valid `contract alias`_.
-  The value **must** be present in the keys of the ``contract_types``
   section of this Package.

To reference a contract type from a dependency, use the format
``<package-name>:<contract-alias>``.

-  The ``<package-name>`` value **must** be present in the keys of the
   ``build_dependencies`` of this Package.
-  The ``<contract-alias>`` value **must** be be a valid `contract
   alias`_.
-  The resolved package for ``<package-name>`` must contain the
   ``<contract-alias>`` value in the keys of the ``contract_types``
   section.

.. _address:

Address: ``address``
^^^^^^^^^^^^^^^^^^^^

The ``address`` field defines the |Address| of the |ContractInstance|.

  :Required: Yes
  :Type: String
  :Format: Hex encoded ``'0x'`` prefixed Ethereum address matching the
   regular expression ``0x[0-9a-fA-F]{40}``.

Transaction: ``transaction``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``transaction`` field defines the transaction hash in which this
|ContractInstance| was created.

  :Required: No
  :Type: String
  :Format: ``0x`` prefixed hex encoded transaction hash.

Block: ``block``
^^^^^^^^^^^^^^^^

The ``block`` field defines the block hash in which this the transaction
which created this *contract instance* was mined.

  :Required: No
  :Type: String
  :Format: ``0x`` prefixed hex encoded block hash.

.. _runtime-bytecode-runtime_bytecode-1:

Runtime Bytecode: ``runtime_bytecode``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``runtime_bytecode`` field defines the runtime portion of bytecode for this
|ContractInstance|.  When present, the value from this field supersedes
the ``runtime_bytecode`` from the |ContractType| for this |ContractInstance|.

  :Required: No
  :Type: Object
  :Format: **must** conform to `the Bytecode Object`_ format.

Every entry in the ``link_references`` for this bytecode **must** have a
corresponding entry in the ``link_dependencies`` section.


.. _compiler-compiler-1:

Compiler: ``compiler``
^^^^^^^^^^^^^^^^^^^^^^

The ``compiler`` field defines the compiler information that was used
during compilation of this |ContractInstance|. This field **should** be
present in all |ContractTypes| which include ``bytecode`` or
``runtime_bytecode``.

  :Required: No
  :Type: Object
  :Format: **must** conform to the `Compiler Information Object`_
   format.

.. _compiler information object:

The *Compiler Information* Object
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``compiler`` field defines the compiler information that was used
during compilation of this |ContractInstance|. This field **should** be
present in all contract instances that locally declare ``runtime_bytecode``.

A *Compiler Information* object is defined to have the following
key/value pairs.

Name ``name``
^^^^^^^^^^^^^

The ``name`` field defines which compiler was used in compilation.

  :Required: Yes
  :Key: ``type``:
  :Type: String


.. _version-version-1:

Version: ``version``
^^^^^^^^^^^^^^^^^^^^

The ``version`` field defines the version of the compiler. The field
**should** be OS agnostic (OS not included in the string) and take the
form of either the stable version in `semver <http://semver.org/>`__ format or if built on a
nightly should be denoted in the form of ``<semver>-<commit-hash>`` ex:
``0.4.8-commit.60cc1668``.

  :Required: Yes
  :Key: ``version``:
  :Type: String

Settings: ``settings``
^^^^^^^^^^^^^^^^^^^^^^

The ``settings`` field defines any settings or configuration that was
used in compilation. For the ``'solc'`` compiler, this **should** conform
to the `Compiler Input and Output Description <http://solidity.readthedocs.io/en/latest/using-the-compiler.html#compiler-input-and-output-json-description>`_.

  :Required: No
  :Key: ``settings``:
  :Type: Object

BIP122 URIs
~~~~~~~~~~~

BIP122 URIs are used to define a blockchain via a subset of the
`BIP-122 <https://github.com/bitcoin/bips/blob/master/bip-0122.mediawiki>`__
spec.

::

   blockchain://<genesis_hash>/block/<latest confirmed block hash>

The ``<genesis hash>`` represents the blockhash of the first block on
the chain, and ``<latest confirmed block hash>`` represents the hash of
the latest block that's been reliably confirmed (package managers should
be free to choose their desired level of confirmations).
