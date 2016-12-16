# EVM Smart Contract Packaging Specification

[![Join the chat at https://gitter.im/ethpm/Lobby](https://badges.gitter.im/ethpm/Lobby.svg)](https://gitter.im/ethpm/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Ethereum Packaging Specification


## Specifications

* [Package Manifest](./package-manifest-spec.md)
* [Release Lock File](./release-lock-file-spec.md)


## Definitions

The following *types* are used within this specification.


### Contract Name

A string matching the regular expression `[_a-zA-Z][_a-zA-Z0-9]*`


### Package Name

A string matching the regular expression `[a-zA-Z][-_a-zA-Z0-9]*`


### IPFS URI

An URI in the format `ipfs://<multihash>[/<path>]`


### Chain Definition via BIP122 URI

An URI in the format `blockchain://<chain_id>/block/<block_hash>`

* `chain_id` is the unprefixed genesis hash for the chain.
* `block_hash` is the hash of a block on the chain.

A chain is considered to match a chain definition if the the genesis block hash
matches the `chain_id` and the block defined by `block_hash` can be found on
that chain.  It is possible for multiple chains to match a single URI, in which
case all chains are considered valid matches


## Resources

* https://pad.riseup.net/p/7x3G896a3NLA
* https://medium.com/@sdboyer/so-you-want-to-write-a-package-manager-4ae9c17d9527


## Use Cases

The following use cases were considered during the creation of this
specification.  Each use case builds on the previous ones.


### Stand Alone Package with Reusable Code

The common *owned* pattern is a common example for this use case.i

```javascript
contract owned {
    address owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyowner { if (msg.sender != owner) throw; _; }
}
```

> For this example we will assume this file is located in the solidity source file `./contracts/owned.sol`

The `owned` package contains a single solidity source source file which is
intended to be used as a base contract for other contracts to be inherited
from.  The package does not define any pre-deployed addresses for the *owned*
contract.

The smallest Release Lockfile for this package looks like this:

```javascript
{
  "lockfile_version": "1",
  "version": "1.0.0",
  "package_name": "owned",
  "sources": {
    "./contracts/owned.sol": "ipfs://Qme6goiKwGZngCJKJSHmbm5zqb8tB7xxbZq8f7ZeeMcsxw"
  }
}
```

A Release Lockfile which includes more than the minimum information would look like this.


```javascript
{
  "lockfile_version": "1",
  "version": "1.0.0",
  "package_name": "owned",
  "package_meta": {
    "license": "MIT",
    "authors": [
      "Piper Merriam <pipermerriam@gmail.com>"
    ],
    "description": "Reusable contracts which implement a priviledged 'owner' model for authorization",
    "keywords": [
      "authorization"
    ],
    "links": {
      "documentation": "ipfs://QmQiqrwqdav5bV8mtv4PqGksGcDWo43f7PAZYwhJqNEv2j"
    }
  },
  "sources": {
    "./contracts/owned.sol": "ipfs://Qme6goiKwGZngCJKJSHmbm5zqb8tB7xxbZq8f7ZeeMcsxw"
  }
}
```


### Stand Alone Package with Reusable Code and a dependency

Now that we've seen what a simple package looks like, lets see how to dependencies are declared.
dependencies.

The next package will implement the *transferrable* pattern.

The IPFS URI for the previous `owned` Release Lockfile `QmPBCJJBM9SYXU56hHSxpRNBvbNcjjDxrSnV1MwoPmHCqW`
