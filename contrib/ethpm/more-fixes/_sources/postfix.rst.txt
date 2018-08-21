.. only:: asciidoc

   Backwards Compatibility
   =======================

   This specification supports backwards compatibility by use of the
   `manifest_version <#manifest-version>`_ property. This specification
   corresponds to version ``2`` as the value for that field.

   Implementations
   ===============

   This submission aims to coincide with development efforts towards widespread
   implementation in commonly-used development tools.

   The following tools are known to have begun or are nearing completion of
   a supporting implementation.

      - `Truffle <http://trufflesuite.com/>`_
      - `Populus <http://populus.readthedocs.io/en/latest/>`_
      - `Embark <https://embark.status.im/>`_

   Full support in implementation **may** require `Further Work`_, specified
   below.

   Further Work
   ============

   This EIP addresses only the data format for package descriptions. Excluded
   from the scope of this specification are:

      - Package registry interface definition
      - Tooling integration, or how packages are stored on disk.

   These efforts **should** be considered separate, warranting future dependent
   EIP submssions.

   Acknowledgements
   ================

   The authors of this document would like to thank the original authors of
   `EIP-190 <https://eips.ethereum.org/EIPS/eip-190>`_,
   `ETHPrize <http://ethprize.io/>`_ for their funding support, all
   community `contributors <https://github.com/ethpm/ethpm-spec/graphs/contributors>`_,
   and the Ethereum community at large.

   Copyright
   =========

   Copyright and related rights waived via `CC0 <https://creativecommons.org/publicdomain/zero/1.0/>`_.
