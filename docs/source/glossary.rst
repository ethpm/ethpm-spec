Glossary
========

The terms in this glossary have been updated to reflect the changes made in V3.

.. include:: _include.rst

.. glossary::

   ABI
      The JSON representation of the application binary interface.
      See the official `specification <https://solidity.readthedocs.io/en/develop/abi-spec.html>`_
      for more information.

   Address
      A public identifier for an account on a particular chain

   Bytecode
      The set of EVM instructions as produced by a compiler. Unless otherwise
      specified this should be assumed to be hexadecimal encoded, representing
      a whole number of bytes, and |prefixed| with ``0x``.

      Bytecode can either be linked or unlinked. (see |Linking|)

      :Unlinked Bytecode: The hexadecimal representation of a contract's EVM
         instructions that contains sections of code that requires |linking|
         for the contract to be functional.

         The sections of code which are unlinked **must** be filled in with zero bytes.

         **Example**: ``0x606060405260e06000730000000000000000000000000000000000000000634d536f``

      :Linked Bytecode: The hexadecimal representation of a contract's EVM
         instructions which has had all |LinkReferences| replaced with the
         desired |LinkValues|.

         **Example**: ``0x606060405260e06000736fe36000604051602001526040518160e060020a634d536f``

   Chain Definition
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

   Content Addressable URI
      Any URI which contains a cryptographic hash which can be used to verify
      the integrity of the content found at the URI.

      The URI format is defined in RFC3986

      It is **recommended** that tools support IPFS and Swarm.

   Contract Alias
      This is a name used to reference a specific |ContractType|. Contract
      aliases **must** be unique within a single |Package|.

      The contract alias **must** use *one of* the following naming schemes:

      -  ``<contract-name>``
      -  ``<contract-name><identifier>``

      The ``<contract-name>`` portion **must** be the same as the
      |ContractName| for this contract type.

      The ``<identifier>`` portion **must** match the regular expression
      ``^[-a-zA-Z0-9]{1,256}$``.

   Contract Instance
      A contract instance a specific deployed version of a |ContractType|.

      All contract instances have an |Address| on some specific chain.

   Contract Instance Name
      A name which refers to a specific |ContractInstance| on a specific
      chain from the deployments of a single |Package|. This name **must** be
      unique across all other contract instances for the given chain. The
      name must conform to the regular expression
      ``^[a-zA-Z][a-zA-Z0-9_$]{0,255}$``

      In cases where there is a single deployed instance of a given
      |ContractType|, package managers **should** use the |ContractAlias| for
      that contract type for this name.

      In cases where there are multiple deployed instances of a given
      contract type, package managers **should** use a name which provides
      some added semantic information as to help differentiate the two
      deployed instances in a meaningful way.

   Contract Name
      The name found in the source code that defines a specific |ContractType|.
      These names **must** conform to the regular expression
      ``^[a-zA-Z_$][a-zA-Z0-9_$]{0,255}$``.

      There can be multiple contracts with the same contract name in a
      projects source files.

   Contract Type
      Refers to a specific contract in the package source.
      This term can be used to refer to an abstract contract, a normal
      contract, or a library. Two contracts are of the same contract type if
      they have the same bytecode.

      Example:

      ::

         contract Wallet {
             ...
         }

      A deployed instance of the ``Wallet`` contract would be of of type
      ``Wallet``.

   Identifier
      Refers generally to a named entity in the |Package|.

      A string matching the regular expression ``^[a-zA-Z][-_a-zA-Z0-9]{0,255}$``

   Link Reference
      A location within a contract's bytecode which needs to be linked.  A link
      reference has the following properties.

        :``offset``: Defines the location within the bytecode where the
          link reference begins.
        :``length``: Defines the length of the reference.
        :``name``: (optional.) A string to identify the reference

   Link Value
      A link value is the value which can be inserted in place of a
      |LinkReference|

   Linking
      The act of replacing |LinkReferences| with |LinkValues| within some
      |Bytecode|.

   Package
      Distribution of an application's source or compiled bytecode along with
      metadata related to authorship, license, versioning, et al.

      For brevity, the term **Package** is often used metonymously to mean
      |PackageManifest|.

   Package Manifest
      A machine-readable description of a package (See
      :ref:`v2-package-specification` for information about the format for package
      manifests.)

   Prefixed
      |Bytecode| string with leading ``0x``.

        :Example: ``0xdeadbeef``

   Unprefixed
      Not |Prefixed|.

        :Example: ``deadbeef``
