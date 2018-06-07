.. only:: asciidoc

   Rationale
   =========

   The following use cases were considered during the creation of this
   specification.

   :owned:
      A package which contains contracts which are not meant to be
      used by themselves but rather as base contracts to provide
      functionality to other contracts through inheritance.

   :transferable:
      A package which has a single dependency.

   :standard-token:
      A package which contains a reusable contract.

   :safe-math-lib:
      A package which contains deployed instance of one of the package
      contracts.

   :piper-coin:
      A package which contains a deployed instance of a reusable contract
      from a dependency.

   :escrow:
      A package which contains a deployed instance of a local contract
      which is linked against a deployed instance of a local library.

   :wallet:
      A package with a deployed instance of a local contract which is
      linked against a deployed instance of a library from a dependency.

   :wallet-with-send:
      A package with a deployed instance which links against a deep dependency.

   Each use case builds incrementally on the previous one.

   A full listing of `Use Cases <https://ethpm.github.io/ethpm-spec/use-cases.html>`_
   can be found on the hosted version of this specification.

.. only:: not asciidoc

   Use Cases
   =========


   .. include:: _use-cases.rst
