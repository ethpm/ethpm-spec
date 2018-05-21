Glossary
========

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
      a whole number of bytes, and prefixed with a ``'0x'``.

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


   Contract Instance
      A contract instance a specific deployed version of a |ContractType|.

      All contract instances have an |Address| on some specific chain.

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
      :ref:`package-specification` for information about the format for package
      manifests.)
