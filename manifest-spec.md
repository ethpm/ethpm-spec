# Package Manifests


## Assumptions

The package manifest specification makes the following assumptions.

1. Package manifests are primarily for non-contract actors and will not be consumed by contracts themselves.
2. Following from that, we will likely store the manifest on some distributed protocol like IPFS or Swarm (although this is jumping ahead in the discussion).
3. Since our off chain actors are primarily software, the message format needs to be easily readable by most programming languages.
4. That said, it's likely human actors will write the manifest, meaning it needs to be in a format humans can easily understand and comprehend.
5. Contrasting to the above, we need a format that takes up the least amount of space possible so that it costs the least to make available


## Data to be stored within the manifest

- package name
- author
- version (preferably [semver](http://semver.org/))
- description
- contract metadata
  - abi
  - unlinked binary
  - deployed address if applicable
  - name/address pairs for linked libraries
  - compiler version for bytecode verification
  - key/value pairs of the sha3 hash of events this contract can emit with the abi definition of that event (i.e., the contract metadata should contain information for all events that can be triggered by this contract, including those triggered by linked libraries)
- external project URIs (homepage, repository uri, etc.)
- dependencies (i.e., references to other packages and versions)
- updated time (likely added by the packager)


## Manifest format

Package Manifests can be stored in the following formats:

* JSON document in a `package.json` file.
