.. only:: asciidoc

   Simple Summary
   ==============

   A data format describing a smart contract software package.

   Abstract
   ========

   This EIP defines a data format for *package manifest* documents,
   representing a package of one or more smart contracts, optionally including
   source code and any/all deployed instances across multiple networks. Package
   manifests are minified JSON objects, to be distributed via content
   addressable storage networks, such as IPFS.

   This document presents a natural language description of a formal
   specification for version **2** of this format.

   Motivation
   ==========

   This standard aims to encourage the Ethereum development ecosystem towards
   software best practices around code reuse. By defining an open,
   community-driven package data format standard, this effort seeks to provide
   support for package management tools development by offering a
   general-purpose solution that has been designed with observed common
   practices in mind.

   As version 2 of this specification, this standard seeks to address a number
   of areas of improvement found for the previous version (defined in `EIP-190
   <https://eips.ethereum.org/EIPS/eip-190>`_). This version:

      - Generalizes storage URIs to represent any content addressable URI
        scheme, not only IPFS.

      - Renames *release lockfile* to *package manifest*.

      - Adds support for languages other than Solidity by generalizing the
        compiler information format.

      - Redefines link references to be more flexible, to represent arbitrary
        gaps in bytecode (besides only addresses), in a more straightforward
        way.

      - Forces format strictness, requiring that package manifests contain
        no extraneous whitespace, and sort object keys in alphabetical order,
        to prevent hash mismatches.

.. only:: not asciidoc

   Overview
   ========

   Background
   ----------

   These docs are meant to provide insight into the EVM Smart Contract Packaging
   Specification and facilitate implementation and adoption of these standards.

